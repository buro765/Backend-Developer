import express from 'express';
const app = express();
app.use(express.json());

let books = [{id: 1, title: 'Тест'}];
let id = 2;

app.get('/api/books', (req, res) => res.json(books));
app.post('/api/books', (req, res) => {
    books.push({id: id++, title: req.body.title});
    res.json({ok: true});
});

app.listen(3000, () => console.log('Backend: localhost:3000'));
