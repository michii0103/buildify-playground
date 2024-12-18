import { INodeConfig } from "../types";

export const paragraph: INodeConfig = {
  node: {
    name: "paragraph",
    schema: {
      group: "block",
      content: "inline*",
      toDOM() {
        return ["p", 0];
      },
      parseDOM: [{ tag: "p" }],
    },
  },
};
