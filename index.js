"use strict";
class Library {
    constructor() {
        this.books = [
            { id: 1, title: 'Война и мир', author: 'Лев Толстой', year: 1869 },
            { id: 2, title: '1984', author: 'Джордж Оруэлл', year: 1949 },
            { id: 3, title: 'Преступление и наказание', author: 'Фёдор Достоевский', year: 1866 }
        ];
        this.nextId = 4;
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }
    init() {
        const bookInput = document.getElementById('bookInput');
        const authorInput = document.getElementById('authorInput');
        const yearInput = document.getElementById('yearInput');
        const addBtn = document.getElementById('addBtn');
        const booksList = document.getElementById('booksList');
        if (!bookInput || !authorInput || !yearInput || !addBtn || !booksList) {
            console.error('DOM элементы не найдены!');
            return;
        }
        addBtn.addEventListener('click', () => this.addBook(bookInput, authorInput, yearInput, booksList));
        bookInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter')
                this.addBook(bookInput, authorInput, yearInput, booksList);
        });
        this.renderTable(booksList);
    }
    // ✅ ФИКС: list вместо table
    addBook(titleInput, authorInput, yearInput, list) {
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const year = parseInt(yearInput.value) || 0;
        if (!title || !author || !year) {
            alert('Заполните все поля: название, автор, год');
            return;
        }
        setTimeout(() => {
            const book = { id: this.nextId++, title, author, year };
            this.books.push(book);
            this.renderTable(list); // ✅ list
            titleInput.value = '';
            authorInput.value = '';
            yearInput.value = '';
            console.log('POST /books:', book);
        }, 500);
    }
    renderTable(list) {
        list.innerHTML = `
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
                            <td>#${book.id}</td>
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
