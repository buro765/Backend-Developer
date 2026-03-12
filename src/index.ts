declare global {
    interface Window {
        selectBook: (id: number) => void;
        deleteBook: (id?: number) => void;
    }
}

const API_BASE = '/api'; // ← ЗАМЕНИТЕ на https://ваш-api.ru/api

interface Book {
    id: number;
    title: string;
    author?: string;
    year?: number;
}

let books: Book[] = [];
let selectedId: number | null = null;

const el = (id: string): HTMLElement => document.getElementById(id)!;

const log = (msg: string): void => {
    const time = new Date().toLocaleTimeString();
    el('console').textContent += `${time} | ${msg}\n`;
    el('console').scrollTop = el('console').scrollHeight;
};

// GET - загрузка списка
async function loadBooks(): Promise<void> {
    log('GET /books');
    try {
        const res = await fetch(`${API_BASE}/books`);
        books = await res.json();
        el('books').innerHTML = books.map(b =>
            `<div class="book ${selectedId === b.id ? 'selected' : ''}" 
                onclick="selectBook(${b.id})">
                ${b.id}. ${b.title} | ${b.author || '-'} | ${b.year || '-'}
            </div>`
        ).join('');
    } catch (e) {
        log('❌ ' + (e as Error).message);
    }
}

// SELECT - выбор книги для редактирования
function selectBook(id: number): void {
    selectedId = id;
    const book = books.find(b => b.id === id);
    (el('title') as HTMLInputElement).value = book?.title || '';
    (el('author') as HTMLInputElement).value = book?.author || '';
    (el('year') as HTMLInputElement).value = book?.year?.toString() || '';
}

// POST - добавить книгу
async function addBook(): Promise<void> {
    const title = (el('title') as HTMLInputElement).value.trim();
    if (!title) return log('⚠️ Название обязательно');

    log('POST /books');
    try {
        const res = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                author: (el('author') as HTMLInputElement).value.trim() || undefined,
                year: (el('year') as HTMLInputElement).value || undefined
            })
        });
        if (res.ok) {
            (el('title') as HTMLInputElement).value = '';
            await loadBooks();
            log('✅ POST OK');
        }
    } catch (e) {
        log('❌ ' + (e as Error).message);
    }
}

// PUT - обновить книгу
async function editBook(): Promise<void> {
    if (!selectedId) return log('⚠️ Выберите книгу');
    const title = (el('title') as HTMLInputElement).value.trim();
    if (!title) return log('⚠️ Название обязательно');

    log(`PUT /books/${selectedId}`);
    try {
        const res = await fetch(`${API_BASE}/books/${selectedId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                author: (el('author') as HTMLInputElement).value.trim() || undefined,
                year: (el('year') as HTMLInputElement).value || undefined
            })
        });
        if (res.ok) {
            (el('title') as HTMLInputElement).value = '';
            selectedId = null;
            await loadBooks();
            log('✅ PUT OK');
        }
    } catch (e) {
        log('❌ ' + (e as Error).message);
    }
}

// DELETE - удалить книгу
async function deleteBook(): Promise<void> {
    if (!selectedId || !confirm('Удалить книгу?')) return;
    log(`DELETE /books/${selectedId}`);
    try {
        const res = await fetch(`${API_BASE}/books/${selectedId}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            (el('title') as HTMLInputElement).value = '';
            selectedId = null;
            await loadBooks();
            log('✅ DELETE OK');
        }
    } catch (e) {
        log('❌ ' + (e as Error).message);
    }
}

// Инициализация событий
document.getElementById('addBtn')!.onclick = addBook;
document.getElementById('editBtn')!.onclick = editBook;
document.getElementById('deleteBtn')!.onclick = deleteBook;

window.selectBook = selectBook;
window.deleteBook = deleteBook;

// Загрузка при старте
loadBooks();
