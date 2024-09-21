const express = require("express");
const router = express.Router();
const Message = require("../models/Message")


router.post("/",async(req,res)=>{
    const {senderId,receiverId,message} = req.body;

    try {
        if(!senderId || !receiverId || !message){
            return res.status(400).json({message:"provide all area"})
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })
        await newMessage.save();
        return res.status(200).json({message:"message added to DB"})
        
    } catch (error) {
        return res.status(400).json(error)
    }
})

router.get("/:senderId/:receiverId",async(req,res)=>{
    const {senderId,receiverId} = req.params;
    try {
        if(!senderId || !receiverId){
            return res.status(400).json({message:"provide all information"})
        }
        const messages = await Message.find({
            $or:[
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 })
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(err);
    }
})


module.exports = router;