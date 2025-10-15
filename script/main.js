// File: scripts/main.js (Updated for API and Loading Indicator)

// Import data service (yang sekarang menjadi API Service)
import NotesApiService from './data/notes.js';
import './components/NoteItem.js';
import './components/AppBar.js';
import './components/NoteForm.js';
import './components/LoadingIndicator.js'; // Import Loading Indicator

document.addEventListener('DOMContentLoaded', () => {
  // Elemen-elemen utama
  const noteListContainer = document.getElementById('noteListContainer');
  const addNoteModal = document.getElementById('addNoteModal');
  const noteDetailModal = document.getElementById('noteDetailModal');
  const searchBar = document.getElementById('searchBar');
  const loadingIndicator = document.querySelector('loading-indicator');
  
  // Data lokal untuk pencarian
  let currentNotes = [];
  
  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString('id-ID', options);
  };

  // ------------------------- FUNGSI UTAMA (RENDER) -------------------------
  const renderNotes = (notes) => {
    if (!noteListContainer) return;
    noteListContainer.innerHTML = '';
    currentNotes = notes;

    if (!notes || notes.length === 0) {
      noteListContainer.innerHTML = '<p class="empty-message">Tidak ada catatan. Buat yang baru!</p>';
      return;
    }

    notes.forEach(note => {
      const noteItem = document.createElement('note-item');

      // Pastikan semua properti yang dibutuhkan ada
      noteItem.setAttribute('note-id', note.id);
      noteItem.setAttribute('note-title', note.title);
      noteItem.setAttribute('note-body', note.body);
      noteItem.setAttribute('note-date', note.createdAt);

      noteListContainer.appendChild(noteItem);
    });
  };

  // ------------------------- FUNGSI API HANDLER (Kriteria Wajib 2, 4, 5) -------------------------
  const fetchAndRenderNotes = async () => {
    loadingIndicator.removeAttribute('hidden');
    const result = await NotesApiService.getAllNotes(); // Ambil data dari API
    loadingIndicator.setAttribute('hidden', '');

    if (result.status === 'success') {
      renderNotes(result.data);
    } else {
      alert(`Gagal memuat catatan: ${result.message}`);
      noteListContainer.innerHTML = `<p class="empty-message error">Gagal memuat catatan: ${result.message}</p>`;
    }
  };

  const addNoteHandler = async ({ title, body }) => {
    if (!title && !body) return;

    addNoteModal.style.display = 'none'; // Tutup modal sebelum request API

    const noteData = { title, body };
    
    loadingIndicator.removeAttribute('hidden');
    const result = await NotesApiService.addNote(noteData); // Tambah catatan ke API
    loadingIndicator.setAttribute('hidden', '');

    if (result.status === 'success') {
      alert(result.message);
      await fetchAndRenderNotes(); // Render ulang daftar
    } else {
      alert(`Gagal menambahkan catatan: ${result.message}`);
    }
  };

  const deleteNoteHandler = async (noteId, noteTitle) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus catatan "${noteTitle}"?`)) {
      return;
    }

    loadingIndicator.removeAttribute('hidden');
    const result = await NotesApiService.deleteNote(noteId); // Hapus catatan di API
    loadingIndicator.setAttribute('hidden', '');

    if (result.status === 'success') {
      alert(result.message);
      await fetchAndRenderNotes(); // Render ulang daftar
    } else {
      alert(`Gagal menghapus catatan: ${result.message}`);
    }
  };
  
  // ------------------------- EVENT LISTENER -------------------------
  
  // 1. Tampilkan modal tambah catatan (dari AppBar)
  document.addEventListener('click', (event) => {
    if (event.target.id === 'addNoteButton' && addNoteModal) {
        addNoteModal.style.display = 'flex';
    }
  });

  // 2. Tangani Form Submission (dari NoteForm)
  document.addEventListener('note-submitted', (event) => {
    const { title, body } = event.detail;
    addNoteHandler({ title, body });
  });
  
  // 3. Tangani Delete Note (dari NoteItem)
  document.addEventListener('delete-note', (event) => {
    const { noteId, noteTitle } = event.detail;
    deleteNoteHandler(noteId, noteTitle);
  });
  
  // 4. Tutup Modal (dari NoteForm atau tombol Tutup)
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
  });

  // 5. Tampilkan Detail Catatan (dari NoteItem click)
  noteListContainer.addEventListener('click', (event) => {
    const clicked = event.target.closest('note-item');
    if (clicked) {
        const detailTitle = document.getElementById('detailTitle');
        const detailDate = document.getElementById('detailDate');
        const detailBody = document.getElementById('detailBody');
        
        const title = clicked.getAttribute('note-title');
        const body = clicked.getAttribute('note-body');
        const date = clicked.getAttribute('note-date');
        
        if (detailTitle) detailTitle.textContent = title;
        if (detailBody) detailBody.textContent = body;
        if (detailDate) detailDate.textContent = formatDate(date);

        if (noteDetailModal) noteDetailModal.style.display = 'flex';
    }
  });

  // 6. Search handler
  if (searchBar) {
    searchBar.addEventListener('input', () => {
      const searchTerm = searchBar.value.trim().toLowerCase();
      
      // Pencarian berdasarkan data yang sudah ada di currentNotes (dari API)
      const filtered = currentNotes.filter(n => {
        const title = (n.title || '').toLowerCase();
        const body = (n.body || '').toLowerCase();
        return title.includes(searchTerm) || body.includes(searchTerm);
      });
      renderNotes(filtered);
    });
  }

  // ------------------------- INISIASI -------------------------
  // Render awal (ambil data dari API)
  loadingIndicator.setAttribute('hidden', '');
  fetchAndRenderNotes();
});