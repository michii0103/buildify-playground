import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MenuItem } from "./editorConfig";

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

  @property({ type: Array }) buttons: MenuItem[] = [];

  render() {
    return html`
      <div class="toolbar">
        ${this.buttons.map(
          (btn) =>
            html`<button
              @click=${() =>
                this.dispatchEvent(
                  new CustomEvent("action", { detail: { action: btn.action } })
                )}
            >
              ${btn.label}
            </button>`
        )}
      </div>
    `;
  }
}
