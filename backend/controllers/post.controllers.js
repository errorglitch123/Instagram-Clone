import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';
export const addNewPost = async (req,res)=>{
  try {
    const {caption}= req.body;
    const image = req.file;
    const authorId = req.id;

    if(!image) return res.status(400).json({message:'Image required'});

    //image upload
    const optimizedImageBuffer = await sharp(image.buffer)
    .resize({width:800,hieght:800,fit:'inside'})
    .toFormat('jpeg',{quality:80})
    .toBuffer();
    
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image:cloudResponse.secure_url,
      author:authorId,
    })
    const user = await User.findById(authorId);
    if(user){
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({path:'author',select:'-password'});
    return res.status(200).json({
      message:'New post added',
      post,
      success:true,
    });
  } catch (error) {
    console.log('error in addNewPost');
    console.log(error);
  }
}

export const getAllPost = async(req,res)=>{
  try {
    const posts = await Post.find().sort({createAt:-1})
    .populate({path:'author',
      select:'username profilePicture'})
    .populate({
      path:'comments',
      sort:{createdAt:-1},
      populate:{
        path:'author',
        select:'username profilePicture',
      }
    });
    return res.status(200).json({
      posts,
      success:true,
    })

  } catch (error) {
    console.log('error in get all posts');
    console.log(error);
  }
}

export const getUserPost = async(req,res)=>{
  try {
    const authorId = req.id;
    const posts = await Post.find({author:authorId}).sort({createdAt:-1})
    .populate({
      path:'author',
      select:'username profilePicture'
    })
    .populate({
      path:'comments',
      sort:{createdAt:-1},
      populate:{
        path:'author',
        select:'username profilePicture'
      }
    });
    return res.status(200).json({
      posts,
      success:true
    })
    
  } catch (error) {
    console.log('error in get User Post');
    console.log(error);
  }
} 

export const likePost = async (req,res)=>{
  try {
    const likerId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({message:'Post not found', success: false});
    
    await post.updateOne({$addToSet: {likes:likerId}});
    await post.save();

    return res.status(200).json({
      message:'Post liked',
      success:true,
    })

  } catch (error) {
    console.log('error in likePost');
    console.log(error);
  }
}

export const dislikePost = async (req,res)=>{
  try {
    const likerId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({message:'Post not found', success: false});
    
    await post.updateOne({$pull: {likes:likerId}});
    await post.save();

    return res.status(200).json({
      message:'Post disliked',
      success:true,
    })

  } catch (error) {
    console.log('error in dislikePost');
    console.log(error);
  }
}

export const addComment = async (req,res)=>{
  try {
    const postId = req.params.id;
    const commeterId = req.id;
    const {text} = req.body;

    const post = await Post.findOne({_id:postId});
    if(!text) return res.status(200).json({
      message:'Write Something',
      success:false,
    })

    const comment = await Comment.create({
      text,
      author:commeterId,
      post:postId,
    });
    await comment.populate({
      path:'author',
      select:'username profilePicture'
    })

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
      message:'Comment Added',
      comment,
      success:true,
    })

  } catch (error) {
    console.log('error in addComment');
    console.log(error);
  }
}

export const getCommnetOfPost = async(req,res)=>{
  try {
    const postId = req.params.id;

    const comment = await Comment.find({post:postId})
    .populate('author','username profilePicture bio');

    if(!comment) return res.status(404).json({
      message:'No comment for this post yet',
      success:false,
    })

    return res.status(200).json({
      comment,
      success:true
    })

  } catch (error) {
    console.log('error in getCommentOfPost');
    console.log(error);
  }
}

export const deletePost = async(req,res)=>{
  try {
    const postId = req.params.id;
  const authorId = req.id

  const post = await Post.findById(postId);
  if(!post) return res.status(404).json({
    message:'Post Not found',
    success:false,
  })

  //checking if the logged-in-user is the owner of the post or not!!!
  if(post.author.toString() !== authorId) return res.status(403).json({
    message:'Unauthorized',
    success:false
  })

  await Post.findByIdAndDelete(postId);
  let user = await User.findById(authorId);
  user.posts = user.posts.filter(id => id.toString() !== postId);

  await user.save();

  await Comment.deleteMany({post:postId});

  return res.status(200).json({
    message:'Post deleted successfully',
    success:true,
  })
  } catch (error) {
    console.log('error in delete post');
    console.log(error);
  }
}

export const bookmarkPost = async(req,res)=>{
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({
      message:'Post Not Found',
      status:false,
    })
    const user = await User.findById(authorId);
    if(user.bookmarks.includes(post._id) ){
      //already booked marked unmarked it
      await user.updateOne({$pull:{bookmarks:post._id}});
      await user.save();
      return res.status(200).json({
        type:'unsaved',
        message:'post removed from bookmarks',
        success:true,
      })
    }
    else{
      //if not marked it
      await user.updateOne({$addToSet:{bookmarks:post._id}});
      await user.save();
      return res.status(200).json({
        type:'unsaved',
        message:'post removed from bookmarks',
        success:true,
      })
      
    }
  } catch (error) {
    
  }
}