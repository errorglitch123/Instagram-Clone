import useGetUserProfile from '@/hooks/useGetUserProfile';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  
  const handleTabChange = async (tab)=>{
    setActiveTab(tab);
  };

  const { userProfile } = useSelector(store => store.auth);

  const isLoggedInUserProfile = true;
  const isFollowing = true;

  const displayedPost = activeTab === 'posts'? userProfile?.posts : userProfile?.bookmark
  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-between'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt='profile_img'></AvatarImage>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span className='font-semibold' >{userProfile?.username}</span>
                {
                  !isLoggedInUserProfile ? (
                    <>
                      <Button variant='secondary' className='hover:bg-gray-400 h-8'>Edit Profile</Button>
                      <Button variant='secondary' className='hover:bg-gray-400 h-8'>View archive</Button>
                      <Button variant='secondary' className='hover:bg-gray-400 h-8' >Add tools</Button>
                    </>) : (
                    isFollowing ? (<>
                      <Button variant='secondary' className='h-8'>Unfollow</Button>
                      <Button variant='secondary' className='h-8'>Message</Button>

                    </>)
                      : (
                        <Button className='hover:bg-gray-400 h-8'>Follow</Button>
                      )
                  )

                }
              </div>
              <div className='flex items-center gap-4 justify-between'>
                <p className='font-semibold'>{userProfile?.posts.length} <span>posts</span></p>
                <p className='font-semibold'>{userProfile?.folllwers?.length || 0}  <span>Followers</span></p>
                <p className='font-semibold'>{userProfile?.following?.length} <span>Following</span></p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold text-sm'>{userProfile?.bio || 'Bio here...'}</span>
                <Badge className='w-fit' variant='secondary'><AtSign/><span className='pl-1'>{userProfile?.username}</span></Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab==='posts'? 'font-bold': ''}`} onClick={()=>handleTabChange('posts')}>
              Posts
            </span>
            <span className={`py-3 cursor-pointer ${activeTab==='saved'? 'font-bold': ''}`}onClick={()=>handleTabChange('saved')}>
              Saved
            </span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
          {
            displayedPost?.map((post)=>{
              return (
                <div key={post} className='relative group cursor-pointer'>
                  <img src={post.image} alt="post_img" className='rounded-sm my-2 w-full aspect-square object-cover' />
                  <div className='rounded inset-0 flex items-center justify-center bg-black bg-opacity-50 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='flex items-center text-white space-x-4'>
                      <Button>
                        <Heart/>
                        <span>{post?.likes.length}</span>
                      </Button>

                    </div>

                  </div>
                </div>
              )
            })
          }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile