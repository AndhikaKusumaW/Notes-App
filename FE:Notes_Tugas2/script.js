// URL Backend (sesuai port di .env dan index.js)
const API_URL = 'http://localhost:3000/api/v1/notes';

// DOM Elements
const noteForm = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');
const profileModal = document.getElementById('profileModal');
const profileBtn = document.getElementById('profileBtn');
const noteIdInput = document.getElementById('noteId');
const judulInput = document.getElementById('judul');
const isiInput = document.getElementById('isi');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');

// Toggle Profile Popup
profileBtn.addEventListener('click', () => {
    profileModal.classList.toggle('active');
});

// Menutup profile jika klik di luar area modal
document.addEventListener('click', function(event) {
    const isClickInsideProfileBtn = event.target.closest('#profileBtn');
    const isClickInsideModal = event.target.closest('.profile-modal');
    
    if (!isClickInsideProfileBtn && !isClickInsideModal) {
        profileModal.classList.remove('active');
    }
});

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Fetch All Notes dari Backend
async function fetchNotes() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        renderNotes(result.data);
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

// Render Notes to DOM
function renderNotes(notes) {
    notesList.innerHTML = '';
    
    // Reverse array agar catatan terbaru ada di atas
    const sortedNotes = notes.reverse();

    if(sortedNotes.length === 0) {
        notesList.innerHTML = '<p style="color: #888; text-align: center; margin-top: 50px;">Belum ada catatan. Buat yang pertama!</p>';
        return;
    }

    sortedNotes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
            <div class="note-actions">
                <button class="action-btn edit" onclick="editNote('${note.id}', '${note.judul}', '${note.isi}')">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="action-btn delete" onclick="deleteNote('${note.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="note-date">${formatDate(note.tanggal_dibuat)}</div>
            <div class="note-title">${note.judul}</div>
            <div class="note-content">${note.isi}</div>
            <div class="note-tags">
                <span class="tag">UMUM</span>
            </div>
        `;
        notesList.appendChild(noteCard);
    });
}

// Add or Update Note
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = noteIdInput.value;
    const noteData = {
        judul: judulInput.value,
        isi: isiInput.value
    };

    try {
        if (id) {
            // Update Mode (PUT)
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData)
            });
        } else {
            // Create Mode (POST)
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData)
            });
        }

        // Reset Form & Fetch Latest Data
        resetForm();
        fetchNotes();
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Gagal menyimpan catatan! Pastikan backend sudah berjalan.');
    }
});

// Trigger Edit Mode (dipanggil dari HTML onclick)
window.editNote = function(id, judul, isi) {
    noteIdInput.value = id;
    judulInput.value = judul;
    isiInput.value = isi;
    
    // Ubah tampilan UI Form
    formTitle.textContent = "Edit Entry";
    submitBtn.textContent = "Update Catatan";
    submitBtn.style.backgroundColor = "#27ae60"; // Warna hijau saat edit
    
    // Auto scroll ke form (opsional jika layar kecil)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Trigger Delete (dipanggil dari HTML onclick)
window.deleteNote = async function(id) {
    if (confirm('Apakah kamu yakin ingin menghapus catatan ini?')) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            fetchNotes(); // Refresh data setelah dihapus
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }
}

// Reset Form ke kondisi awal
function resetForm() {
    noteIdInput.value = '';
    judulInput.value = '';
    isiInput.value = '';
    formTitle.textContent = "New Entry";
    submitBtn.textContent = "Tambah Catatan +";
    submitBtn.style.backgroundColor = "var(--primary-blue)";
}

// Load data saat aplikasi pertama kali dibuka
fetchNotes();