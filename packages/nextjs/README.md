# ⚡ Next.js

> Next.js integration utilities for Telegraph components with React Server Components support.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/nextjs.svg)](https://www.npmjs.com/package/@telegraph/nextjs)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/nextjs)](https://bundlephobia.com/result?p=@telegraph/nextjs)
[![license](https://img.shields.io/npm/l/@telegraph/nextjs)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/nextjs
```

> **Note**: This package has no stylesheets required.

## Quick Start

```tsx
// next.config.js or next.config.mjs
import { withTelegraph } from "@telegraph/nextjs";

const nextConfig = {
  // Your existing Next.js config
};

export default withTelegraph()(nextConfig);
```

```tsx
// app/page.tsx (App Router) or pages/index.tsx (Pages Router)
import { Button } from "@telegraph/button";

export default function HomePage() {
  return (
    <div className="tgph">
      <Button>Click me</Button>
    </div>
  );
}
```

## API Reference

### `withTelegraph()`

Higher-order function that configures Next.js to work seamlessly with Telegraph components.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| Returns | `(nextConfig: NextConfig) => NextConfig` | - | Function that accepts and returns Next.js config |

#### Usage

```tsx
import { withTelegraph } from "@telegraph/nextjs";

// Basic usage
export default withTelegraph()(nextConfig);

// With existing config
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['example.com'],
  },
};

export default withTelegraph()(nextConfig);
```

## What It Does

The `withTelegraph` plugin automatically configures your Next.js application to work with Telegraph components by:

1. **Adding "use client" Directives**: Automatically prepends `"use client"` to Telegraph component files for React Server Components compatibility
2. **Webpack Configuration**: Configures webpack loaders to process Telegraph packages correctly
3. **Development Support**: Includes special handling for local Telegraph development

### Webpack Loader

The plugin includes a custom webpack loader that:
- Targets all `@telegraph/*` packages in `node_modules`
- Adds `"use client"` directive to make components client-side compatible
- Supports local development when `NEXT_PUBLIC_IN_TELEGRAPH_REPO=1`

## Usage Patterns

### App Router (Recommended)

```tsx
// app/layout.tsx
import "@telegraph/button/default.css";
import "@telegraph/input/default.css";
// ... other Telegraph component styles

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="tgph">
        {children}
      </body>
    </html>
  );
}
```

```tsx
// app/page.tsx
import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";

export default function HomePage() {
  return (
    <Stack direction="column" gap="4" p="6">
      <h1>Welcome to Telegraph + Next.js</h1>
      <Input placeholder="Enter your name" />
      <Button>Get Started</Button>
    </Stack>
  );
}
```

### Pages Router

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import "@telegraph/button/default.css";
import "@telegraph/input/default.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="tgph">
      <Component {...pageProps} />
    </div>
  );
}
```

```tsx
// pages/index.tsx
import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";

export default function HomePage() {
  return (
    <Stack direction="column" gap="4" p="6">
      <h1>Welcome to Telegraph + Next.js</h1>
      <Input placeholder="Enter your name" />
      <Button>Get Started</Button>
    </Stack>
  );
}
```

### Client Components

When you need to use Telegraph components in client components:

```tsx
// components/InteractiveForm.tsx
"use client";

import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Modal } from "@telegraph/modal";
import { useState } from "react";

export function InteractiveForm() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <>
      <Input 
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text" 
      />
      <Button onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      
      <Modal.Root open={open} onOpenChange={setOpen} a11yTitle="Example Modal">
        <Modal.Content>
          <Modal.Header>
            <h2>Modal Title</h2>
            <Modal.Close />
          </Modal.Header>
          <Modal.Body>
            <p>You entered: {value}</p>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
```

```tsx
// app/page.tsx (Server Component)
import { InteractiveForm } from "../components/InteractiveForm";

export default function HomePage() {
  return (
    <div>
      <h1>My App</h1>
      <InteractiveForm />
    </div>
  );
}
```

## Advanced Usage

### Custom Next.js Configuration

```tsx
// next.config.js
import { withTelegraph } from "@telegraph/nextjs";

const nextConfig = {
  // Experimental features
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  
  // Images configuration
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Custom webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Your custom webpack configuration
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },
};

// Apply Telegraph configuration
export default withTelegraph()(nextConfig);
```

### Multiple Wrapper Functions

```tsx
// next.config.js
import { withTelegraph } from "@telegraph/nextjs";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Your config
};

// Compose multiple wrappers
export default bundleAnalyzer(
  withSentryConfig(
    withTelegraph()(nextConfig),
    sentryWebpackPluginOptions
  )
);
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### CSS Import Strategies

#### Global CSS (Recommended)

```tsx
// app/layout.tsx or pages/_app.tsx
import "@telegraph/button/default.css";
import "@telegraph/input/default.css";
import "@telegraph/modal/default.css";
import "@telegraph/layout/default.css";
// Import all Telegraph styles you need
```

#### CSS Modules

```css
/* styles/telegraph.module.css */
@import "@telegraph/button";
@import "@telegraph/input";
@import "@telegraph/modal";
@import "@telegraph/layout";
```

```tsx
// components/MyComponent.tsx
import styles from "../styles/telegraph.module.css";

export function MyComponent() {
  return (
    <div className={styles.tgph}>
      {/* Telegraph components */}
    </div>
  );
}
```

#### Dynamic Imports

```tsx
// For code splitting CSS
import dynamic from 'next/dynamic';

const Modal = dynamic(() => import('@telegraph/modal').then(mod => mod.Modal), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// Import CSS only when needed
const openModal = () => {
  import('@telegraph/modal/default.css');
  setModalOpen(true);
};
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_IN_TELEGRAPH_REPO=1  # For local Telegraph development
```

### Server Components vs Client Components

#### ✅ Server Components (Default)

```tsx
// These work in Server Components
import { Box, Stack } from "@telegraph/layout";

export default function ServerPage() {
  return (
    <Stack direction="column" gap="4">
      <Box p="4" bg="surface-1">
        <h1>Server-rendered content</h1>
      </Box>
    </Stack>
  );
}
```

#### ⚠️ Client Components Required

```tsx
// These require "use client"
"use client";

import { Button } from "@telegraph/button";
import { Modal } from "@telegraph/modal";
import { useState } from "react";

export function ClientPage() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal.Root open={open} onOpenChange={setOpen} a11yTitle="Modal">
        {/* Modal content */}
      </Modal.Root>
    </>
  );
}
```

### Error Handling

```tsx
// app/error.tsx
"use client";

