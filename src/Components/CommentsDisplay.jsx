import { onValue, ref } from 'firebase/database'
import React, { useState, useEffect } from 'react'
import { database } from '../firebase-config'

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
            <p>{comment.score}</p>
            <img src={comment.user.img} alt='' />
            <p>{comment.user.username}</p>
            <p>{timeSince(comment.createdAt)}</p>
            <p>{comment.content}</p>
          </div>
        )
      })}
    </div>
  )
}

export default CommentsDisplay
