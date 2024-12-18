import { INodeConfig } from "../types";

export const doc: INodeConfig = {
  node: {
    name: "doc",
    schema: {
      content: "block+",
    },
  },
};
