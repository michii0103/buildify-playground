import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { IMenuItem } from "./types";
import { EditorView } from "prosemirror-view";
import { repeat } from "lit/directives/repeat.js";

@customElement("bp-toolbar")
export class BPToolbar extends LitElement {
  static styles = css`
    .toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    button {
      padding: 4px 8px;
      cursor: pointer;
      border: 1px solid #ccc;
      background: #f9f9f9;
    }
    button:hover {
      background: #e0e0e0;
    }
  `;

  @property({ attribute: false }) menuItems: IMenuItem[] = [];
  @property({ attribute: false }) view: EditorView;

  render() {
    if (!this.view) return nothing;

    return html`
      <div class="toolbar">
        ${repeat(
          this.menuItems,
          (item) => item.label,
          (item) => {
            const isActive = item.isActive?.(this.view);
            return html`
              <button
                style=${`border: ${isActive ? "2px solid #333" : ""}`}
                @click=${() => {
                  if (!item.run) return;
                  item.run(this.view);
                }}
              >
                ${item.label}
              </button>
            `;
          }
        )}
      </div>
    `;
  }
}
