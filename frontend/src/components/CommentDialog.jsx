import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import { setPosts, setSelectedPost } from '@/redux/postSilce'
import { toast } from 'sonner'
import axios from 'axios'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('');
  const { selectedPost, posts } = useSelector(store => store.post);
  const [comment, setComment] = useState(selectedPost?.comments || []);
  const dispatch = useDispatch();

  // Sync `comment` state with `selectedPost.comments` when `selectedPost` changes
  useEffect(() => {
    if (selectedPost?.comments) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);
  
  const changeEventHandler = (e)=>{
    const inputText = e.target.value;

    if(inputText.trim()){
      setText(inputText);
    } else{
      setText('');
    }
  }
  const commmentHandler = async ()=>{ 
    
    try {
      const res = await axios.post(`http://localhost:8281/api/v1/post/${selectedPost?._id}/comment`,{text},{
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      });
      console.log(res)
      if (res.data.success) {

      const updatedCommentData = [...comment, res.data.comment];

      // Declare a new variable for updated posts
      const updatedPosts = posts.map((p) =>
        p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
      );
      dispatch(setPosts(updatedPosts)) // Update posts state with the new array
      setComment(updatedCommentData);
      
      toast.success(res.data.message);
      setText('')
    }
    } catch (error) {
      console.log(error)
      const errorMessage =
      error.response?.data?.message || 'Something went wrong. Please try again.';
    toast.error(errorMessage);
    }
  }

  return (
    <>
      <Dialog open={open}>
        <DialogTitle/>
        <DialogContent className='max-w-5xl p-0 flex flex-col' onInteractOutside={() => {setOpen(false); dispatch(setSelectedPost({}))}} >
          <div className='flex flex-1'>
            <div className='w-1/2'>
              <img
                src={selectedPost?.image}
                alt="post_image"
                className='w-full h-full object-cover rounded-l-lg rounded-sm my-2 aspect-square'
              />
            </div>
            <div className='w-1/2 flex flex-col justify-between'>
              <div className='flex items-center justify-between'>
                <div className='flex gap-3 items-center'>
                  <Link>
                    <Avatar>
                      <AvatarImage src={selectedPost?.author?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                    <span className='text-gray-400 text-sm '>{selectedPost?.author?.bio}</span>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className='cursor-pointer'/>
                  </DialogTrigger>
                  <DialogTitle/>
                  <DialogContent className='flex items-center flex-col text-sm text-center'>
                    <div className='cursor-pointer w-full text-[#f34976] font-bold '>Unfollow</div>
                    <div className='cursor-pointer w-full text-[#f34976] font-bold'>Report</div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr/>
              <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                {
                  comment?.map((c)=><Comment key={c._id} comment={c}/>)
                }
                
              </div>
              <div className='p-4'>
                <div className='flex items-center gap-2'>
                  <input type="text" value={text} onChange={changeEventHandler} placeholder='Add a comment' className='w-full outline-none text-sm border border-gray-400 p-2 rounded' />
                  <Button disabled = {!text.trim()} onClick={commmentHandler} variant='outline' >Send </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CommentDialog