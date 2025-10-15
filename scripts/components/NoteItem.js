// File: scripts/components/NoteItem.js

class NoteItem extends HTMLElement {
  connectedCallback() {
    this.noteId = this.getAttribute('note-id');
    this.noteTitle = this.getAttribute('note-title');
    this.noteBody = this.getAttribute('note-body');
    this.noteDate = this.getAttribute('note-date'); // <-- AMBIL ATRIBUT TANGGAL

    this.render();
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
    // Struktur HTML baru yang lebih lengkap
    this.innerHTML = `
      <div class="note-card" tabindex="0">
        <h3 class="note-title">${this.noteTitle}</h3>
        <p class="note-date">${this.formatDate(this.noteDate)}</p>
        <p class="note-body">${this.noteBody}</p>
      </div>
    `;
  }
}

customElements.define('note-item', NoteItem);