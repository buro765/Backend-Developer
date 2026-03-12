import express from 'express'
const app = express()
const port = 3000

const jsonBody = express.json()
app.use(jsonBody)

const db ={
    books: [
        {id: 1, title:"Колобок"},
        {id: 2, title:"Ворона"},
        {id: 3, title:"ВорХроники"},
        {id: 4, title:"Оно"}
    ]
}
app.get('/', (req, res) => {
    res.json({ message: 'гет запрос' })  // ← ФИКС 2
})

app.get('/books', (req, res) => {
    let VorBooks = db.books;
    if (req.query.title) {
        VorBooks = VorBooks
            .filter(c => c.title.indexOf(req.query.title as string) > -1)
    }

    res.json(VorBooks)
})

app.get('/books/:id', (req, res) => {  // ← ОТДЕЛЬНЫЙ роут!

    const FoundBody = db.books
        .find(c => c.id === +req.params.id);

    if (!FoundBody) {
        res.sendStatus(404)
        return;
    }
    res.json(FoundBody)
})

app.delete('/books/:id', (req, res) => {  // ← ОТДЕЛЬНЫЙ роут!

    db.books = db.books
        .filter(c => c.id !== +req.params.id);


    res.sendStatus(204)
})

app.post('/books', (req, res) => {
    // ШАГ 1: Получаем title (с защитой)
    const title = req.body.title?.trim();

    // ШАГ 2: Проверяем результат
    if (!title) {  // "", null, undefined
        return res.status(400).json({ error: 'Название обязательно' });
    }

    // ШАГ 3: Создаём книгу с ОЧИЩЕННЫМ title
    const CreaBooks = {
        id: +(new Date()),
        title: title  // "Прикол" ← пробелы убраны!
    };

    db.books.push(CreaBooks);
    res
        .status(201)
        .json(CreaBooks);
})

app.put('/books/:id', (req, res) => {  // ← ОТДЕЛЬНЫЙ роут!

     if (!req.body.title){
         res.sendStatus(400)
         return;
     }
    const FoundBody = db.books
        .find(c => c.id === +req.params.id);

    if (!FoundBody) {
        res.sendStatus(404)
        return;
    }
    FoundBody.title = req.body.title;

    res.json(FoundBody)
})

app.listen(port, () => {  // ← Одна }
    console.log(`Сервер на порту ${port}`)
})