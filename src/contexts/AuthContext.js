import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('Initial session:', session)
        if (error) {
          console.error('Session error:', error)
        }
        setUser(session?.user ?? null)
      } catch (err) {
        console.error('Auth initialization error:', err)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, userData) => {
    try {
      console.log('Signing up user:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      console.log('Signup result:', { data, error })
      return { data, error }
    } catch (err) {
      console.error('Signup error:', err)
      return { data: null, error: err }
    }
  }

  const signIn = async (email, password) => {
    try {
      console.log('Signing in user:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log('Signin result:', { data, error })
      return { data, error }
    } catch (err) {
      console.error('Signin error:', err)
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user')
      const { error } = await supabase.auth.signOut()
      console.log('Signout result:', { error })
      return { error }
    } catch (err) {
      console.error('Signout error:', err)
      return { error: err }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
