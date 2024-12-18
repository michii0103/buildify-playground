import { EditorView } from "prosemirror-view";
import { IMarkConfig } from "../types";
import { getMarkTypeByName } from "../helper/getMarkTypeByName";
import { toggleMark } from "../helper/toggleMark";

export const italic: IMarkConfig = {
  mark: {
    name: "italic",
    schema: {
      toDOM() {
        return ["em", 0];
      },
      parseDOM: [{ tag: "em" }, { style: "font-style=italic" }],
    },
  },
  menuItems: [
    {
      label: "Kursiv",
      run: (editorView: EditorView) => {
        toggleMark({ markName: italic.mark.name, view: editorView, attrs: {} })(
          editorView.state,
          editorView.dispatch
        );
      },
      isActive: (editorView) => {
        return toggleMark({
          markName: italic.mark.name,
          view: editorView,
          attrs: {},
        })(editorView.state);
      },
    },
  ],
};
