import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { v4 as uuidv4 } from 'uuid'
import ScoreCounter from './ScoreCounter'
import DeleteModal from './DeleteModal'
import AddReply from './AddReply'
import { update, ref } from 'firebase/database'
import { database } from '../firebase-config'

const ReplyDisplay = ({ comment, replies, timeSince, isCommentBox }) => {
  // for editing comments
  const [editComment, setEditComment] = useState('')
  const [editId, setEditId] = useState('')
  const [isEdit, setIsEdit] = useState(false)

  //for deleting comments
  const [delId, setDelId] = useState('')
  const [delModal, setDelModal] = useState(false)

  // for replying
  const [repId, setRepId] = useState('')
  const [isReply, setIsReply] = useState(false)

  const { currentUser } = useAuth()

  // handle edit
  function handleEdit(comment) {
    if (comment.id === editId || editId === '') {
      setIsEdit((prev) => !prev)
    } else {
      setIsEdit(true)
    }
    setEditId(comment.id)
    setEditComment(comment.content)
    setIsReply(false)
    setRepId('')
  }
  // handle comment update textarea changes
  function handleChange(e) {
    setEditComment(e.target.value)
  }
  // handle update button
  function onUpdate() {
    update(ref(database, `/${comment.id}`), {
      replies: {
        ...comment.replies,
        [editId]: {
          ...comment.replies[editId],
          content: editComment,
        },
      },
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

  // handle reply
  function handleReply(comment) {
    if (comment.id === repId || repId === '') {
      setIsReply((prev) => !prev)
    } else {
      setIsReply(true)
    }
    setRepId(comment.id)
    setIsEdit(false)
    setEditId('')
    setEditComment('')
  }

  function getReplies(replies) {
    const repliesArr = Object.values(replies)
    repliesArr.sort((a, b) =>
      a.createdAt > b.createdAt ? 1 : b.createdAt > a.createdAt ? -1 : 0
    )
    return repliesArr.map((reply) => {
      return (
        <>
          <div className='comment' key={reply.id}>
            <ScoreCounter
              key={uuidv4()}
              votes={reply.votes ? reply.votes : null}
              id={comment.id}
              reply={reply}
              rep={true}
              comment={comment}
            />
            <div className='comment-content'>
              <div className='comment-top'>
                <div className='left'>
                  <img
                    src={
                      reply.user.img
                        ? reply.user.img
                        : '../Assets/profile-img.svg'
                    }
                    alt='profile'
                    className='comment-profile-img'
                  />
                  <p className='username'>
                    {reply.user.username}
                    {currentUser && reply.user.uid === currentUser.uid && (
                      <span className='current-user-badge'>you</span>
                    )}
                  </p>
                  <p className='comment-date'>{timeSince(reply.createdAt)}</p>
                </div>
                <div className='right'>
                  {currentUser && reply.user.uid === currentUser.uid && (
                    <>
                      <p className='edit' onClick={() => handleEdit(reply)}>
                        <img src='../Assets/icon-edit.svg' alt='edit' />
                        Edit
                      </p>
                      <p className='delete' onClick={() => handleDelete(reply)}>
                        <img src='../Assets/icon-delete.svg' alt='delete' />
                        Delete
                      </p>
                    </>
                  )}
                  <p className='reply' onClick={() => handleReply(reply)}>
                    <img src='../Assets/icon-reply.svg' alt='reply' />
                    Reply
                  </p>
                </div>
              </div>

              {!(isEdit && reply.id === editId) && (
                <div className='comment-text'>
                  <span className='comment-user'>@{reply.replyTo},</span>{' '}
                  {reply.content}
                </div>
              )}

              {isEdit && reply.id === editId && (
                <div className='update-comment'>
                  <textarea
                    value={editComment}
                    onChange={(e) => handleChange(e)}
                    placeholder='edit your comment'
                    style={{ resize: 'none' }}
                  />
                  <button
                    className={
                      editComment !== reply.content && editComment !== ''
                        ? ''
                        : 'update-disable'
                    }
                    disabled={editComment === reply.content}
                    onClick={onUpdate}
                  >
                    Update
                  </button>
                </div>
              )}

              {delModal && reply.id === delId && (
                <DeleteModal
                  key={uuidv4()}
                  comment={comment}
                  reply={reply}
                  rep={true}
                  setDelId={setDelId}
                  setDelModal={setDelModal}
                />
              )}
            </div>
          </div>
          {currentUser && isReply && reply.id === repId && (
            <AddReply
              key={uuidv4()}
              comment={comment}
              setRepId={setRepId}
              setIsReply={setIsReply}
              replyOBJ={reply}
            />
          )}
        </>
      )
    })
  }

  return <div className='reply-container'>{getReplies(replies)}</div>
}

export default ReplyDisplay
