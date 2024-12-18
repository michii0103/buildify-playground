import { Schema } from "prosemirror-model";

export const editorSchema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: {
      group: "block",
      content: "inline*",
      toDOM() {
        return ["p", 0];
      },
      parseDOM: [{ tag: "p" }],
    },
    text: { group: "inline" },
    bullet_list: {
      group: "block",
      content: "list_item+",
      toDOM() {
        return ["ul", 0];
      },
      parseDOM: [{ tag: "ul" }],
    },
    ordered_list: {
      group: "block",
      content: "list_item+",
      attrs: { order: { default: 1 } },
      toDOM(node) {
        return ["ol", { start: node.attrs.order }, 0];
      },
      parseDOM: [
        {
          tag: "ol",
          getAttrs: (dom) => ({
            order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1,
          }),
        },
      ],
    },
    list_item: {
      group: "block",
      content: "paragraph block*",
      toDOM() {
        return ["li", 0];
      },
      parseDOM: [{ tag: "li" }],
    },
  },
  marks: {
    bold: {
      toDOM() {
        return ["strong", 0];
      },
      parseDOM: [{ tag: "strong" }, { style: "font-weight=bold" }],
    },
    italic: {
      toDOM() {
        return ["em", 0];
      },
      parseDOM: [{ tag: "em" }, { style: "font-style=italic" }],
    },
  },
});
