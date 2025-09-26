import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Bookmark, Heart, HeartIcon, HeartOff, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa"
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSilce'

const post = ({post}) => {
  const [text, settext] = useState('');
  const [open, setOpen] = useState('');
  const {user} = useSelector(store=>store.auth);
  const {posts} = useSelector(store=>store.post);
  const [liked,setLiked] = useState(post.likes.includes(user._id) || false);
  const [postLike,setpostLike ] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);

  const dispatch = useDispatch();
  const changeEventHandler = (e)=>{
    const InputText = e.target.value;
    if(InputText.trim()){
      settext(InputText);
    }else{
      settext(''); 
    }
  }
  const deleteHandler = async ()=>{
    try {
      const res = await axios.delete(`http://localhost:8281/api/v1/post/delete/${post._id}`,{withCredentials:true});

      if(res.data.success){
        toast.success(res.data.message);
        const updatedPost = posts.filter((postItem)=>postItem._id!==post._id);
        dispatch(setPosts(updatedPost));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  const likeOrDislikeHandler = async ()=>{
    try {
      const action = liked ? 'dislike': 'like';
      
      const res = await axios.get(`http://localhost:8281/api/v1/post/${post._id}/${action}`,{withCredentials:true});

      if(res.data.success){
        const updatedLikes = liked ? postLike - 1:postLike+1;
        setpostLike(updatedLikes)
        setLiked(!liked);

        const updatedPostData = posts.map((p) => 
          p._id === post._id 
            ? {
                ...p,
                likes: liked ? p.likes.filter((id) => id !== user._id) : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  const commmentHandler = async ()=>{ 
    
    try {
      const res = await axios.post(`http://localhost:8281/api/v1/post/${post._id}/comment`,{text},{
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      });
      console.log(res)
      if (res.data.success) {

      const updatedCommentData = [...comment, res.data.comment];
      setComment(updatedCommentData);

      // Declare a new variable for updated posts
      const updatedPosts = posts.map((p) =>
        p._id === post._id ? { ...p, comments: updatedCommentData } : p
      );
      dispatch(setPosts(updatedPosts)) // Update posts state with the new array
      toast.success(res.data.message);
      settext('')
    }
    } catch (error) {
      console.log(error)
      const errorMessage =
      error.response?.data?.message || 'Something went wrong. Please try again.';
    toast.error(errorMessage);
    }
  }
  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt='post_image' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTitle/>
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer'>
            </MoreHorizontal>
          </DialogTrigger>
          <DialogContent className='flex flex-col items-center text-sm text-center'>
            <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold'>Unfollow</Button>
            <Button variant='ghost' className='cursor-pointer w-fit '>Add to favourites</Button>
            {  user && user._id === post.author._id && (<Button onClick={deleteHandler} variant='ghost' className='cursor-pointer w-fit '>Delete</Button>)
            }
          </DialogContent>
        </Dialog>
      </div>
      <img
        className='rounded-sm my-2 w-full aspect-square object-cover '
        src={post.image}
        alt="post_image"
      />
      <div className='items-center  my-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            { liked ? <FaHeart onClick={likeOrDislikeHandler} size={'23px'} className='cursor-pointer text-red-500 hover:text-red-700'></FaHeart>
            :<FaRegHeart onClick={likeOrDislikeHandler} size={'23px'} className='cursor-pointer hover:text-gray-600'/>
            }
            
            <MessageCircle onClick={()=>{setOpen(true);dispatch(setSelectedPost(post))}} className='cursor-pointer hover:text-gray-600'/>
            <Send className='cursor-pointer hover:text-gray-600'/>
          </div>
          <Bookmark className='cursor-pointer hover:text-gray-600'/>
        </div>
      </div>
      <span className='font-medium block mb-2 '>{postLike} likes</span>
      <p>
        <span className='font-medium mr-2'>{post.author?.username}</span>
        {post.caption}
      </p>
      {
        comment.length == 0?<span onClick={()=>setOpen(false)} className='cursor-pointer text-sm text-gray-400'>No comments</span>:<>
        <span onClick={()=>{setOpen(true);dispatch(setSelectedPost(post))}} className='cursor-pointer text-sm text-gray-400'> veiw all {comment.length} comments</span>
        </>
      }
      <CommentDialog open={open} setOpen={setOpen} />
      <div className='flex  items-center justify-between'>
        <input 
        type="text"
        placeholder='Add a commnet...'
        value={text}
        onChange={changeEventHandler}
        className='outline-none text-sm w-full'
        />
        {
          text && <span onClick={commmentHandler} className='text-[#3BADF8] cursor-pointer hover:bg-slate-200'>Post</span>
        }
      </div>
    </div>
  )
}

export default post