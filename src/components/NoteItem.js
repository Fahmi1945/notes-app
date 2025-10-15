class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
  };

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  set note(value) {
    this._note = value;
    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        border-radius: 8px;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        background-color: #fff;
        overflow: hidden;
        transition: transform 0.2s;
      }

      :host(:hover) {
        transform: translateY(-5px);
      }

      .note-content {
        padding: 16px;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 1.2em;
        color: #333;
      }

      p {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 1em;
        color: #555;
      }

      .note-footer {
        padding: 8px 16px;
        background-color: #f7f7f7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #eee;
      }

      .note-date {
        font-size: 0.8em;
        color: #777;
      }

      .delete-button {
        background-color: #ff4d4d;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
      }

      .delete-button:hover {
        background-color: #cc0000;
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    const formattedDate = new Date(this._note.createdAt).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="note-card">
        <div class="note-content">
          <h3>${this._note.title}</h3>
          <p>${this._note.body}</p>
        </div>
        <div class="note-footer">
          <span class="note-date">${formattedDate}</span>
          <button class="delete-button">Hapus</button>
        </div>
      </div>
    `;

    this._shadowRoot.querySelector('.delete-button').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-note', {
        detail: { noteId: this._note.id },
        bubbles: true,
      }));
    });
  }
}

customElements.define('note-item', NoteItem);
