const BASE_URL = 'https://notes-api.dicoding.dev/v2';

const NotesApiService = {
  // Mendapatkan semua catatan (GET)
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
      return { status: 'error', message: 'Gagal terhubung ke server API. Periksa koneksi internet.' };
    }
  },

  // Menambahkan catatan baru (POST)
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
      return { status: 'error', message: 'Gagal terhubung ke server API.' };
    }
  },

  // Menghapus catatan (DELETE)
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
      return { status: 'error', message: 'Gagal terhubung ke server API.' };
    }
  },
  // Fitur Arsip
  archiveNote: async (noteId) => {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}/archive`, {
        method: 'POST',
      });
      const responseJson = await response.json();
      
      if (responseJson.status === 'success') {
        return { status: 'success', message: 'Catatan berhasil diarsipkan.' };
      } else {
        return { status: 'error', message: responseJson.message || 'Gagal mengarsipkan catatan.' };
      }
    } catch (error) {
      console.error('Error archiving note:', error);
      return { status: 'error', message: 'Gagal terhubung ke server API.' };
    }
  },

  // Fitur Buka Arsip
  unarchiveNote: async (noteId) => {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}/unarchive`, {
        method: 'POST',
      });
      const responseJson = await response.json();
      
      if (responseJson.status === 'success') {
        return { status: 'success', message: 'Catatan berhasil dikeluarkan dari arsip.' };
      } else {
        return { status: 'error', message: responseJson.message || 'Gagal mengeluarkan catatan dari arsip.' };
      }
    } catch (error) {
      console.error('Error unarchiving note:', error);
      return { status: 'error', message: 'Gagal terhubung ke server API.' };
    }
  },

  // Mendapatkan Catatan Aktif (Non-Arsip)
  getArchivedNotes: async () => {
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);
      const responseJson = await response.json();

      if (responseJson.status === 'success') {
        return { status: 'success', data: responseJson.data };
      } else {
        return { status: 'error', message: responseJson.message };
      }
    } catch (error) {
      console.error('Error fetching archived notes:', error);
      return { status: 'error', message: 'Gagal terhubung ke server API.' };
    }
  },
};


export default NotesApiService;
