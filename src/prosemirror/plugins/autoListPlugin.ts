import { wrapInList } from "prosemirror-schema-list";
import { Plugin } from "prosemirror-state";

// Plugin for auto-list creation
export const autoListPlugin = new Plugin({
  props: {
    handleTextInput(view, from, to, text) {
      const { state, dispatch } = view;
      const { $from } = state.selection;
      const paragraphNode = $from.parent;

      // 1. Prüfe auf "- " (Bullet List)
      if (
        paragraphNode.textBetween(0, $from.parentOffset, null, "\n") === "-"
      ) {
        const tr = state.tr;

        // Lösche das eingegebene Zeichen "-"
        tr.delete(from - 1, to);

        // Erstelle eine Bullet-Liste
        dispatch(tr);
        wrapInList(state.schema.nodes.bullet_list)(view.state, dispatch);
        return true;
      }

      // 2. Prüfe auf "1. ", "2. " usw. (Ordered List)
      const orderedListMatch = paragraphNode
        .textBetween(0, $from.parentOffset, null, "\n")
        .match(/^(\d+)\.$/);
      if (orderedListMatch) {
        const tr = state.tr;

        // Lösche die Eingabe "1."
        tr.delete(from - orderedListMatch[0].length, to);

        // Erstelle eine Ordered-Liste
        dispatch(tr);
        wrapInList(state.schema.nodes.ordered_list)(view.state, dispatch);
        return true;
      }

      return false; // Wenn kein Muster erkannt wurde
    },
  },
});
