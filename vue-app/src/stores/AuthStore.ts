import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ApiDefinition } from '@/apidef/auth-apidef'
import type { ICurrentUser } from '@/types'
import { toErrorMessage, useToastStore } from '@/stores/ToastStore'
const STORAGE_KEY = 'CurrentUser'

export const useAuthStore = defineStore('auth', () => {
  const toastStore = useToastStore()

  const loadCurrentUser = (): ICurrentUser | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as ICurrentUser) : null
    } catch {
      return null
    }
  }

  const currentUser = ref<ICurrentUser | null>(loadCurrentUser())

  const setCurrentUser = (user: ICurrentUser | null) => {
    currentUser.value = user
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const removeCurrentUser = () => {
    localStorage.removeItem(STORAGE_KEY)
    currentUser.value = null
  }

  const isAuthenticated = () => currentUser.value !== null
  const isLoading = ref(false)
  const errorText = ref<string | null>(null)

  ////////////////////////////////////////////////////////////////////

  const login = async(email:string)=>{
    isLoading.value = true
    const request : ApiDefinition.Login.IRequest = {
      email
    }
    try {
      const response = await ApiDefinition.Login.Request(request)
      setCurrentUser({
        id: response.id,
        name: response.name,
        email: response.email,
        department: response.department,
        jwtToken: response.jwtToken
      })
      toastStore.showAfterReload('success', 'Logged in', `Welcome back, ${response.name}.`)
      window.location.href = "/"
    } catch (error) {
      console.error('Login failed', error)
      errorText.value = 'Login failed. Check your email and try again.'
      toastStore.error('Login failed', toErrorMessage(error) ?? errorText.value)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    removeCurrentUser()
    toastStore.showAfterReload('info', 'Logged out', 'You have been signed out.')
    window.location.href = "/"
  }

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    errorText
  }
})