import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Stack direction="column" align="center" gap="4" p="8">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </Stack>
  );
}
```

### Loading States

```tsx
// app/loading.tsx
import { Spinner } from "@telegraph/spinner";
import { Stack } from "@telegraph/layout";

export default function Loading() {
  return (
    <Stack align="center" justify="center" minH="screen">
      <Spinner size="lg" />
    </Stack>
  );
}
```

## Troubleshooting

### Common Issues

#### 1. "use client" Not Added Automatically

**Problem**: Components not working in client components.

**Solution**: Ensure `withTelegraph()` is properly configured in `next.config.js`:

```tsx
// next.config.js
import { withTelegraph } from "@telegraph/nextjs";

export default withTelegraph()(nextConfig);
```

#### 2. CSS Styles Not Loading

**Problem**: Telegraph components appear unstyled.

**Solution**: Import CSS and add `className="tgph"`:

```tsx
// app/layout.tsx
import "@telegraph/button/default.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="tgph">
        {children}
      </body>
    </html>
  );
}
```

#### 3. Build Errors with Webpack

**Problem**: Build fails with webpack loader errors.

**Solution**: Check Next.js version compatibility and configuration:

```tsx
// Ensure correct Next.js config format
export default withTelegraph()(nextConfig);

// Not this:
export default withTelegraph(nextConfig); // ❌
```

#### 4. TypeScript Errors

**Problem**: TypeScript cannot find Telegraph module types.

**Solution**: Install types and configure TypeScript:

```bash
npm install --save-dev @types/react @types/react-dom
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "jsx": "preserve"
  }
}
```

#### 5. Development Mode Issues

**Problem**: Components not working in local development.

**Solution**: Set environment variable for local development:

```bash
# .env.local
NEXT_PUBLIC_IN_TELEGRAPH_REPO=1
```

### Performance Optimization

#### Bundle Size Analysis

```bash
npm install --save-dev @next/bundle-analyzer
```

```tsx
// next.config.js
import withBundleAnalyzer from "@next/bundle-analyzer";
import { withTelegraph } from "@telegraph/nextjs";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(withTelegraph()(nextConfig));
```

```bash
ANALYZE=true npm run build
```

#### Tree Shaking

Telegraph components are tree-shakeable by default:

```tsx
// ✅ Good - only imports needed code
import { Button } from "@telegraph/button";

