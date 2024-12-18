import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import {
  splitListItem,
  liftListItem,
  sinkListItem,
} from "prosemirror-schema-list";

export const keymapPlugin = (schema) =>
  keymap({
    ...baseKeymap,
    "Mod-b": (state, dispatch) =>
      toggleMark(schema.marks.bold)(state, dispatch),
    "Mod-i": (state, dispatch) =>
      toggleMark(schema.marks.italic)(state, dispatch),
    Enter: splitListItem(schema.nodes.list_item),
    Tab: sinkListItem(schema.nodes.list_item),
    "Shift-Tab": liftListItem(schema.nodes.list_item),
  });

function toggleMark(markType) {
  return (state, dispatch) => {
    const { from, to } = state.selection;
    const hasMark = state.doc.rangeHasMark(from, to, markType);
    if (hasMark) {
      dispatch(state.tr.removeMark(from, to, markType));
    } else {
      dispatch(state.tr.addMark(from, to, markType.create()));
    }
    return true;
  };
}
