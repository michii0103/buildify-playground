import { EditorView } from "prosemirror-view";
import { IMarkConfig } from "../types";
import { getMarkTypeByName } from "../helper/getMarkTypeByName";
import { toggleMark } from "../helper/toggleMark";

export const bold: IMarkConfig = {
  mark: {
    name: "bold",
    schema: {
      toDOM() {
        return ["strong", 0];
      },
      parseDOM: [{ tag: "strong" }, { style: "font-weight=bold" }],
    },
  },
  menuItems: [
    {
      label: "Fett",
      run: (editorView: EditorView) => {
        toggleMark({ markName: bold.mark.name, view: editorView, attrs: {} })(
          editorView.state,
          editorView.dispatch
        );
      },
      isActive: (editorView) => {
        return toggleMark({
          markName: bold.mark.name,
          view: editorView,
          attrs: {},
        })(editorView.state);
      },
    },
  ],
};