// ❌ Avoid - imports entire library
import * as Telegraph from "@telegraph/button";
```

#### Code Splitting

```tsx
// Dynamic imports for large components
import dynamic from 'next/dynamic';

const Modal = dynamic(() => 
  import('@telegraph/modal').then(mod => mod.Modal), {
  loading: () => <div>Loading modal...</div>,
  ssr: false
});
```

## Migration Guide

### From Create React App

1. Install Next.js and Telegraph:

```bash
npm install next react react-dom @telegraph/nextjs
npm install @telegraph/button @telegraph/input @telegraph/layout
```

2. Create Next.js config:

```tsx
// next.config.js
import { withTelegraph } from "@telegraph/nextjs";

export default withTelegraph()({});
```

3. Move components to App Router structure:

```
src/
  components/     → components/
  pages/         → app/
  App.js         → app/layout.tsx
  index.js       → app/page.tsx
```

4. Update imports and add CSS:

```tsx
// app/layout.tsx
import "@telegraph/button/default.css";
import "@telegraph/input/default.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="tgph">
        {children}
      </body>
    </html>
  );
}
```

### From Pages Router to App Router

1. Update Next.js config (no changes needed for Telegraph):

```tsx
// next.config.js remains the same
export default withTelegraph()(nextConfig);
```

2. Move CSS imports from `_app.tsx` to `layout.tsx`:

```tsx
// app/layout.tsx
import "@telegraph/button/default.css";
```

3. Convert pages to app directory structure:

```
pages/
  _app.tsx       → app/layout.tsx
  index.tsx      → app/page.tsx
  about.tsx      → app/about/page.tsx
```

## Best Practices

1. **CSS Organization**: Import all Telegraph CSS in your root layout
2. **Component Boundaries**: Use "use client" only when necessary
3. **Performance**: Leverage Next.js built-in optimizations
4. **Type Safety**: Use TypeScript for better development experience
5. **Testing**: Test both server and client component scenarios

## Design Tokens & Styling

The Next.js plugin doesn't affect Telegraph's design tokens. Follow standard Telegraph styling practices:

```tsx
// Use Telegraph design tokens
<Box p="4" bg="surface-1" rounded="2">
  <Text color="gray-12">Content</Text>
</Box>

// Custom CSS variables work as expected
<Box style={{ '--custom-spacing': '24px' }}>
  Content
</Box>
```

## Testing

### Testing Library Setup

```tsx
// __tests__/setup.ts
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));
```

### Component Testing

```tsx
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@telegraph/button';

test('renders button correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
});
```

### Integration Testing

```tsx
// __tests__/pages/index.test.tsx
import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';

// Mock Telegraph components if needed
jest.mock('@telegraph/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>
}));

