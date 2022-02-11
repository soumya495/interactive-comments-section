import { signInWithPopup, signOut } from 'firebase/auth'
import React, { useContext, createContext, useEffect, useState } from 'react'
import { auth, provider } from '../firebase-config'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    })
  }, [])

  // sign in
  function signIn() {
    signInWithPopup(auth, provider).then((result) => {
      setCurrentUser(result.currentUser)
      setPending(false)
      window.location.reload()
    })
  }

  // sign out
  function signUserOut() {
    return signOut(auth)
  }

  const value = {
    pending,
    currentUser,
    signIn,
    signUserOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
