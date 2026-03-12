declare global {
    interface Window {
        selectBook(id: number): void;
        deleteBook(): void;
    }
}

const API_BASE = '/api'; // ← ЗАМЕНИТЕ на ваш API

interface Book {
    id: number;
    title: string;
    author?: string;
    year?: number;
}

let books: Book[] = [];
let selectedId: number | null = null;

const el = (id: string): HTMLElement => document.getElementById(id)! as HTMLElement;

const log = (msg: string): void => {
    const consoleEl = el('console');
    const time = new Date().toLocaleTimeString();
    consoleEl.textContent += `${time} | ${msg}\n`;
    consoleEl.scrollTop = consoleEl.scrollHeight;
};

// GET - АЖ ДО ЖДАЕТСЯ!
async function loadBooks(): Promise<void> {
    log('GET /books');
    try {
        const res = await fetch(`${API_BASE}/books`);
        books = await res.json();
        const booksEl = el('books');
        booksEl.innerHTML = books.map((b: Book) =>
            `<div class="book ${selectedId === b.id ? 'selected' : ''}" 
                onclick="selectBook(${b.id})">
                ${b.id}. ${b.title} | ${b.author || '-'} | ${b.year || '-'}
            </div>`
        ).join('');
    } catch (e: unknown) {
        log('❌ ' + (e instanceof Error ? e.message : String(e)));
    }
}

// SELECT
function selectBook(id: number): void {
    selectedId = id;
    const book = books.find(b => b.id === id);
    (el('title') as HTMLInputElement).value = book?.title || '';
    (el('author') as HTMLInputElement).value = book?.author || '';
    (el('year') as HTMLInputElement).value = book?.year?.toString() || '';
    void loadBooks(); // ← await НЕ НУЖЕН, но Promise обработан!
}

// POST
async function addBook(): Promise<void> {
    const titleInput = el('title') as HTMLInputElement;
    const title = titleInput.value.trim();
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
            titleInput.value = '';
            void loadBooks(); // ← Promise обработан!
            log('✅ POST OK');
        }
    } catch (e: unknown) {
        log('❌ ' + (e instanceof Error ? e.message : String(e)));
    }
}

// PUT
async function editBook(): Promise<void> {
    if (!selectedId) return log('⚠️ Выберите книгу');
    const titleInput = el('title') as HTMLInputElement;
    const title = titleInput.value.trim();
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
            titleInput.value = '';
            selectedId = null;
            void loadBooks(); // ← Promise обработан!
            log('✅ PUT OK');
        }
    } catch (e: unknown) {
        log('❌ ' + (e instanceof Error ? e.message : String(e)));
    }
}

// DELETE
async function deleteBook(): Promise<void> {
    if (!selectedId || !confirm('Удалить книгу?')) return;
    log(`DELETE /books/${selectedId}`);
    try {
        const res = await fetch(`${API_BASE}/books/${selectedId}`, { method: 'DELETE' });
        if (res.ok) {
            (el('title') as HTMLInputElement).value = '';
            selectedId = null;
            void loadBooks(); // ← Promise обработан!
            log('✅ DELETE OK');
        }
    } catch (e: unknown) {
        log('❌ ' + (e instanceof Error ? e.message : String(e)));
    }
}

// Инициализация
(() => {
    document.getElementById('addBtn')!.onclick = addBook;
    document.getElementById('editBtn')!.onclick = editBook;
    document.getElementById('deleteBtn')!.onclick = deleteBook;

    (window as any).selectBook = selectBook;
    (window as any).deleteBook = deleteBook;

    void loadBooks(); // ← Promise обработан при старте!
})();
