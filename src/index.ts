interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
}

class Library {
    private books: Book[] = [
        { id: 1, title: 'Война и мир', author: 'Лев Толстой', year: 1869 },
        { id: 2, title: '1984', author: 'Джордж Оруэлл', year: 1949 },
        { id: 3, title: 'Преступление и наказание', author: 'Фёдор Достоевский', year: 1866 }
    ];
    private nextId: number = 4;

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }

    private init(): void {
        const bookInput = document.getElementById('bookInput') as HTMLInputElement;
        const authorInput = document.getElementById('authorInput') as HTMLInputElement;
        const yearInput = document.getElementById('yearInput') as HTMLInputElement;
        const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
        const booksList = document.getElementById('booksList') as HTMLElement;

        if (!bookInput || !authorInput || !yearInput || !addBtn || !booksList) {
            console.error('DOM элементы не найдены!');
            return;
        }

        addBtn.addEventListener('click', () => this.addBook(bookInput, authorInput, yearInput, booksList));
        bookInput.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') this.addBook(bookInput, authorInput, yearInput, booksList);
        });

        this.renderBooks(booksList);
    }

    private addBook(titleInput: HTMLInputElement, authorInput: HTMLInputElement, yearInput: HTMLInputElement, list: HTMLElement): void {
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const year = parseInt(yearInput.value) || 0;

        if (!title || !author || !year) {
            alert('Заполните все поля: название, автор, год');
            return;
        }

        setTimeout(() => {
            const book: Book = { id: this.nextId++, title, author, year };
            this.books.push(book);
            this.renderBooks(list);
            titleInput.value = '';
            authorInput.value = '';
            yearInput.value = '';
            console.log('POST /books:', book);
        }, 500);
    }

    private renderBooks(list: HTMLElement): void {
        list.innerHTML = '';
        this.books.forEach(book => {
            const div = document.createElement('div');
            div.className = 'book';
            div.innerHTML = `
                <div>
                    <div class="book-title">📚 ${book.title}</div>
                    <div class="book-author">${book.author}, ${book.year}</div>
                </div>
                <span class="book-id">#${book.id}</span>
            `;
            list.appendChild(div);
        });
    }
}

new Library();
