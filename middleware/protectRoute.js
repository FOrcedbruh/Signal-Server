const jwt = require('jsonwebtoken');
const secret = require('./../auth/config');
const User = require('./../models/User');

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(400).json({message: "Вы не авторизованы"});
        }

        const decoded = jwt.verify(token, secret);

        if (!decoded) {
            return res.status(400).json({message: "Неавторизован - некорректный токен"})
        }

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(400).json({message: "Пользователь не найден"});
        }

        req.user = user

        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({message: "Ошибка на сервере"});
    }
}

module.exports = protectRoute;