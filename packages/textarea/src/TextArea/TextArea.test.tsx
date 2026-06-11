import React from "react";
import { describe, it } from "vitest";

import { TextArea } from "./TextArea";

describe("TextArea", () => {
  describe("type inheritance", () => {
    it("accepts the textarea as prop for backwards compatibility", () => {
      const withTextareaAs = <TextArea as="textarea" />;
      void withTextareaAs;
    });
  });
});
