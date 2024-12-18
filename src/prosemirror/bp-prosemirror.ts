import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { MarkSpec, NodeSpec, Schema } from "prosemirror-model";
import { history } from "prosemirror-history";
import "./bp-toolbar";
import { IMarkConfig, INodeConfig, IMenuItem } from "./types";
import { doc } from "./schema/doc";
import { paragraph } from "./schema/paragraph";
import { text } from "./schema/text";
import { bold } from "./schema/bold";
import { italic } from "./schema/italic";
import { listItem, bulletList, orderedList } from "./schema/list";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { editorUpdatedCallbackPlugin } from "./plugins/editorUpdatedCallbackPlugin";
import { BPToolbar } from "./bp-toolbar";
import { floatingToolbarPlugin } from "./plugins/floatingToolbarPlugin";

@customElement("bp-prosemirror")
export class BPProsemirror extends LitElement {
  @property({ type: Array }) configs: Array<INodeConfig | IMarkConfig> = [
    doc,
    paragraph,
    text,
    bold,
    italic,
    listItem,
    bulletList,
    orderedList,
  ];
  @state() private _editorView: EditorView | null = null;
  @state() private schema: Schema;

  getPlugins(): Plugin[] {
    const plugins: Plugin[] = [];

    // add config plugins
    for (const config of this.configs) {
      if (!config.plugins) continue;
      plugins.push(...config.plugins(this.schema));
    }

    // add default plugins
    plugins.push(history());
    plugins.push(keymap(baseKeymap));
    plugins.push(floatingToolbarPlugin(this.getMenuItems()));
    plugins.push(
      editorUpdatedCallbackPlugin(() => {
        const toolbar = this.renderRoot.querySelector("#toolbar") as BPToolbar;
        if (!toolbar) return;
        toolbar.requestUpdate();
      })
    );

    return plugins;
  }

  generateSchema() {
    const nodes: Record<string, NodeSpec> = {};
    const marks: Record<string, MarkSpec> = {};

    for (const config of this.configs) {
      if ("mark" in config) {
        marks[config.mark.name] = config.mark.schema;
      }
      if ("node" in config) {
        nodes[config.node.name] = config.node.schema;
      }
    }

    return new Schema({
      nodes,
      marks,
    });
  }

  getMenuItems() {
    const menuItems: IMenuItem[] = [];

    for (const config of this.configs) {
      if (!config.menuItems) continue;
      menuItems.push(...config.menuItems);
    }

    return menuItems;
  }

  firstUpdated() {
    const editorContainer = this.shadowRoot!.querySelector(
      "#editor"
    ) as HTMLElement;

    this.schema = this.generateSchema();

    // Initialize editor state and view
    const state = EditorState.create({
      schema: this.schema,
      plugins: this.getPlugins(),
    });

    this._editorView = new EditorView(editorContainer, { state });
  }

  handleToolbarAction(e: CustomEvent) {
    const action = e.detail.action as (editorView: EditorView) => void;
    if (this._editorView) {
      action(this._editorView);
      this._editorView.focus();
    }
  }

  render() {
    return html`
      <bp-toolbar
        id="toolbar"
        .view=${this._editorView}
        .menuItems=${this.getMenuItems()}
      ></bp-toolbar>
      <div id="editor"></div>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      display: block;
    }
    #editor {
      position: relative;
    }
    .ProseMirror {
      border: 1px solid #ccc;
      padding: 8px;
      min-height: 150px;
    }
    .ProseMirror:focus {
      outline: none;
    }
  `;
}
