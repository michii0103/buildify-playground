import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../prosemirror/bp-prosemirror";

@customElement("main-element")
export class MainElement extends LitElement {
  @property({ type: String }) message = "Hello World";

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      padding: 20px;
    }
    .message {
      color: blue;
      font-size: 20px;
    }
  `;

  render() {
    return html`
      <p>Editor:</p>
      <bp-prosemirror></bp-prosemirror>
    `;
  }
}
