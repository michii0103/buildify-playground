import { Plugin } from "prosemirror-state";

export function editorUpdatedCallbackPlugin(callback: () => void): Plugin {
  return new Plugin({
    view() {
      return {
        update(view) {
          console.log("View updated: ");
          callback();
        },
      };
    },
  });
}