test('renders homepage', () => {
  render(<HomePage />);
  expect(screen.getByText('Welcome')).toBeInTheDocument();
});
```

## Examples

### E-commerce Product Page

```tsx
// app/products/[id]/page.tsx
import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Box, Stack } from "@telegraph/layout";
import { AddToCartForm } from "./AddToCartForm";

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <Stack direction="column" gap="6" p="6">
      <Stack direction="row" gap="8">
        {/* Product images */}
        <Box flex="1">
          <img src="/product.jpg" alt="Product" />
        </Box>
        
        {/* Product details */}
        <Stack direction="column" gap="4" flex="1">
          <h1>Product Name</h1>
          <p>Product description...</p>
          <AddToCartForm productId={params.id} />
        </Stack>
      </Stack>
    </Stack>
  );
}
```

```tsx
// app/products/[id]/AddToCartForm.tsx
"use client";

import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Select } from "@telegraph/select";
import { Stack } from "@telegraph/layout";
import { useState } from "react";

export function AddToCartForm({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState("1");
  const [size, setSize] = useState("");

  const handleAddToCart = () => {
    // Add to cart logic
    console.log({ productId, quantity, size });
  };

  return (
    <Stack direction="column" gap="4">
      <Select value={size} onValueChange={setSize} placeholder="Select size">
        <Select.Option value="xs">XS</Select.Option>
        <Select.Option value="s">S</Select.Option>
        <Select.Option value="m">M</Select.Option>
        <Select.Option value="l">L</Select.Option>
      </Select>
      
      <Input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
        placeholder="Quantity"
      />
      
      <Button onClick={handleAddToCart} disabled={!size}>
        Add to Cart
      </Button>
    </Stack>
  );
}
```

### Dashboard with Server Components

```tsx
// app/dashboard/page.tsx
import { Box, Stack } from "@telegraph/layout";
import { StatsCard } from "./StatsCard";
import { InteractiveChart } from "./InteractiveChart";

// Server Component - pre-rendered
export default async function DashboardPage() {
  const stats = await fetchStats(); // Server-side data fetching
  
  return (
    <Stack direction="column" gap="6" p="6">
      <h1>Dashboard</h1>
      
      {/* Server-rendered stats */}
      <Stack direction="row" gap="4">
        {stats.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </Stack>
      
      {/* Client-interactive components */}
      <InteractiveChart />
    </Stack>
  );
}
```

```tsx
// app/dashboard/InteractiveChart.tsx
"use client";

import { Button } from "@telegraph/button";
import { Select } from "@telegraph/select";
import { Box } from "@telegraph/layout";
import { useState } from "react";

export function InteractiveChart() {
  const [timeRange, setTimeRange] = useState("7d");
  
  return (
    <Box p="4" bg="surface-1" rounded="2">
      <Stack direction="row" align="center" justify="between" mb="4">
        <h2>Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <Select.Option value="7d">Last 7 days</Select.Option>
          <Select.Option value="30d">Last 30 days</Select.Option>
          <Select.Option value="90d">Last 90 days</Select.Option>
        </Select>
      </Stack>
      
      {/* Chart component */}
      <div>Chart for {timeRange}</div>
    </Box>
  );
}
```

### Blog with MDX

```tsx
// next.config.js
import { withTelegraph } from "@telegraph/nextjs";
import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
});

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

export default withMDX(withTelegraph()(nextConfig));
```

```tsx
// app/blog/[slug]/page.tsx
import { Box, Stack } from "@telegraph/layout";
import { Button } from "@telegraph/button";
import { MDXContent } from "./content.mdx";

export default function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <Stack direction="column" gap="6" maxW="prose" mx="auto" p="6">
      <Box>
        <Button variant="ghost" href="/blog">
          ← Back to Blog
        </Button>
      </Box>
      
      <article>
        <MDXContent />
      </article>
    </Stack>
  );
}
```

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Telegraph Design System](https://github.com/knocklabs/telegraph)
- [CHANGELOG](./CHANGELOG.md)

## Contributing

To contribute to this package:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`
4. Test with a Next.js project

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
