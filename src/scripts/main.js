// Import CSS
import '../styles/main.css';

// Import API Service
import NotesApiService from './data/notes.js';

// Import semua komponen
import './components/AppBar.js';
import './components/NoteForm.js';
import './components/NoteItem.js';
import './components/LoadingIndicator.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elemen-elemen DOM
  const noteListContainer = document.getElementById('noteListContainer');
  const addNoteModal = document.getElementById('addNoteModal');
  const noteDetailModal = document.getElementById('noteDetailModal');
  const searchBar = document.getElementById('searchBar');
  const loadingIndicator = document.querySelector('loading-indicator');

  let currentNotes = [];

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString('id-ID', options);
  };

  const showMessage = (message) => {
    alert(message);
  };

  // ------------------------- FUNGSI RENDER & FETCH UTAMA -------------------------

  const renderNotes = (notes) => {
    if (!noteListContainer) return;
    noteListContainer.innerHTML = '';

    // Pisahkan catatan aktif dan arsip
    const activeNotes = notes.filter(n => !n.archived);
    const archivedNotes = notes.filter(n => n.archived);

    // Fungsi untuk membuat dan menambahkan section ke container
    const createSection = (title, data) => {
      const titleElement = document.createElement('h3');
      titleElement.textContent = title;
      noteListContainer.appendChild(titleElement);

      if (data.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = `Tidak ada catatan ${title.toLowerCase().replace('catatan ', '')}.`;
        noteListContainer.appendChild(emptyMessage);
        return;
      }

      data.forEach(note => {
        const noteItem = document.createElement('note-item');
        noteItem.setAttribute('note-id', note.id);
        noteItem.setAttribute('note-title', note.title);
        noteItem.setAttribute('note-body', note.body);
        noteItem.setAttribute('note-date', note.createdAt);
        noteItem.setAttribute('note-archived', note.archived.toString());

        noteListContainer.appendChild(noteItem);
      });
    };

    createSection("Catatan Aktif", activeNotes);
    createSection("Catatan Arsip", archivedNotes);
  };

  // Mengambil semua catatan (Aktif + Arsip)
  const fetchAndRenderNotes = async () => {
    loadingIndicator.show();
    try {
      const activeResult = await NotesApiService.getAllNotes();
      const archivedResult = await NotesApiService.getArchivedNotes();

      if (activeResult.status === 'success' && archivedResult.status === 'success') {
        // Gabungkan kedua daftar catatan
        const allNotes = [...activeResult.data, ...archivedResult.data];
        currentNotes = allNotes; // Simpan untuk pencarian
        renderNotes(allNotes);
      } else {
        const errorMessage = activeResult.message || archivedResult.message;
        showMessage(`Gagal memuat catatan: ${errorMessage}`);
        noteListContainer.innerHTML = `<p class="empty-message error">Gagal memuat catatan: ${errorMessage}</p>`;
      }
    } catch (error) {
      showMessage('Terjadi kesalahan saat memproses data. Cek console.');
    } finally {
      loadingIndicator.hide();
    }
  };

  const addNoteHandler = async ({ title, body }) => {
    if (!title || !body) return;

    if (addNoteModal) addNoteModal.style.display = 'none';

    const noteData = { title, body };

    loadingIndicator.show();
    const result = await NotesApiService.addNote(noteData);
    loadingIndicator.hide();

    if (result.status === 'success') {
      showMessage(result.message);
      await fetchAndRenderNotes();
    } else {
      showMessage(`Gagal menambahkan catatan: ${result.message}`);
    }
  };

  const deleteNoteHandler = async (noteId, noteTitle) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus catatan "${noteTitle}"?`)) {
      return;
    }

    loadingIndicator.show();
    const result = await NotesApiService.deleteNote(noteId);
    loadingIndicator.hide();

    if (result.status === 'success') {
      showMessage(result.message);
      await fetchAndRenderNotes();
    } else {
      showMessage(`Gagal menghapus catatan: ${result.message}`);
    }
  };

  const toggleArchiveHandler = async (noteId, noteTitle, isArchived) => {
    let result;
    loadingIndicator.show();

    if (isArchived) {
      // Jika statusnya sudah diarsipkan, maka unarchive
      result = await NotesApiService.unarchiveNote(noteId);
    } else {
      // Jika statusnya aktif, maka archive
      result = await NotesApiService.archiveNote(noteId);
    }

    loadingIndicator.hide();

    if (result.status === 'success') {
      showMessage(result.message);
      await fetchAndRenderNotes();
    } else {
      showMessage(`Gagal memproses catatan: ${result.message}`);
    }
  };

  // ------------------------- EVENT LISTENER SETUP -------------------------

  // Tangani Toggle Arsip (dari NoteItem Custom Event)
  document.addEventListener('toggle-archive', (event) => {
    const { noteId, noteTitle, isArchived } = event.detail;
    toggleArchiveHandler(noteId, noteTitle, isArchived);
  });

  // ... (Event Listener lainnya sama seperti sebelumnya: 'note-submitted', 'delete-note', klik modal, dll.)
  document.addEventListener('note-submitted', (event) => {
    const { title, body } = event.detail;
    addNoteHandler({ title, body });
  });

  document.addEventListener('delete-note', (event) => {
    const { noteId, noteTitle } = event.detail;
    deleteNoteHandler(noteId, noteTitle);
  });

  document.addEventListener('close-modal', () => {
    if (addNoteModal) addNoteModal.style.display = 'none';
  });

  document.body.addEventListener('click', (event) => {
    if (event.target.matches('.button-close') || event.target.id === 'noteDetailModal') {
      if (noteDetailModal) noteDetailModal.style.display = 'none';
    }
    if (event.target.id === 'addNoteModal' && addNoteModal) {
      addNoteModal.style.display = 'none';
    }
    if (event.target.id === 'addNoteButton' && addNoteModal) {
      addNoteModal.style.display = 'flex';
    }
  });

  noteListContainer.addEventListener('click', (event) => {
    const clicked = event.target.closest('note-item');
    if (clicked && !event.target.matches('.delete-button') && !event.target.matches('.archive-button')) {
      const title = clicked.getAttribute('note-title');
      const body = clicked.getAttribute('note-body');
      const date = clicked.getAttribute('note-date');

      document.getElementById('detailTitle').textContent = title;
      document.getElementById('detailBody').textContent = body;
      document.getElementById('detailDate').textContent = formatDate(date);

      if (noteDetailModal) noteDetailModal.style.display = 'flex';
    }
  });

  if (searchBar) {
    searchBar.addEventListener('input', () => {
      const searchTerm = searchBar.value.trim().toLowerCase();
      const filtered = currentNotes.filter(n => {
        const title = (n.title || '').toLowerCase();
        const body = (n.body || '').toLowerCase();
        return title.includes(searchTerm) || body.includes(searchTerm);
      });
      renderNotes(filtered);
    });
  }

  fetchAndRenderNotes();
});