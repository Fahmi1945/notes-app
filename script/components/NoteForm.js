class NoteForm extends HTMLElement {
  connectedCallback() {
    this.render();
    
    // Tambahkan event listener untuk form submit
    this.querySelector('#addNoteForm').addEventListener('submit', this._onSubmit.bind(this));
    
    // Tambahkan event listener untuk tombol batal
    this.querySelector('.button-cancel').addEventListener('click', this._onCancel.bind(this));
  }
  
  _onSubmit(event) {
    event.preventDefault();

    const titleEl = this.querySelector('#noteTitle');
    const bodyEl = this.querySelector('#noteBody');
    const title = titleEl ? titleEl.value.trim() : '';
    const body = bodyEl ? bodyEl.value.trim() : '';
    
    // Mengirim Custom Event 'note-submitted' untuk ditangkap di main.js
    this.dispatchEvent(new CustomEvent('note-submitted', {
      detail: { title, body },
      bubbles: true,
      composed: true,
    }));
    
    // Reset form
    this.querySelector('#addNoteForm').reset();
  }

  _onCancel() {
    // Mengirim Custom Event 'close-modal'
    this.dispatchEvent(new CustomEvent('close-modal', {
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    this.innerHTML = `
      <form id="addNoteForm" class="note-form">
        <h2>Buat Catatan Baru</h2>
        <input type="text" id="noteTitle" placeholder="Judul Catatan..." required>
        <textarea id="noteBody" rows="10" placeholder="Isi catatan..." required></textarea>
        <div class="form-actions">
          <button type="button" class="button-cancel">Batal</button>
          <button type="submit" class="button-save">Simpan</button>
        </div>
      </form>
    `;
  }
}

customElements.define('note-form', NoteForm);