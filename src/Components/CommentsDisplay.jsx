import { onValue, ref } from 'firebase/database'
import React, { useState, useEffect } from 'react'
import { database } from '../firebase-config'
import ScoreCounter from './ScoreCounter'
import { useAuth } from '../context/AuthContext'

function timeSince(date) {
  let seconds = Math.floor((new Date() - date) / 1000)

  let interval = seconds / 31536000

  if (interval > 1) {
    return (
      Math.floor(interval) +
      `${Math.floor(interval) === 1 ? ' year' : ' years'} ago`
    )
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return (
      Math.floor(interval) +
      `${Math.floor(interval) === 1 ? ' month' : ' months'} ago`
    )
  }
  interval = seconds / 86400
  if (interval > 1) {
    return (
      Math.floor(interval) +
      `${Math.floor(interval) === 1 ? ' day' : ' days'} ago`
    )
  }
  interval = seconds / 3600
  if (interval > 1) {
    return (
      Math.floor(interval) +
      `${Math.floor(interval) === 1 ? ' hour' : ' hours'} ago`
    )
  }
  interval = seconds / 60
  if (interval > 1) {
    return (
      Math.floor(interval) +
      `${Math.floor(interval) === 1 ? ' minute' : ' minutes'} ago`
    )
  }
  return (
    Math.floor(seconds) +
    `${Math.floor(seconds) <= 1 ? ' second' : ' seconds'} ago`
  )
}

const CommentsDisplay = () => {
  const [comments, setComments] = useState([])
  const { currentUser } = useAuth()

  useEffect(() => {
    onValue(ref(database), (snapshot) => {
      setComments([])
      const data = snapshot.val()
      if (data) {
        Object.values(data).map((comment) => {
          setComments((oldComments) => [...oldComments, comment])
        })
      }
    })
  }, [])

  if (!comments) return <p>No Comments Yet!</p>

  return (
    <div className='comments-container'>
      {comments.map((comment) => {
        return (
          <div className='comment' key={comment.id}>
            <ScoreCounter
              votes={comment.votes ? comment.votes : null}
              id={comment.id}
            />
            <div className='comment-content'>
              <div className='comment-top'>
                <div className='left'>
                  <img
                    src={comment.user.img}
                    alt='profile'
                    className='comment-profile-img'
                  />
                  <p className='username'>
                    {comment.user.username}
                    {currentUser && comment.user.uid === currentUser.uid && (
                      <p className='current-user-badge'>you</p>
                    )}
                  </p>
                  <p className='comment-date'>{timeSince(comment.createdAt)}</p>
                </div>
                <div className='right'>
                  {currentUser && comment.user.uid === currentUser.uid && (
                    <>
                      <p className='edit'>
                        <img src='../Assets/icon-edit.svg' alt='edit' />
                        Edit
                      </p>
                      <p className='delete'>
                        <img src='../Assets/icon-delete.svg' alt='delete' />
                        Delete
                      </p>
                    </>
                  )}
                  <p className='reply'>
                    <img src='../Assets/icon-reply.svg' alt='reply' />
                    Reply
                  </p>
                </div>
              </div>
              <div className='comment-text'>{comment.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CommentsDisplay
