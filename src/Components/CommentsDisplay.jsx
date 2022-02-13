import { onValue, ref, update } from 'firebase/database'
import React, { useState, useEffect } from 'react'
import { database } from '../firebase-config'
import ScoreCounter from './ScoreCounter'
import { useAuth } from '../context/AuthContext'
import DeleteModal from './DeleteModal'

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
  // comments from db
  const [comments, setComments] = useState([])

  // for editing comments
  const [editComment, setEditComment] = useState('')
  const [editId, setEditId] = useState('')
  const [isEdit, setIsEdit] = useState(false)

  //for deleting comments
  const [delId, setDelId] = useState('')
  const [delModal, setDelModal] = useState(false)

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

  // handle edit
  function handleEdit(comment) {
    if (comment.id === editId || editId === '') {
      setIsEdit((prev) => !prev)
    } else {
      setIsEdit(true)
    }
    setEditId(comment.id)
    setEditComment(comment.content)
  }
  // handle comment update textarea changes
  function handleChange(e) {
    setEditComment(e.target.value)
  }
  // handle update button
  function onUpdate() {
    update(ref(database, `/${editId}`), {
      content: editComment,
    })
    setIsEdit(false)
    setEditComment('')
    setEditId('')
  }

  // handle delete modal
  function handleDelete(comment) {
    if (comment.id === delId || delId === '') {
      setDelModal((prev) => !prev)
    } else {
      setDelModal(true)
    }
    setDelId(comment.id)
  }

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
                      <span className='current-user-badge'>you</span>
                    )}
                  </p>
                  <p className='comment-date'>{timeSince(comment.createdAt)}</p>
                </div>
                <div className='right'>
                  {currentUser && comment.user.uid === currentUser.uid && (
                    <>
                      <p className='edit' onClick={() => handleEdit(comment)}>
                        <img src='../Assets/icon-edit.svg' alt='edit' />
                        Edit
                      </p>
                      <p
                        className='delete'
                        onClick={() => handleDelete(comment)}
                      >
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

              {!(isEdit && comment.id === editId) && (
                <div className='comment-text'>{comment.content}</div>
              )}

              {isEdit && comment.id === editId && (
                <div className='update-comment'>
                  <textarea
                    value={editComment}
                    onChange={(e) => handleChange(e)}
                    placeholder='add a comment'
                    style={{ resize: 'none' }}
                  />
                  <button
                    className={
                      editComment !== comment.content ? '' : 'update-disable'
                    }
                    disabled={editComment === comment.content}
                    onClick={onUpdate}
                  >
                    Update
                  </button>
                </div>
              )}

              {delModal && comment.id === delId && (
                <DeleteModal
                  setDelModal={setDelModal}
                  comment={comment}
                  setDelId={setDelId}
                  setDelModal={setDelModal}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CommentsDisplay
