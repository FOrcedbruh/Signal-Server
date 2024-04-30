const User = require('./../models/User.js');

class controller {
    async getUsersForSideBar(req, res) {
        try {
            const loggedInUserId = req.user._id;

            const allUsers = await User.find({_id: { $ne: loggedInUserId}}).select("-password");

            return res.status(201).json(allUsers);
        } catch (error) {
            console.log(error);
            return res.status(404).json({
                message: "Ошибка на сервере"
            })
        }
    }
}

module.exports = new controller();