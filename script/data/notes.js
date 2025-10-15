// File: scripts/data/notes.js (API Service)

const BASE_URL = 'https://notes-api.dicoding.dev/v2';

const NotesApiService = {
  // Mendapatkan semua catatan
  getAllNotes: async () => {
    try {
      const response = await fetch(`${BASE_URL}/notes`);
      const responseJson = await response.json();

      if (responseJson.status === 'success') {
        return { status: 'success', data: responseJson.data };
      } else {
        return { status: 'error', message: responseJson.message };
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      return { status: 'error', message: 'Gagal terhubung ke server API. Periksa koneksi internet Anda.' };
    }
  },

  // Menambahkan catatan baru
  addNote: async (noteData) => {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      const responseJson = await response.json();
      
      if (responseJson.status === 'success') {
        return { status: 'success', message: 'Catatan berhasil ditambahkan.' };
      } else {
        return { status: 'error', message: responseJson.message || 'Gagal menambahkan catatan.' };
      }
    } catch (error) {
      console.error('Error adding note:', error);
      return { status: 'error', message: 'Gagal terhubung ke server API. Periksa koneksi internet Anda.' };
    }
  },

  // Menghapus catatan
  deleteNote: async (noteId) => {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
      });

      const responseJson = await response.json();
      
      if (responseJson.status === 'success') {
        return { status: 'success', message: 'Catatan berhasil dihapus.' };
      } else {
        return { status: 'error', message: responseJson.message || 'Gagal menghapus catatan.' };
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      return { status: 'error', message: 'Gagal terhubung ke server API. Periksa koneksi internet Anda.' };
    }
  },
};

export default NotesApiService;