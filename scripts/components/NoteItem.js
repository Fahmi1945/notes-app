class NoteItem extends HTMLElement {
  connectedCallback() {
    this.noteId = this.getAttribute('note-id');
    this.noteTitle = this.getAttribute('note-title');
    this.noteBody = this.getAttribute('note-body');
    this.noteDate = this.getAttribute('note-date');

    this.render();

    // Tambahkan event listener untuk tombol hapus
    this.querySelector('.delete-button').addEventListener('click', (event) => {
      // Mencegah event click pada card
      event.stopPropagation();
      
      // Mengirim Custom Event untuk ditangkap di main.js (Kriteria Wajib 2)
      this.dispatchEvent(new CustomEvent('delete-note', {
        detail: { noteId: this.noteId, noteTitle: this.noteTitle },
        bubbles: true,
        composed: true,
      }));
    });
  }

  // Fungsi untuk memformat tanggal agar lebih mudah dibaca
  formatDate(isoString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(isoString).toLocaleDateString('id-ID', options);
  }

  render() {
    this.innerHTML = `
      <div class="note-card" tabindex="0">
        <h3 class="note-title">${this.noteTitle}</h3>
        <p class="note-date">${this.formatDate(this.noteDate)}</p>
        <p class="note-body">${this.noteBody}</p>
        
        <div class="note-actions">
          <button class="delete-button">Hapus</button>
        </div>
      </div>
    `;
  }
}

customElements.define('note-item', NoteItem);