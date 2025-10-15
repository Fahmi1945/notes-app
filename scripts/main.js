// Import data dan komponen
import notesData from './data/notes.js';
import './components/NoteItem.js';
import './components/AppBar.js';
import './components/NoteForm.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elemen-elemen utama
  const noteListContainer = document.getElementById('noteListContainer');
  const addNoteModal = document.getElementById('addNoteModal');
  const appBarEl = document.querySelector('app-bar');
  const addNoteButton = appBarEl ? appBarEl.querySelector('#addNoteButton') : null;
  const addNoteForm = document.getElementById('addNoteForm');
  const searchBar = document.getElementById('searchBar');
  const noteDetailModal = document.getElementById('noteDetailModal');
  const detailTitle = document.getElementById('detailTitle');
  const detailDate = document.getElementById('detailDate');
  const detailBody = document.getElementById('detailBody');

  let activeNoteItem = null; // Untuk menandai item aktif

  // Tampilkan detail catatan
  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString('id-ID', options);
  };

  // Centralized function to display a note's details (used by click listeners)
  const displayNoteDetail = (noteElement) => {
    if (!noteElement) return;
    // Ambil data dari atribut
    const title = noteElement.getAttribute('note-title') || '';
    const body = noteElement.getAttribute('note-body') || '';
    const date = noteElement.getAttribute('note-date') || new Date().toISOString();

    // Isi konten modal
    if (detailTitle) detailTitle.textContent = title;
    if (detailBody) detailBody.textContent = body;
    if (detailDate) detailDate.textContent = formatDate(date);

    // Aktifkan item secara visual
    if (activeNoteItem) activeNoteItem.classList.remove('active');
    activeNoteItem = noteElement;
    activeNoteItem.classList.add('active');

    // Tampilkan modal detail
    if (noteDetailModal) noteDetailModal.style.display = 'flex';
  };

  // Tambahkan logika untuk menutup modal detail
  document.body.addEventListener('click', (event) => {
    if (event.target.matches('.button-close') || event.target.id === 'noteDetailModal') {
      noteDetailModal.style.display = 'none';
    }
  });

  // Render daftar catatan (menerima array notes, default ke notesData)
  const renderNotes = (notes = notesData) => {
    if (!noteListContainer) return;
    noteListContainer.innerHTML = '';

    if (!notes || notes.length === 0) {
      noteListContainer.innerHTML = '<p class="empty-message">Tidak ada catatan.</p>';
      return;
    }

    notes.forEach(note => {
      const noteItem = document.createElement('note-item');

      noteItem.setAttribute('note-id', note.id);
      noteItem.setAttribute('note-title', note.title);
      noteItem.setAttribute('note-body', note.body);
      noteItem.setAttribute('note-date', note.createdAt); // <-- TAMBAHKAN BARIS INI

      noteListContainer.appendChild(noteItem);
    });
  };

  // Buka modal tambah catatan
  if (addNoteButton && addNoteModal) {
    addNoteButton.addEventListener('click', () => {
      addNoteModal.style.display = 'flex';
    });
  }

  // Tutup modal saat klik cancel atau overlay
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!addNoteModal) return;
    if (target.matches('.button-cancel')) addNoteModal.style.display = 'none';
    if (target.matches('.modal-overlay')) addNoteModal.style.display = 'none';
  });

  // Search handler
  if (searchBar) {
    searchBar.addEventListener('input', () => {
      const searchTerm = searchBar.value.trim().toLowerCase();
      const filtered = notesData.filter(n => {
        const title = (n.title || '').toLowerCase();
        const body = (n.body || '').toLowerCase();
        return title.includes(searchTerm) || body.includes(searchTerm);
      });
      renderNotes(filtered);
    });
  }

  // Klik pada daftar: tampilkan detail
  if (noteListContainer) {
    noteListContainer.addEventListener('click', (event) => {
      const clicked = event.target.closest('note-item');
      if (clicked) displayNoteDetail(clicked);
    });
  }

  // Submit form tambah catatan: tambahkan ke data dan render ulang
  if (addNoteForm) {
    addNoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const titleEl = document.getElementById('noteTitle');
      const bodyEl = document.getElementById('noteBody');
      const title = titleEl ? titleEl.value.trim() : '';
      const body = bodyEl ? bodyEl.value.trim() : '';

      if (!title && !body) return; // jangan tambah kosong

      const newNote = {
        id: `note-${Date.now()}`,
        title,
        body,
        createdAt: new Date().toISOString(),
        archived: false,
      };

      // Tambah ke awal array dan render ulang
      notesData.unshift(newNote);
      renderNotes(notesData);

      // close modal + reset form
      if (addNoteModal) addNoteModal.style.display = 'none';
      addNoteForm.reset();
    });
  }

  // Render awal
  renderNotes();
});
