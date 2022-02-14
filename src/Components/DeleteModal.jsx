import { ref, remove, update } from 'firebase/database'
import React from 'react'
import { database } from '../firebase-config'

const DeleteModal = ({ setDelModal, comment, setDelId, rep, reply }) => {
  function removeComment() {
    if (rep) {
      update(ref(database, `/${comment.id}`), {
        replies: {
          ...comment.replies,
          [reply.id]: null,
        },
      })
    } else {
      remove(ref(database, `/${comment.id}`))
    }
    setDelId('')
    setDelModal(false)
  }

  return (
    <div className='delete-modal-wrapper'>
      <div className='del-modal'>
        <h3>Delete Comment</h3>
        <p>
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>
        <div className='del-modal-btn-wrapper'>
          <button className='cancel' onClick={() => setDelModal(false)}>
            No, Cancel
          </button>
          <button className='del' onClick={removeComment}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
