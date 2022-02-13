import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FaGoogle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { database } from '../firebase-config'
import { set, ref } from 'firebase/database'

function AddComment() {
  const { pending, currentUser, signIn, signUserOut } = useAuth()
  const [comment, setComment] = useState('')

  function handleSubmit() {
    const id = uuidv4()
    set(ref(database, `/${id}`), {
      id: id,
      content: comment,
      createdAt: Date.now(),
      user: {
        img: currentUser.photoURL,
        username: currentUser.displayName
          .replace(/[^A-Za-z]/g, '')
          .toLowerCase(),
        uid: currentUser.uid,
      },
    })
    setComment('')
  }

  if (pending) return <p>Loading ...</p>

  if (!currentUser) {
    return (
      <div className='add-comment-wrapper'>
        <div className='add-comment sign-in-wrapper'>
          <button className='btn sign-in' onClick={signIn}>
            <FaGoogle /> Sign In With Google
          </button>
          <p>Sign in to add comments, reply to comments</p>
        </div>
      </div>
    )
  }

  return (
    <div className='add-comment-wrapper'>
      <div className='add-comment'>
        <img
          src={currentUser.photoURL || '../Assets/profile-img.svg'}
          alt='profile'
          className='profile-photo'
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='add a comment'
          style={{ resize: 'none' }}
        />
        <div className='comment-btn-wrapper'>
          <button onClick={handleSubmit}>Send</button>
          <button onClick={signUserOut}>Sign Out</button>
        </div>
      </div>
    </div>
  )
}

export default AddComment
