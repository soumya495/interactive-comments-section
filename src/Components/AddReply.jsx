import React from 'react'
import { useAuth } from '../context/AuthContext'

const AddReply = ({ comment }) => {
  const { currentUser } = useAuth()

  return (
    <div className='add-reply'>
      <img
        src={currentUser.photoURL || '../Assets/profile-img.svg'}
        alt='profile'
        className='profile-photo'
      />
      <div className='textarea-wrapper'>
        <p className='replying-to'>
          Replying to <span>{comment.user.username}</span>
        </p>
        <textarea
          // value={comment}
          // onChange={(e) => setComment(e.target.value)}
          placeholder='add a reply'
          style={{ resize: 'none' }}
        />
      </div>
      <div className='comment-btn-wrapper'>
        <button>Reply</button>
      </div>
    </div>
  )
}

export default AddReply
