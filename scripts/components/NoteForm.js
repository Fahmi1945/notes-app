class NoteForm extends HTMLElement {
  connectedCallback() {
    this.render();
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