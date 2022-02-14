import { ref, update } from 'firebase/database'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { database } from '../firebase-config'

// for formatting score count
function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
    : Math.sign(num) * Math.abs(num)
}

// for calc scores from votes
function getScore(votes) {
  if (!votes) return 0
  let score = 0
  for (let vote in votes) {
    score += votes[vote]
  }
  return score
}

function ScoreCounter({ id, votes, rep, reply, comment }) {
  const { currentUser } = useAuth()
  const [dispScore, setDispScore] = useState(votes ? getScore(votes) : 0)
  const [upVote, setUpVote] = useState(
    currentUser && votes ? votes[currentUser.uid] === 1 : false
  )
  const [downVote, setDownVote] = useState(
    currentUser && votes ? votes[currentUser.uid] === -1 : false
  )

  useEffect(() => {
    if (currentUser) {
      setDispScore(getScore(votes))
    }
  }, [upVote, downVote])

  function handleUpVote() {
    if (currentUser) {
      if (!upVote) {
        if (!votes) {
          if (rep) {
            update(ref(database, `/${comment.id}`), {
              replies: {
                ...comment.replies,
                [reply.id]: {
                  ...reply,
                  votes: {
                    [currentUser.uid]: 1,
                  },
                },
              },
            })
          } else {
            update(ref(database, `/${id}`), {
              votes: {
                [currentUser.uid]: 1,
              },
            })
          }
        } else {
          // already votes
          if (rep) {
            update(ref(database, `/${comment.id}`), {
              replies: {
                ...comment.replies,
                [reply.id]: {
                  ...reply,
                  votes: {
                    ...votes,
                    [currentUser.uid]: 1,
                  },
                },
              },
            })
          } else {
            update(ref(database, `/${id}`), {
              votes: {
                ...votes,
                [currentUser.uid]: 1,
              },
            })
          }
        }
      } else {
        // null check
        if (rep) {
          update(ref(database, `/${comment.id}`), {
            replies: {
              ...comment.replies,
              [reply.id]: {
                ...reply,
                votes: {
                  [currentUser.uid]: null,
                },
              },
            },
          })
        } else {
          update(ref(database, `/${id}`), {
            votes: {
              [currentUser.uid]: null,
            },
          })
        }
      }
      setUpVote((prev) => !prev)
      setDownVote(false)
    }
  }
  function handleDownVote() {
    if (currentUser) {
      if (!downVote) {
        if (!votes) {
          if (rep) {
            update(ref(database, `/${comment.id}`), {
              replies: {
                ...comment.replies,
                [reply.id]: {
                  ...reply,
                  votes: {
                    [currentUser.uid]: -1,
                  },
                },
              },
            })
          } else {
            update(ref(database, `/${id}`), {
              votes: {
                [currentUser.uid]: -1,
              },
            })
          }
        } else {
          // already votes
          if (rep) {
            update(ref(database, `/${comment.id}`), {
              replies: {
                ...comment.replies,
                [reply.id]: {
                  ...reply,
                  votes: {
                    ...votes,
                    [currentUser.uid]: -1,
                  },
                },
              },
            })
          } else {
            update(ref(database, `/${id}`), {
              votes: {
                ...votes,
                [currentUser.uid]: -1,
              },
            })
          }
        }
      } else {
        if (rep) {
          update(ref(database, `/${comment.id}`), {
            replies: {
              ...comment.replies,
              [reply.id]: {
                ...reply,
                votes: {
                  [currentUser.uid]: null,
                },
              },
            },
          })
        } else {
          update(ref(database, `/${id}`), {
            votes: {
              [currentUser.uid]: null,
            },
          })
        }
      }
      setDownVote((prev) => !prev)
      setUpVote(false)
    }
  }

  return (
    <div className='score-counter'>
      <button className='score-btn plus' onClick={handleUpVote}>
        <img
          src='../Assets/icon-plus.svg'
          alt='plus'
          className={
            votes && currentUser && votes[currentUser.uid] === 1
              ? 'fill-icon'
              : ''
          }
        />
      </button>
      <p className='score'>{kFormatter(dispScore)}</p>
      <button className='score-btn minus' onClick={handleDownVote}>
        <img
          src='../Assets/icon-minus.svg'
          alt='minus'
          className={
            votes && currentUser && votes[currentUser.uid] === -1
              ? 'fill-icon'
              : ''
          }
        />
      </button>
    </div>
  )
}

export default ScoreCounter
