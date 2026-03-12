interface Book {
    id: number;
    title: string;
}

class Library {
    private books: Book[] = [];
    private nextId: number = 1;
    private bookInput = document.getElementById('bookInput') as HTMLInputElement;
    private addBtn = document.getElementById('addBtn') as HTMLButtonElement;
    private booksList = document.getElementById('booksList') as HTMLElement;

    constructor() {
        this.init();
    }

    private init(): void {
        this.addBtn.addEventListener('click', () => this.addBook());
        this.bookInput.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') this.addBook();
        });

        // Симуляция POST запроса и начальных книг
        this.simulateInitialBooks();
    }

    private async addBook(): Promise<void> {
        const title = this.bookInput.value.trim();
        if (!title) return;

        // Имитация POST запроса на сервер
        const bookData = { title, id: this.nextId++ };

        try {
            // Симуляция network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // "Успешный" ответ от сервера
            const newBook: Book = bookData;

            this.books.push(newBook);
            this.renderBooks();
            this.bookInput.value = '';

            console.log('POST /books:', bookData, '→', newBook);
        } catch (error) {
            console.error('Ошибка добавления книги:', error);
        }
    }

    private simulateInitialBooks(): void {
        // Начальные книги (как будто загрузились с сервера)
        const initialBooks: Book[] = [
            { id: 1, title: 'Война и мир' },
            { id: 2, title: '1984' },
            { id: 3, title: 'Преступление и наказание' }
        ];
        this.books = initialBooks;
        this.renderBooks();
    }

    private renderBooks(): void {
        this.booksList.innerHTML = '';

        this.books.forEach(book => {
            const bookEl = document.createElement('div');
            bookEl.className = 'p-4 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors flex justify-between items-center';
            bookEl.innerHTML = `
                <span>📚 ${book.title}</span>
                <small class="text-gray-400">#${book.id}</small>
            `;
            this.booksList.appendChild(bookEl);
        });
    }
}

// Запуск приложения
new Library();
