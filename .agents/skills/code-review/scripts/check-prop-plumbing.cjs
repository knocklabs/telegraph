#!/usr/bin/env node
/**
 * Finds props that a Telegraph component's type and its body disagree about.
 *
 * Three sweeps, each a separate failure mode:
 *
 *   A  DISCARDED   a binding renamed to `_foo`. Deliberately thrown away, so
 *                  the public props type must not still advertise `foo`.
 *   B  DROPPED     a binding never referenced again inside its own function
 *                  body. The prop type-checks and does nothing.
 *   C  LEAKED      a prop declared in an inline object literal on a `*Props`
 *                  type that the file never destructures. It stays in the rest
 *                  element and gets spread onto the rendered element, so an
 *                  invented prop reaches the DOM as an attribute.
 *
 * B is the only sweep that fails the run. A and C need a human verdict: a
 * discard can be correct once the type drops the prop too, and a declared prop
 * can be forwarded on purpose to a Telegraph child that consumes it.
 *
 * Built on the TypeScript AST. A regex sweep over the same files under-reports:
 * a comment that contains `as="div"` corrupts the parse and the hit disappears.
 *
 * Usage:  node .agents/skills/code-review/scripts/check-prop-plumbing.cjs [dir]
 * Default dir is `packages` at the repo root.
 */
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const ts = require("typescript");

const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();
const root = path.resolve(repoRoot, process.argv[2] || "packages");

// Spread onward and consumed by a Telegraph child rather than the DOM.
const FORWARDED = new Set(["children", "className", "style", "tgphRef", "as"]);

const sourceFiles = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      sourceFiles(full, out);
    } else if (
      entry.name.endsWith(".tsx") &&
      !/\.(test|test-d|stories|fixtures|browser\.test)\./.test(entry.name)
    ) {
      out.push(full);
    }
  }
  return out;
};

const enclosingFunction = (node) => {
  for (let n = node.parent; n; n = n.parent) {
    if (
      ts.isFunctionDeclaration(n) ||
      ts.isArrowFunction(n) ||
      ts.isFunctionExpression(n) ||
      ts.isMethodDeclaration(n)
    ) {
      return n;
    }
  }
  return null;
};

const bindingName = (element, src) =>
  (element.propertyName ?? element.name).getText(src).replace(/["']/g, "");

const discarded = [];
const dropped = [];
const leaked = [];

for (const file of sourceFiles(root)) {
  const src = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const rel = path.relative(repoRoot, file);
  const lineOf = (node) =>
    src.getLineAndCharacterOfPosition(node.getStart(src)).line + 1;

  const declaredInLiteral = new Map();
  const destructuredAnywhere = new Set();

  // A and B, for one object binding pattern that unpacks props.
  const checkPattern = (pattern, fn) => {
    // Identifiers referenced inside the function body, excluding the binding
    // pattern itself.
    const referenced = new Set();
    if (fn?.body) {
      const collect = (n) => {
        if (ts.isIdentifier(n)) {
          let inPattern = false;
          for (let p = n.parent; p && p !== fn; p = p.parent) {
            if (p === pattern) {
              inPattern = true;
              break;
            }
          }
          if (!inPattern) referenced.add(n.text);
        }
        ts.forEachChild(n, collect);
      };
      ts.forEachChild(fn.body, collect);
    }

    for (const element of pattern.elements) {
      if (element.dotDotDotToken || !ts.isIdentifier(element.name)) continue;
      const local = element.name.text;
      const at = {
        rel,
        line: lineOf(element),
        prop: bindingName(element, src),
        local,
      };

      if (local.startsWith("_")) discarded.push(at);
      else if (!referenced.has(local)) dropped.push(at);
    }
  };

  const visit = (node) => {
    // A and B, form 1: `const { as, ...props } = rootProps`.
    if (
      ts.isVariableDeclaration(node) &&
      ts.isObjectBindingPattern(node.name) &&
      node.initializer &&
      /props/i.test(node.initializer.getText(src))
    ) {
      checkPattern(node.name, enclosingFunction(node));
    }

    // A and B, form 2: `({ as, ...props }: RootProps) => …`. Both forms are in
    // use, so a sweep that covers only one leaves half the components unchecked.
    if (
      ts.isParameter(node) &&
      ts.isObjectBindingPattern(node.name) &&
      node.type &&
      /Props/.test(node.type.getText(src))
    ) {
      checkPattern(node.name, node.parent);
    }

    // C: props invented on an inline object literal of an exported `*Props`
    // type. Exported only, because a leak needs a consumer able to pass the
    // prop; internal context and render-prop types are spread by hand.
    if (
      ts.isTypeAliasDeclaration(node) &&
      node.name.text.endsWith("Props") &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      const owner = node.name.text;
      const collectMembers = (type) => {
        if (ts.isTypeLiteralNode(type)) {
          for (const member of type.members) {
            if (!ts.isPropertySignature(member) || !member.name) continue;
            const prop = member.name.getText(src).replace(/["']/g, "");
            if (!declaredInLiteral.has(prop)) {
              declaredInLiteral.set(prop, { line: lineOf(member), owner });
            }
          }
        }
        ts.forEachChild(type, collectMembers);
      };
      collectMembers(node.type);
    }

    if (ts.isObjectBindingPattern(node)) {
      for (const element of node.elements) {
        if (element.dotDotDotToken) continue;
        destructuredAnywhere.add(bindingName(element, src));
      }
    }

    ts.forEachChild(node, visit);
  };
  visit(src);

  for (const [prop, where] of declaredInLiteral) {
    if (destructuredAnywhere.has(prop) || FORWARDED.has(prop)) continue;
    leaked.push({ rel, prop, ...where });
  }
}

const report = (title, rows, format) => {
  console.log(`\n${title}`);
  if (rows.length === 0) {
    console.log("  none");
    return;
  }
  for (const row of rows) console.log(`  ${format(row)}`);
};

report(
  "A. Discarded in the body — the public props type must not advertise these",
  discarded,
  (d) => `${d.rel}:${d.line}  ${d.prop} -> ${d.local}`,
);
report(
  "B. Destructured then never referenced — accepted and silently ignored",
  dropped,
  (d) => `${d.rel}:${d.line}  ${d.prop}`,
);
report(
  "C. Declared but never destructured — spreads onto the element and reaches the DOM",
  leaked,
  (d) => `${d.rel}:${d.line}  ${d.prop}  (declared on ${d.owner})`,
);

console.log(
  `\n${discarded.length} discarded, ${dropped.length} dropped, ${leaked.length} possibly leaked`,
);

// Only B is unambiguous. A and C are reported for a human verdict.
process.exit(dropped.length > 0 ? 1 : 0);
