import { db } from './firebase-config.js'; 
import { collection, getDocs, query, orderBy } from './firebase-config.js';

async function displayAllNotes() {
    try {
        const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        window.allNotes = [];
        querySnapshot.forEach((doc) => {
            window.allNotes.push({ id: doc.id, ...doc.data() });
        });

        if (typeof window.renderNotes === 'function') {
            window.renderNotes(window.allNotes);
        }
    } catch (error) {
        console.error("Notes load error:", error);
        document.getElementById('notesContainer').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Could not load notes</h3>
                <p>Please refresh the page</p>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', displayAllNotes);

window.addEventListener('focus', displayAllNotes);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) displayAllNotes();
});

window.addEventListener('pageshow', (e) => {
    displayAllNotes();
});