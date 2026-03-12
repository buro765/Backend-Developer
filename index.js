"use strict";
class Library {
    constructor() {
        this.books = [
            { id: 1, title: 'Война и мир' },
            { id: 2, title: '1984' },
            { id: 3, title: 'Преступление и наказание' }
        ];
        this.nextId = 4;
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }
    init() {
        const bookInput = document.getElementById('bookInput');
        const addBtn = document.getElementById('addBtn');
        const booksList = document.getElementById('booksList');
        if (!bookInput || !addBtn || !booksList) {
            console.error('DOM элементы не найдены!');
            return;
        }
        const input = bookInput;
        const btn = addBtn;
        const list = booksList;
        btn.addEventListener('click', () => this.addBook(input, list));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter')
                this.addBook(input, list);
        });
        this.renderBooks(list);
    }
    addBook(input, list) {
        const title = input.value.trim();
        if (!title)
            return;
        setTimeout(() => {
            const book = { id: this.nextId++, title };
            this.books.push(book);
            this.renderBooks(list);
            input.value = '';
            console.log('POST /books:', book);
        }, 500);
    }
    renderBooks(list) {
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
