import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataUrl } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store.js';
import { setPosts } from '@/redux/postSilce';
import { setAuthUser } from '@/redux/authSlice';


const createPost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imgPrev, setImgPrev] = useState('');
  const [loading, setloading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const {posts} = useSelector(store=>store.post)
  const dispatch = useDispatch();


  const createPostHandler = async (e) => {
    console.log('i am here')
    const formData = new FormData();
    formData.append('caption',caption );
    if(imgPrev) formData.append('image',file);
    try {
      setloading(true)
      const res = await axios.post('http://localhost:8281/api/v1/post/addpost',formData,{
        headers:{
          "Content-Type":'multipart/form-data',
        },
        withCredentials:true
      });
      if(res.data.success){
        dispatch(setPosts([res.data.post,...posts]))
        toast.success(res.data.message);
        setOpen(false);
      }

    } catch (error) {
      toast.error(error.response.data.message);
    }
    finally{
      console.log('over')
      setloading(false);
    }
  }
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataUrl(file);
      setImgPrev(dataUrl)
    }
  }
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogTitle></DialogTitle>
        <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src='' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='font-semibold text-xs'>Bio here...</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e)=>setCaption(e.target.value)} className='focus-visible:ring-transparent border-none' placeholder='wrtie a caption'></Textarea>
        {
          imgPrev && (
            <div className='w-full h-64 flex items-center justify-between'>
              <img src={imgPrev} alt="preview_img" className='object-cover h-full w-full' />
            </div>
          )
        }
        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
        <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'>Select from Your device</Button>
        {
          imgPrev && (
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait
              </Button>
            ) : (
              <Button onClick={createPostHandler} type='submit'>Post</Button>
            )
          )
        }
        
      </DialogContent>
    </Dialog>
  )
}

export default createPost