interface Book {
    id: number;
    title: string;
}

class Library {
    private books: Book[] = [
        { id: 1, title: 'Война и мир' },
        { id: 2, title: '1984' },
        { id: 3, title: 'Преступление и наказание' }
    ];
    private nextId: number = 4;

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }

    private init(): void {
        const bookInput = document.getElementById('bookInput');
        const addBtn = document.getElementById('addBtn');
        const booksList = document.getElementById('booksList');

        if (!bookInput || !addBtn || !booksList) {
            console.error('DOM элементы не найдены!');
            return;
        }

        const input = bookInput as HTMLInputElement;
        const btn = addBtn as HTMLButtonElement;
        const list = booksList as HTMLElement;

        btn.addEventListener('click', () => this.addBook(input, list));
        input.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') this.addBook(input, list);
        });

        this.renderBooks(list);
    }

    private addBook(input: HTMLInputElement, list: HTMLElement): void {
        const title = input.value.trim();
        if (!title) return;

        setTimeout(() => {
            const book: Book = { id: this.nextId++, title };
            this.books.push(book);
            this.renderBooks(list);
            input.value = '';
            console.log('POST /books:', book);
        }, 500);
    }

    private renderBooks(list: HTMLElement): void {
        list.innerHTML = '';
        this.books.forEach(book => {
            const div = document.createElement('div');
            div.className = 'book';
            div.innerHTML = `<span>📚 ${book.title}</span><span>#${book.id}</span>`;
            list.appendChild(div);
        });
    }
}

new Library();
