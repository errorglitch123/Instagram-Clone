import React from 'react'
import Post from './post'
import { useSelector } from 'react-redux'
import store from '@/redux/store.js'
const posts = () => {
  const {posts} = useSelector(store=>store.post)
  return (
    <div>{
      posts.map((post)=> <Post key={post._id} post={post}/>)
    }
    </div>
  )
}

export default posts