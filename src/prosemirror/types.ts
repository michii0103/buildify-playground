import { MarkSpec, NodeSpec, Schema } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

export interface IMenuItem {
  label: string;
  run: (editorView: EditorView) => void;
  isActive?: (editorView: EditorView) => boolean;
}

export interface IEditorConfigBase {
  menuItems?: IMenuItem[];
  plugins?: (schema: Schema) => Plugin<any>[];
}

export interface INodeConfig extends IEditorConfigBase {
  node: {
    name: string;
    schema: NodeSpec;
  };
}

export interface IMarkConfig extends IEditorConfigBase {
  mark: {
    name: string;
    schema: MarkSpec;
  };
}
