import { EditorState, Transaction } from "prosemirror-state";
import { Mark } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

function doesMarkMatchAttributes(
  mark: Mark,
  attrs: Record<string, any>
): boolean {
  return Object.keys(attrs).every((key) => mark.attrs[key] === attrs[key]);
}

export function toggleMark({
  markName,
  view,
  attrs,
}: {
  markName: string;
  view: EditorView;
  attrs: Record<string, any>;
}) {
  return (
    state: EditorState,
    dispatch?: (transaction: Transaction) => void
  ) => {
    const { schema, tr, selection } = state;
    const { from, to, empty } = selection;
    const markType = schema.marks[markName];

    if (!markType) {
      throw new Error(`No mark with identifier '${markName}' found in schema`);
    }

    // Prüfe, ob die Markierungen im aktuellen Kontext bereits vorhanden sind
    const isMarkActive = (): boolean => {
      if (empty) {
        // Prüfe die gespeicherten Markierungen oder die aktuellen Marks an der Cursorposition
        const marks = state.storedMarks || selection.$from.marks();
        return marks.some(
          (mark) =>
            mark.type === markType && doesMarkMatchAttributes(mark, attrs)
        );
      } else {
        // Prüfe Marks im ausgewählten Bereich
        let match = false;
        state.doc.nodesBetween(from, to, (node) => {
          if (node.isText) {
            const mark = node.marks.find((m) => m.type === markType);
            if (mark && doesMarkMatchAttributes(mark, attrs)) {
              match = true;
            }
          }
        });
        return match;
      }
    };

    const attrsMatch = isMarkActive();

    if (!dispatch) {
      // Wenn keine Dispatch-Funktion vorhanden ist, nur den Status zurückgeben
      return attrsMatch;
    }

    if (attrsMatch) {
      if (empty) {
        // Entferne die gespeicherten Marks, wenn keine Auswahl vorhanden ist
        tr.removeStoredMark(markType);
      } else {
        // Entferne Marks aus dem ausgewählten Bereich
        tr.removeMark(from, to, markType);
      }
    } else {
      if (empty) {
        // Füge die Markierung für zukünftigen Text hinzu
        tr.addStoredMark(markType.create(attrs));
      } else {
        // Füge die Markierung im ausgewählten Bereich hinzu
        tr.addMark(from, to, markType.create(attrs));
      }
    }

    dispatch(tr);

    // Setze den Fokus zurück, um sicherzustellen, dass der Editor weiterhin aktiv ist
    view.focus();

    return true;
  };
}
