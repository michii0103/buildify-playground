import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { IMenuItem } from "../types";
import { BPToolbar } from "../bp-toolbar";

export function floatingToolbarPlugin(menuItems: IMenuItem[]) {
  return new Plugin({
    view(editorView: EditorView) {
      const toolbar = document.createElement("bp-toolbar") as BPToolbar;
      toolbar.style.padding = "4px";
      toolbar.style.backgroundColor = "#333";
      toolbar.style.position = "absolute";
      toolbar.style.display = "none";
      toolbar.menuItems = menuItems;
      toolbar.view = editorView;

      editorView.dom.parentElement?.appendChild(toolbar);

      function updateToolbarPosition() {
        const { state, dom } = editorView;
        const { $from } = state.selection;

        if (!$from || state.selection.from === state.selection.to) {
          toolbar.style.display = "none";
          return;
        }

        const coords = dom.getBoundingClientRect();
        const fromCoords = editorView.coordsAtPos($from.pos);

        toolbar.style.display = "block";
        toolbar.style.left = `${
          fromCoords.left - coords.left + window.scrollX
        }px`;
        toolbar.style.top = `${
          fromCoords.top -
          coords.top +
          window.scrollY -
          toolbar.offsetHeight -
          5
        }px`;
      }

      return {
        update() {
          toolbar.requestUpdate();
          updateToolbarPosition();
        },
        destroy() {
          toolbar.remove();
        },
      };
    },
  });
}
