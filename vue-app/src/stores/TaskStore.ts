import { ApiDefinition } from '@/apidef/auth-apidef'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTaskStore = defineStore('task', () => {

  const AllTasks = ref<ApiDefinition.GetAllTasks.IResponse>([])
  const MyTasks = ref<ApiDefinition.GetMyTasks.IResponse>([])
  const PendingTasks = ref<ApiDefinition.GetPendingTasks.IResponse>([])
  const isLoading = ref(false)

  ////////////////////////////////////////////////////////////////////

  const loadAllTasks = async()=>{
    const request : ApiDefinition.GetAllTasks.IRequest = {
      empty: "true"
    }
    isLoading.value = true
    try {
      AllTasks.value = await ApiDefinition.GetAllTasks.Request(request)
    } catch (error) {
      console.error('Failed to load all tasks', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const loadMyTasks = async()=>{
    const request : ApiDefinition.GetMyTasks.IRequest = {
      empty: "true"
    }
    isLoading.value = true
    try {
      MyTasks.value = await ApiDefinition.GetMyTasks.Request(request)
    } catch (error) {
      console.error('Failed to load my tasks', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const loadPendingTasks = async()=>{
    const request : ApiDefinition.GetPendingTasks.IRequest = {
      empty: "true"
    }
    isLoading.value = true
    try {
      PendingTasks.value = await ApiDefinition.GetPendingTasks.Request(request)
    } catch (error) {
      console.error('Failed to load pending tasks', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    loadAllTasks,
    loadMyTasks,
    loadPendingTasks,
    AllTasks,
    isLoading,
    MyTasks,
    PendingTasks
  }
})
