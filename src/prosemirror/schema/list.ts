import { Plugin } from "prosemirror-state";
import { INodeConfig } from "../types";
import {
  liftListItem,
  sinkListItem,
  splitListItem,
  wrapInList,
} from "prosemirror-schema-list";
import { Schema } from "prosemirror-model";
import { keymap } from "prosemirror-keymap";
import { EditorView } from "prosemirror-view";

export const listItem: INodeConfig = {
  node: {
    name: "list_item",
    schema: {
      group: "block",
      content: "paragraph block*",
      toDOM() {
        return ["li", 0];
      },
      parseDOM: [{ tag: "li" }],
    },
  },
};

export const bulletList: INodeConfig = {
  node: {
    name: "bullet_list",
    schema: {
      group: "block",
      content: `${listItem.node.name}+`,
      toDOM() {
        return ["ul", 0];
      },
      parseDOM: [{ tag: "ul" }],
    },
  },
  plugins: (schema: Schema) => [
    new Plugin({
      props: {
        handleTextInput(view, from, to, text) {
          const { state, dispatch } = view;
          const { $from } = state.selection;
          const paragraphNode = $from.parent;

          // checken ob der Input valid ist
          const checkText = paragraphNode.textBetween(
            0,
            $from.parentOffset,
            null,
            "\n"
          );
          const shouldWrapInList = checkText === "-";
          if (!shouldWrapInList) return false;

          const tr = state.tr;

          // Lösche das eingegebene Zeichen "-"
          tr.delete(from - 1, to);

          // Erstelle eine Bullet-Liste
          dispatch(tr);
          wrapInList(state.schema.nodes.bullet_list)(view.state, dispatch);
          return true;
        },
      },
    }),
    listKeymapPlugin(schema),
  ],
};

export const orderedList: INodeConfig = {
  node: {
    name: "ordered_list",
    schema: {
      group: "block",
      content: `${listItem.node.name}+`,
      attrs: { order: { default: 1 } },
      toDOM(node) {
        return ["ol", { start: node.attrs.order }, 0];
      },
      parseDOM: [
        {
          tag: "ol",
          getAttrs: (dom) => ({
            order: dom.hasAttribute("start") ? +dom.getAttribute("start")! : 1,
          }),
        },
      ],
    },
  },
  plugins: (schema: Schema) => [
    new Plugin({
      props: {
        handleTextInput(view, from, to, text) {
          const { state, dispatch } = view;
          const { $from } = state.selection;
          const paragraphNode = $from.parent;

          // Prüfe auf "1. ", "2. " usw. (Ordered List)
          const orderedListMatch = paragraphNode
            .textBetween(0, $from.parentOffset, null, "\n")
            .match(/^(\d+)\.$/);
          if (!orderedListMatch) return false; // Wenn kein Muster erkannt wurde

          const tr = state.tr;

          // Lösche die Eingabe "1."
          tr.delete(from - orderedListMatch[0].length, to);

          // Erstelle eine Ordered-Liste
          dispatch(tr);
          wrapInList(state.schema.nodes.ordered_list)(view.state, dispatch);
          return true;
        },
      },
    }),
    listKeymapPlugin(schema),
  ],
};

const listKeymapPlugin = (schema: Schema) => {
  return keymap({
    Enter: splitListItem(schema.nodes.list_item),
    Tab: sinkListItem(schema.nodes.list_item),
    "Shift-Tab": liftListItem(schema.nodes.list_item),
  });
};
