const Conversation = require('./../models/Conversation');
const Message = require('./../models/Message');
const { getReceiverSocketId, io } = require('./../socket/socket');

class controller {
    async sendMessage(req, res) {
        try {
            const { message } = req.body;
            const { id: receiverId } = req.params;

            const senderId = req.user._id;

            let conversation = await Conversation.findOne({participants: {$all: [senderId, receiverId]}});

            if (!conversation) {
                conversation = await Conversation.create({participants: [senderId, receiverId]});
            }

            const newMessage =  new Message({
                senderId: senderId,
                receiverId: receiverId,
                message: message
            });

            if (newMessage) {
                conversation.messages.push(newMessage._id);
            }

            await Promise.all([conversation.save(), newMessage.save()]);

            // web-socket logics

            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }

            return res.status(201).json(
                newMessage
            );

        } catch (error) {
            console.log(error);
            return res.status(400).json({message: "Ошибка отправки сообщения"});
        }
    }

    async getMessage(req, res) {
        try {
            const { id: userToChatId } = req.params;
            const senderId = req.user._id;

            const conversation = await Conversation.findOne({ participants: { $all: [senderId, userToChatId]}}).populate('messages');


            if (!conversation.messages) {
                return res.status(201).json({
                    message: 'Начните общение'
                })
            }
                return res.status(201).json(conversation.messages);

        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Ошибка на сервере"
            })
        }
    }
}



module.exports = new controller();