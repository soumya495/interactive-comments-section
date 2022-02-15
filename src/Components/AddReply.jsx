import { ref, update } from 'firebase/database'
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { database } from '../firebase-config'
import { v4 as uuidv4 } from 'uuid'

const AddReply = ({
  comment,
  setIsReply,
  setRepId,
  replyOBJ,
  setReplyAdded,
}) => {
  const { currentUser } = useAuth()
  const [reply, setReply] = useState('')

  function handleReply() {
    const id = uuidv4()
    if (comment.replies) {
      update(ref(database, `/${comment.id}`), {
        replies: {
          ...comment.replies,
          [id]: {
            id: id,
            content: reply,
            createdAt: Date.now(),
            user: {
              uid: currentUser.uid,
              img: currentUser.photoURL,
              username: currentUser.displayName
                .replace(/[^A-Za-z]/g, '')
                .toLowerCase(),
            },
            replyTo: replyOBJ ? replyOBJ.user.username : comment.user.username,
          },
        },
      })
    } else {
      update(ref(database, `/${comment.id}`), {
        replies: {
          [id]: {
            id: id,
            content: reply,
            createdAt: Date.now(),
            user: {
              uid: currentUser.uid,
              img: currentUser.photoURL,
              username: currentUser.displayName
                .replace(/[^A-Za-z]/g, '')
                .toLowerCase(),
            },
            replyTo: comment.user.username,
          },
        },
      })
    }
    setIsReply(false)
    // setRepId('')
    setReplyAdded(true)
  }

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
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder='add a reply'
          style={{ resize: 'none' }}
        />
      </div>
      <div className='comment-btn-wrapper'>
        <button onClick={handleReply}>Reply</button>
      </div>
    </div>
  )
}

export default AddReply
