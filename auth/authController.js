const User = require('./../models/User');
const jwt = require('jsonwebtoken');
const secret = require('./config');
const bcrypt = require('bcrypt');


const generate_jwt = (userId, res) => {
    const payload = {
        userId
    };

    const token = jwt.sign(payload, secret, {expiresIn: '15d'});

    return res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    });
}






class controller {

    async registration(req, res)  {
        const { username, fullname, password, gender, avatar } = req.body;
    
        const candidate = await  User.findOne({username});
    
        if (candidate) {
            return res.status(400).json({
                message: `Пользователь ${username} уже существует`
            })
        }
    
        const maleAvatar = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleAvatar = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const hashPassword = bcrypt.hashSync(password, 10);
    
        const user = new User({
            username,
            password: hashPassword,
            fullname,
            gender,
            avatar: gender === 'male' ? maleAvatar : femaleAvatar
        });
    
        await user.save();

        await generate_jwt(user._id, res);
    
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            avatar: user.avatar
        });
    }

    async login(req, res) {
        const { username, password } = req.body;

        const user = await  User.findOne({username});

        if (!user) {
            return res.status(400).json({message: `Пользователя ${username} не существует`});
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({message: `Пароль ${password} неверный`})
        }

        await generate_jwt(user._id, res);


        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            avatar: user.avatar,
        });
    }

    async logout(req, res) {
        try {
            res.cookie('jwt', '', {
                maxAge: 0
            });
            res.status(200).json({message: "Вы успешно вышли с аккаунта"});
        } catch(e) {
            console.log(e);
            return res.status(400).json({message: "Ошибка на сервере"});
        }
    }
}



module.exports = new controller();