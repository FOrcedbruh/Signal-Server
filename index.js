const express = require('express');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const authRouter = require('./auth/authRouter');
const messageRouter = require('./messages/messageRouter');
const usersRouter = require('./users/usersRouter');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/messages', messageRouter);

app.get('/', (req, res) => {
    res.json({
        message: "Hello!"
    })
});

const db_url = process.env.DB_URL;

const start = async () => {
    try {
        mongoose.connect(db_url).then(() => console.log('Подключено в базе данных'))
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту http://localhost:${PORT}`);
        })
    } catch(error) {
        console.log(error);
    }
}

start();

