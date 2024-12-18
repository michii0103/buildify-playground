import { EditorView } from "prosemirror-view";

export function getMarkTypeByName({
  editorView,
  markName,
}: {
  editorView: EditorView;
  markName: string;
}) {
  const { state } = editorView;
  const markType = state.schema.marks[markName];
  if (!markType) throw new Error(`no mark registered with name: '${markName}'`);
  return markType;
}
