class NoteItem extends HTMLElement {
  connectedCallback() {
    this.noteId = this.getAttribute('note-id');
    this.noteTitle = this.getAttribute('note-title');
    this.noteBody = this.getAttribute('note-body');
    this.noteDate = this.getAttribute('note-date');
    this.isArchived = this.getAttribute('note-archived') === 'true'; // Ambil status arsip

    this.render();

    // Event listener untuk tombol Hapus
    const deleteButton = this.querySelector('.delete-button');
    if (deleteButton) {
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.dispatchEvent(new CustomEvent('delete-note', {
                detail: { noteId: this.noteId, noteTitle: this.noteTitle },
                bubbles: true,
                composed: true,
            }));
        });
    }

    // Event listener untuk tombol Arsip/Buka Arsip
    const archiveButton = this.querySelector('.archive-button');
    if (archiveButton) {
        archiveButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.dispatchEvent(new CustomEvent('toggle-archive', {
                detail: { noteId: this.noteId, noteTitle: this.noteTitle, isArchived: this.isArchived },
                bubbles: true,
                composed: true,
            }));
        });
    }
  }

  formatDate(isoString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(isoString).toLocaleDateString('id-ID', options);
  }

  render() {
    // Tentukan teks tombol berdasarkan status arsip
    const archiveButtonText = this.isArchived ? 'Buka Arsip' : 'Arsipkan';
    const cardClass = this.isArchived ? 'note-card archived' : 'note-card';

    this.innerHTML = `
      <div class="${cardClass}" tabindex="0">
        <h3 class="note-title">${this.noteTitle}</h3>
        <p class="note-date">${this.formatDate(this.noteDate)}</p>
        <p class="note-body">${this.noteBody}</p>
        
        <div class="note-actions">
          <button class="archive-button">${archiveButtonText}</button>
          <button class="delete-button">Hapus</button>
        </div>
      </div>
    `;
  }
}

customElements.define('note-item', NoteItem);