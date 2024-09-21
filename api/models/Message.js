const mongoose = require("mongoose");
const User = require("../models/User")


const MessageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
})

module.exports =mongoose.model("Message",MessageSchema);