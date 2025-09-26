import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";


export const sendMessage = async(req,res)=>{
try {
  const senderId = req.id;
  const receiverId = req.params.id;
  const {message} = req.body;

  let conversation = await Conversation.findOne({
    participants:{$all:{senderId,receiverId}}
  });
  // stablize the conversation if not started yet
  if(!conversation){
    conversation = await Conversation.create({
      participants:[senderId,receiverId],
    })
  }
  const newmessage = await Message.create({
    senderId,
    receiverId,
    message,
  });

  if(newmessage) conversation.messages.push(newmessage._id);
  await Promise.all([conversation.save(),newmessage.save()]);
  
  //implementing socket io for real time data transfer!!!
  return res.status(201).json({
    newmessage,
    success:true,
  })
} catch (error) {
  console.log('error in sendMessage');
  console.log(error);
}
}

export const getMessage = async(req,res)=>{
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.find({
      participants:[senderId,receiverId]
    })
    if(!conversation) return res.status(404).json({
      success:false,
      message:[]
    })

    return res.status(200).json({
      success:true,
      message: conversation?.messages
    })
    
  } catch (error) {
    console.log('error in getMessage');
    console.log(error);
  }
}