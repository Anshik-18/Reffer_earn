'use client'

import { Provider, useDispatch } from 'react-redux'
import { store } from '@/lib/store'
import { useEffect } from 'react'
import { setUser } from '../store/slice'
import { setAuthToken } from '@/lib/api'

function ReduxInit() {
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (token && storedUser) {
        const userData = JSON.parse(storedUser)
        setAuthToken(token)
        dispatch(setUser({ ...userData, token }))
        console.log('Redux rehydrated:', userData)
      }
    } catch (err) {
      console.error('Error rehydrating Redux:', err)
    }
  }, [dispatch])

  return null
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReduxInit />
      {children}
    </Provider>
  )
}
