const express = require('express');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const authRouter = require('./auth/authRouter');
const messageRouter = require('./messages/messageRouter');
const usersRouter = require('./users/usersRouter');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { app, io, server } = require('./socket/socket');

dotenv.config();


const PORT = process.env.PORT || 8080;

const origin = `http://localhost:3000`;

app.use(cors({
    credentials: true,
    origin: origin
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());


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
        server.listen(PORT, () => {
            console.log(`Сервер запущен на порту http://localhost:${PORT}`);
        })
    } catch(error) {
        console.log(error);
    }
}

start();

