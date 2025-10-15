document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'https://notes-api.dicoding.dev/v2';
  const notesListElement = document.getElementById('notes-list');
  const addNoteForm = document.getElementById('add-note-form');
  const noteTitleInput = document.getElementById('note-title');
  const noteBodyInput = document.getElementById('note-body');
  const loadingIndicator = document.querySelector('loading-indicator');

  // Fungsi untuk menampilkan catatan
  const renderNotes = (notes) => {
    notesListElement.innerHTML = '';
    if (notes.length === 0) {
      notesListElement.innerHTML = '<p class="placeholder">Tidak ada catatan. Silakan tambahkan catatan baru.</p>';
      return;
    }
    notes.forEach(note => {
      const noteItem = document.createElement('note-item');
      noteItem.note = note;
      notesListElement.appendChild(noteItem);
    });
  };

  // Fungsi untuk mengambil data catatan dari API
  const getNotes = async () => {
    loadingIndicator.show();
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      const responseJson = await response.json();
      
      if (responseJson.error) {
        alert(responseJson.message);
      } else {
        renderNotes(responseJson.data);
      }
    } catch (error) {
      alert(`Gagal memuat catatan: ${error.message}`);
    } finally {
      loadingIndicator.hide();
    }
  };

  // Fungsi untuk menambah catatan baru
  const addNote = async (title, body) => {
    loadingIndicator.show();
    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
      });
      const responseJson = await response.json();

      if (responseJson.error) {
        alert(responseJson.message);
      } else {
        getNotes(); // Muat ulang catatan setelah berhasil menambah
      }
    } catch (error) {
      alert(`Gagal menambah catatan: ${error.message}`);
    } finally {
      loadingIndicator.hide();
    }
  };

  // Fungsi untuk menghapus catatan
  const deleteNote = async (noteId) => {
    loadingIndicator.show();
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
      });
      const responseJson = await response.json();

      if (responseJson.error) {
        alert(responseJson.message);
      } else {
        getNotes(); // Muat ulang catatan setelah berhasil menghapus
      }
    } catch (error) {
      alert(`Gagal menghapus catatan: ${error.message}`);
    } finally {
      loadingIndicator.hide();
    }
  };

  // Event listener untuk form penambahan catatan
  addNoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = noteTitleInput.value;
    const body = noteBodyInput.value;
    addNote(title, body);
    addNoteForm.reset();
  });

  // Event listener untuk event 'delete-note' dari note-item
  notesListElement.addEventListener('delete-note', (event) => {
    const noteId = event.detail.noteId;
    deleteNote(noteId);
  });

  // Muat catatan saat halaman pertama kali dibuka
  getNotes();
});
