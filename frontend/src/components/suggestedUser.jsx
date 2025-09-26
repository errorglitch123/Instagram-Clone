
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { setUserProfile } from '@/redux/authSlice'

const SuggestedUser = () => {
  const { suggestedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();


  return (
    <div className="my-10">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See all</span>
      </div>
      {suggestedUser.map((user) => (
        <div key={user._id} className="flex items-center justify-between gap-5 my-5">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${user._id}`}>
              <Avatar>
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link to={`/profile/${user._id}`}>
                <h1
                  className="font-semibold text-sm"
                  onClick={() => useGetUserProfile(user._id)} // Use the function returned by the hook
                >
                  {user?.username}
                </h1>
              </Link>
              <span className="text-gray-600 text-sm">{user?.bio || 'Bio here'}</span>
            </div>
          </div>
          <span className="text-[#3BADF8] text-sm font-bold cursor-pointer hover:text-[#61a2f1f1]">
            Follow
          </span>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUser;