import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
dotenv.config();


export const register = async (req,res)=>{
  try {
    const {username,email,password}= req.body;
    if(!username||!email||!password){
      return res.status(401).json({
        message:'Something is missing on register function',
        success:false,
      })
    }
    const user = await User.findOne({email})
    if(user){
      return res.status(401),json({
        message:'Something is wrong user with email already exist',
        success:false, 
      })
    };

    const hashedPassword = await bcrypt.hash(password,10);
    await User.create({
      username,
      email,
      password:hashedPassword
    });

    return res.status(201).json({
      message:'Account created successfully',
      status:true,
    })
  } catch (error) {
    console.log(error);
    console.log('problem in user controller');
  }
}

export const login = async (req,res)=>{
  try {
    const {email,password}= req.body;
    if(!email||!password){
      return res.status(401).json({
        message:'Something is missing on register function',
        success:false,
      })
    }

    let user = await User.findOne({email});
    if(!user){
      return res.status(401).json({
        message:'User does not exist!',
        success:false,
      })
    }
    const isPasswordMatched = await bcrypt.compare(password,user.password);
    
    if(!isPasswordMatched){
      return res.status(401).json({
        message:'Incorrect Password!',
        success:false,
      })
    }
    const token =  jwt .sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});

    const populatedPost = await Promise.all(
      user.posts.map(async (postId)=>{
        const post = await Post.findById(postId);
        if(post.author.equals(user.id)){
          return post;
        }
        return null;
      })
    )
    user = {
      _id :user._id,
      username :user.username,
      email:user.email,
      profilepicture:user.profilePicture,
      bio:user.bio,
      follower:user.followers,
      following:user.following,
      posts:populatedPost,

    }
    return res.cookie('token',token,{httpOnly:true,sameSite:'strict', maxAge:1*24*60*60*1000}).json({
      message:`Welcome back ${user.username}`,
      user,
      success:true,
    })

  } catch (error) {
    console.log(error);
    console.log('error occured in login');
  }
}

export const logout = async (_,res)=>{
  try {
    return res.cookie("token","",{maxAge:0}).json({
      message:'Logged out successfully!',
      success:true
    })
  } catch (error) {
    console.log(error);
    console.log('error occured in logout');
  }
} 

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId)
    // Find user by ID
    let user = await User.findById(userId)
      .populate({
        path: 'posts',
        sort:{createdAt:-1}
      }) // Populate bookmarks

    // Return populated user data
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    console.log('Error occurred in getProfile');

    // Respond with an error message
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the profile.',
    });
  }
};

export const editProfile = async(req,res)=>{
  try {
    const userId = req.id;
    const {bio,gender} = req.body;
    const profilepicture = req.file;
    let cloudresponse;

    if(profilepicture){
      const fileUri = getDataUri(profilepicture);
      await cloudinary.uploader.upload(fileUri);

    }

    const user = await User.findById(userId).select('-password');
    if(!user){
      return res.status(404).json({
        message:'User not found error in edit profile',
        success:false,
      })
    }
    if(bio) user.bio = bio;
    if(gender) user.gender = gender;
    if(profilepicture) user.profilepicture = cloudresponse.secure_url;

    await user.save();
    return res.status(200).json({
      message:'proile editted successfully',
      success:true,
      user
    })
  } catch (error) {
    console.log(error);
    console.log('error occured in editProfile');
  }
}

export const getSuggestedUsers = async(req,res)=>{
  const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
if (!suggestedUsers) {
  return res.status(400).json({
    message: "Currently do not have any users",
    success: false,
  });
}
return res.status(200).json({
  success: true,
  users: Array.isArray(suggestedUsers) ? suggestedUsers : Object.values(suggestedUsers), // Ensure this is an array
});
};
export const followeOrUnfollow= async (req,res)=>{
  try {
    const followKrneWala = req.id;
    const jiskoFollowKaruga = req.params.id

    if(followKrneWala === jiskoFollowKaruga){
      return res.status(400).json({
        message:'you cannot follow unfollow yourserlf',
        success:false,
      })
    }

    const user = User.findById(followKrneWala);
    const targetUser = User.findById(jiskoFollowKaruga);

    if(!user || !targetUser){
      return res.status(400).json({
        message:'You cannot follow/unfollow',
        success:false,
      })
    }

    const isFollowing = user.following.includes(jiskoFollowKaruga);
    if(isFollowing){
      await Promise.all([
        User.updateOne({_id:followKrneWala},{$pull:{following:jiskoFollowKaruga}}),
        User.updateOne({_id:jiskoFollowKaruga},{$pull:{follower:followKrneWala}})
       ])
       return res.status(200).json({
        message:'Unfollowed successfully',
        success:true
      });
    }
    else{
       await Promise.all([
        User.updateOne({_id:followKrneWala},{$push:{following:jiskoFollowKaruga}}),
        User.updateOne({_id:jiskoFollowKaruga},{$push:{follower:followKrneWala}})
       ])
       return res.status(200).json({
        message:'followed successfully',
        success:true,
      })
    }
  } catch (error) {
    console.log(error);
    console.log('error in follow/unfollow');

  }
}