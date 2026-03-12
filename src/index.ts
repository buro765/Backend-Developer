const API_BASE = '/api'; // или 'https://ваш-api.onrender.com/api'

interface Book {
    id: number;
    title: string;
    author: string | undefined;  // explicit undefined
    year: number | undefined;    // explicit undefined
}

let books: Book[] = [];
let selectedBookId: number | null = null;

// DOM элементы
const booksContainer = document.getElementById('books-container') as HTMLElement;
const consoleEl = document.getElementById('console') as HTMLElement;
const titleInput = document.getElementById('title') as HTMLInputElement;
const authorInput = document.getElementById('author') as HTMLInputElement;
const yearInput = document.getElementById('year') as HTMLInputElement;
const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
const editBtn = document.getElementById('editBtn') as HTMLButtonElement;
const deleteBtn = document.getElementById('deleteBtn') as HTMLButtonElement;

// Логи консоли
function log(message: string): void {
    const time = new Date().toLocaleTimeString('ru-RU');
    consoleEl.textContent += `${time} | ${message}\n`;
    consoleEl.scrollTop = consoleEl.scrollHeight;
    console.log(message);
}

// Загрузка книг
async function loadBooks(): Promise<void> {
    log('📡 GET /books - Загрузка списка...');
    (document.body as HTMLElement).classList.add('loading');

    try {
        const response = await fetch(`${API_BASE}/books`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        books = await response.json();
        renderBooks();
        log(`✅ Получено книг: ${books.length}`);
    } catch (error) {
        log(`❌ Ошибка загрузки: ${(error as Error).message}`);
    } finally {
        (document.body as HTMLElement).classList.remove('loading');
    }
}

// Отрисовка списка
function renderBooks(): void {
    if (books.length === 0) {
        booksContainer.innerHTML = '<div class="empty">📚 Нет книг. Добавьте первую!</div>';
        return;
    }

    booksContainer.innerHTML = books.map(book => `
        <div class="book ${selectedBookId === book.id ? 'selected' : ''}" 
             onclick="selectBook(${book.id})">
            <strong>${book.title || 'Без названия'}</strong>
            <span>${book.author || 'Неизвестный'}</span>
            <span>${book.year || '—'}</span>
            <button class="btn btn-danger btn-sm" 
                    onclick="event.stopPropagation(); deleteBook(${book.id})">
                🗑️
            </button>
        </div>
    `).join('');
}

// Выбор книги
function selectBook(id: number): void {
    selectedBookId = id;
    const book = books.find(b => b.id === id);
    if (book) {
        titleInput.value = book.title || '';
        authorInput.value = book.author || '';
        yearInput.value = book.year?.toString() || '';
        renderBooks();
        log(`📖 Выбрана книга: ${book.title}`);
    }
}

// Добавление книги
async function addBook(): Promise<void> {
    const title = titleInput.value.trim();
    if (!title) {
        log('⚠️ Название обязательно!');
        return;
    }

    const newBook: Partial<Book> = {
        title,
        author: authorInput.value.trim() || undefined,
        year: yearInput.value ? +yearInput.value : undefined
    };

    log('📤 POST /books - Создание...');

    try {
        const response = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBook)
        });

        if (response.ok) {
            clearForm();
            await loadBooks();
            log('✅ Книга добавлена!');
        } else {
            const error = await response.json();
            log(`❌ ${error.error || 'Ошибка сервера'}`);
        }
    } catch (error) {
        log(`❌ ${(error as Error).message}`);
    }
}

// Редактирование
async function editBook(): Promise<void> {
    if (!selectedBookId) {
        log('⚠️ Выберите книгу!');
        return;
    }

    const title = titleInput.value.trim();
    if (!title) {
        log('⚠️ Название обязательно!');
        return;
    }

    const updatedBook: Partial<Book> = {
        title,
        author: authorInput.value.trim() || undefined,
        year: yearInput.value ? +yearInput.value : undefined
    };

    log(`📤 PUT /books/${selectedBookId} - Обновление...`);

    try {
        const response = await fetch(`${API_BASE}/books/${selectedBookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBook)
        });

        if (response.ok) {
            clearForm();
            await loadBooks();
            log('✅ Книга обновлена!');
        } else {
            const error = await response.json();
            log(`❌ ${error.error || 'Ошибка сервера'}`);
        }
    } catch (error) {
        log(`❌ ${(error as Error).message}`);
    }
}

// Удаление
async function deleteBook(id?: number): Promise<void> {
    const bookId = id || selectedBookId;
    if (!bookId) {
        log('⚠️ Выберите книгу!');
        return;
    }

    if (!confirm('🗑️ Удалить книгу?')) return;

    log(`🗑️ DELETE /books/${bookId}`);

    try {
        const response = await fetch(`${API_BASE}/books/${bookId}`, { method: 'DELETE' });

        if (response.status === 204 || response.ok) {
            clearForm();
            await loadBooks();
            log('✅ Книга удалена!');
        } else {
            const error = await response.json();
            log(`❌ ${error.error || 'Не найдена'}`);
        }
    } catch (error) {
        log(`❌ ${(error as Error).message}`);
    }
}

// Очистка формы
function clearForm(): void {
    titleInput.value = '';
    authorInput.value = '';
    yearInput.value = '';
    selectedBookId = null;
    renderBooks();
}

// События кнопок
addBtn.onclick = addBook;
editBtn.onclick = editBook;
deleteBtn.onclick = () => deleteBook();

// Инициализация
window.addEventListener('load', loadBooks);

// Глобальные функции для onclick в HTML
(window as any).selectBook = selectBook;
(window as any).deleteBook = deleteBook;