import React from 'react'
import Feed from './feed'
import { Outlet } from 'react-router-dom'
import useGetAllPost from '@/hooks/useGetAllPost.jsx'
import useGetSuggestedUser from '@/hooks/useGetSuggestedUser'
import RightSideBar from './rightSideBar'
const Home = () => {
  useGetAllPost();
  useGetSuggestedUser();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed/>
        <Outlet/>
      </div>
      <RightSideBar/>
    </div>
  )
}

export default Home