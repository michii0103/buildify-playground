import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Schema } from "prosemirror-model";
import { history, undo, redo } from "prosemirror-history";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import {
  wrapInList,
  splitListItem,
  liftListItem,
  sinkListItem,
} from "prosemirror-schema-list";
import { autoListPlugin } from "./plugins/autoListPlugin";
import { baseKeymap } from "prosemirror-commands";
import { editorSchema } from "./schema/editorSchema";
import { keymapPlugin } from "./plugins/keymap";

@customElement("pb-prosemirror")
export class BPProsemirror extends LitElement {
  private _editorView: EditorView;

  firstUpdated() {
    const editorContainer = this.shadowRoot?.querySelector("#editor");
    if (!editorContainer) return;

    const schema = editorSchema;

    // Create the EditorState with list keymaps
    const state = EditorState.create({
      schema,
      plugins: [
        history(),
        autoListPlugin,
        keymapPlugin(schema),
        keymap(baseKeymap),
      ],
    });

    // Initialize the EditorView
    this._editorView = new EditorView(editorContainer, {
      state,
      dispatchTransaction: (transaction) => {
        const newState = this._editorView.state.apply(transaction);
        this._editorView.updateState(newState);
      },
    });
  }

  toggleMark(markType) {
    const { state, dispatch } = this._editorView;
    const { from, to } = state.selection;

    const hasMark = state.doc.rangeHasMark(from, to, markType);
    if (hasMark) {
      dispatch(state.tr.removeMark(from, to, markType));
    } else {
      dispatch(state.tr.addMark(from, to, markType.create()));
    }
    this._editorView.focus();
  }

  wrapInList(listType) {
    return wrapInList(listType);
  }

  undoAction() {
    undo(this._editorView.state, this._editorView.dispatch);
  }

  redoAction() {
    redo(this._editorView.state, this._editorView.dispatch);
  }

  render() {
    return html`
      <div class="toolbar">
        <button
          @click="${() =>
            this.toggleMark(this._editorView.state.schema.marks.bold)}"
        >
          Bold
        </button>
        <button
          @click="${() =>
            this.toggleMark(this._editorView.state.schema.marks.italic)}"
        >
          Italic
        </button>
        <button @click="${this.undoAction}">Undo</button>
        <button @click="${this.redoAction}">Redo</button>
      </div>
      <div id="editor"></div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    .ProseMirror {
      border: 1px solid #ccc;
      padding: 8px;
      min-height: 150px;
    }

    .ProseMirror:focus {
      outline: none;
    }

    .toolbar {
      margin-bottom: 8px;
    }
    .toolbar button {
      margin-right: 4px;
      padding: 4px 8px;
      cursor: pointer;
    }
  `;
}
