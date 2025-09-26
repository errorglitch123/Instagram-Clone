import React, { useState } from 'react'
import Home from './Home'
import { Heart, HomeIcon, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser, setUserProfile } from '@/redux/authSlice'
import CreatePost from './createPost.jsx'
import { setPosts } from '@/redux/postSilce'

const LeftSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);

  const logOutHandler = async (req, res) => {
    try {
      const res = await axios.get('http://localhost:8281/api/v1/user/logout', { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setAuthUser(null));
        dispatch(setPosts([]));
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const sideBarHandler = (textType) => {
    if (textType === 'Logout') logOutHandler()
    else if (textType === 'Create') setOpen(true)
    else if (textType === 'Profile') {
      navigate(`/profile/${user._id}`)
    }

  }
  const sidebarItems = [
    { icon: <HomeIcon />, text: 'Home' },
    { icon: <Search />, text: 'Search' },
    { icon: <TrendingUp />, text: 'Explore' },
    { icon: <MessageCircle />, text: 'Message' },
    { icon: <Heart />, text: 'Notification' },
    { icon: <PlusSquare />, text: 'Create' },
    {
      icon: (
        <Avatar className='w-6 h-6'>
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile"
    },
    { icon: <LogOut />, text: 'Logout' },

  ]
  return (
    <div className='fixed top-0 z-10 left-0  border-r border-gray-300 w-[16%] h-screen'>
      <div className='flex flex-col'>
        <h1 className=" text-4xl font-sans">Instagram</h1>
        <div>
          {
            sidebarItems.map((items, index) => {
              return (
                <div onClick={() => sideBarHandler(items.text)} key={index} className='flex items-center gap-4 relative hover:bg-gray-50 cursor-pointer rounded-lg p-3 my-3'>
                  {items.icon}
                  <span >{items.text}</span>
                </div>
              )
            })
          }
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  )
}

export default LeftSideBar