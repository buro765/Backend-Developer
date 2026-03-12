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

    private init(): void {
        const bookInput = document.getElementById('bookInput') as HTMLInputElement;
        const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
        const booksList = document.getElementById('booksList') as HTMLElement;

        addBtn.addEventListener('click', () => this.addBook(bookInput, booksList));
        bookInput.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') this.addBook(bookInput, booksList);
        });

        this.renderBooks(booksList);
    }

    private async addBook(input: HTMLInputElement, list: HTMLElement): Promise<void> {
        const title = input.value.trim();
        if (!title) return;

        // Симуляция POST запроса на сервер
        await new Promise(resolve => setTimeout(resolve, 500));

        const book: Book = { id: this.nextId++, title };
        this.books.push(book);
        this.renderBooks(list);
        input.value = '';
        console.log('POST /books:', book);
    }

    private renderBooks(list: HTMLElement): void {
        list.innerHTML = '';
        this.books.forEach(book => {
            const div = document.createElement('div');
            div.className = 'book';
            div.innerHTML = `<span class="book-title">📚 ${book.title}</span><span class="book-id">#${book.id}</span>`;
            list.appendChild(div);
        });
    }

    constructor() {
        this.init();
    }
}

new Library();
