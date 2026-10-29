import { ApiDefinition } from '@/apidef/auth-apidef'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTaskStore = defineStore('task', () => {

  const AllTasks = ref<ApiDefinition.GetAllTasks.IResponse>([])
  const isLoading = ref(false)

  ////////////////////////////////////////////////////////////////////

  const loadAllTasks = async()=>{
    const request : ApiDefinition.GetAllTasks.IRequest = {
      empty: "true"
    }
    isLoading.value = true
    try {
      const response = await ApiDefinition.GetAllTasks.Request(request)
      AllTasks.value = response
    } catch (error) {
      console.error('Login failed', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    loadAllTasks,
    AllTasks,
    isLoading
  }
})
