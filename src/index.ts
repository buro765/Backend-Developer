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
        const booksTable = document.getElementById('booksTable') as HTMLElement;

        if (!bookInput || !authorInput || !yearInput || !addBtn || !booksTable) {
            console.error('DOM элементы не найдены!');
            return;
        }

        addBtn.addEventListener('click', () => this.addBook(bookInput, authorInput, yearInput, booksTable));
        bookInput.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') this.addBook(bookInput, authorInput, yearInput, booksTable);
        });

        this.renderTable(booksTable);
    }

    private addBook(titleInput: HTMLInputElement, authorInput: HTMLInputElement, yearInput: HTMLInputElement, table: HTMLElement): void {
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
            this.renderTable(table);
            titleInput.value = '';
            authorInput.value = '';
            yearInput.value = '';
            console.log('POST /books:', book);
        }, 500);
    }

    private renderTable(table: HTMLElement): void {
        table.innerHTML = `
            <table class="books-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Автор</th>
                        <th>Год</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.books.map(book => `
                        <tr>
                            <td>${book.id}</td>
                            <td>📚 ${book.title}</td>
                            <td>${book.author}</td>
                            <td>${book.year}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

new Library();
