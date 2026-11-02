import { ApiDefinition } from '@/apidef/auth-apidef'
import type { ITaskDetail } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTaskStore = defineStore('task', () => {

  const AllTasks = ref<ApiDefinition.GetAllTasks.IResponse>([])
  const MyTasks = ref<ApiDefinition.GetMyTasks.IResponse>([])
  const PendingTasks = ref<ApiDefinition.GetPendingTasks.IResponse>([])
  const listLoading = ref(false)
  const detailLoading = ref(false)
  const resetLoading = ref(false)

  const PlayableTask = ref<ApiDefinition.GetTask.IResponse | null>(null)

const createModalOpen = ref(false)
  const openCreateModal = () => {
    createModalOpen.value = true
  }
  const closeCreateModal = () => {
    createModalOpen.value = false
  }

  const detailModalOpen = ref(false)
  const openDetailModal = () => {
    detailModalOpen.value = true
  }
  const closeDetailModal = () => {
    detailModalOpen.value = false
  }

  const editModalOpen = ref(false)
  const openEditModal = () => {
    editModalOpen.value = true
  }
  const closeEditModal = () => {
    editModalOpen.value = false
  }


  const deleteModalOpen = ref(false)
  const openDeleteModal = () => {
    deleteModalOpen.value = true
  }
  const closeDeleteModal = () => {
    deleteModalOpen.value = false
  }

  const completeModalOpen = ref(false)
  const openCompleteModal = () => {
    completeModalOpen.value = true
  }
  const closeCompleteModal = () => {
    completeModalOpen.value = false
  }

  const rejectModalOpen = ref(false)
  const openRejectModal = () => {
    rejectModalOpen.value = true
  }
  const closeRejectModal = () => {
    rejectModalOpen.value = false
  }
  ////////////////////////////////////////////////////////////////////

  const resetAPI = async()=>{
    const request : ApiDefinition.ResetData.IRequest = {
      empty: "true"
    }
    resetLoading.value = true
    try {
      await ApiDefinition.ResetData.Request(request)
      window.location.reload()
    } catch (error) {
      console.error('Failed to reset data', error)
      throw error
    } finally {
      resetLoading.value = false
    }
  }


  const loadAllTasks = async()=>{
    const request : ApiDefinition.GetAllTasks.IRequest = {
      empty: "true"
    }
    listLoading.value = true
    try {
      AllTasks.value = await ApiDefinition.GetAllTasks.Request(request)
    } catch (error) {
      console.error('Failed to load all tasks', error)
      throw error
    } finally {
      listLoading.value = false
    }
  }

  const loadMyTasks = async()=>{
    const request : ApiDefinition.GetMyTasks.IRequest = {
      empty: "true"
    }
    listLoading.value = true
    try {
      MyTasks.value = await ApiDefinition.GetMyTasks.Request(request)
    } catch (error) {
      console.error('Failed to load my tasks', error)
      throw error
    } finally {
      listLoading.value = false
    }
  }

  const loadPendingTasks = async()=>{
    const request : ApiDefinition.GetPendingTasks.IRequest = {
      empty: "true"
    }
    listLoading.value = true
    try {
      PendingTasks.value = await ApiDefinition.GetPendingTasks.Request(request)
    } catch (error) {
      console.error('Failed to load pending tasks', error)
      throw error
    } finally {
      listLoading.value = false
    }
  }

  const loadTask = async(taskId: number)=>{
    const request : ApiDefinition.GetTask.IRequest = {
       taskId
    }
    detailLoading.value = true
    try {
      PlayableTask.value = await ApiDefinition.GetTask.Request(request)
    } catch (error) {
      console.error('Failed to load playable task', error)
      throw error
    } finally {
      detailLoading.value = false
    }
  }

  const deleteTask = async(taskId: number)=>{
    const request : ApiDefinition.DeleteTask.IRequest = {
      taskId
    }
    detailLoading.value = true
    try {
      await ApiDefinition.DeleteTask.Request(request)

      await loadMyTasks()
    } catch (error) {
      console.error('Failed to delete task', error)
      throw error
    } finally {
      detailLoading.value = false
      closeDeleteModal()
    }
  }

  const completeTask = async(taskId: number)=>{
    const request : ApiDefinition.CompleteTask.IRequest = {
      taskId
    }
    detailLoading.value = true
    try {
      await ApiDefinition.CompleteTask.Request(request)

      await loadPendingTasks()
    } catch (error) {
      console.error('Failed to complete task', error)
      throw error
    } finally {
      detailLoading.value = false
      closeCompleteModal()
    }
  }

  const rejectTask = async(taskId: number)=>{
    const request : ApiDefinition.RejectTask.IRequest = {
      taskId
    }
    detailLoading.value = true
    try {
      await ApiDefinition.RejectTask.Request(request)

      await loadPendingTasks()
    } catch (error) {
      console.error('Failed to reject task', error)
      throw error
    } finally {
      detailLoading.value = false
      closeRejectModal()
    }
  }

  const createTask = async(taskData: ApiDefinition.CreateTask.IRequest)=>{
    const request : ApiDefinition.CreateTask.IRequest = taskData
    detailLoading.value = true
    try {
      await ApiDefinition.CreateTask.Request(request)

      await loadMyTasks()
    } catch (error) {
      console.error('Failed to create task', error)
      throw error
    } finally {
      detailLoading.value = false
      closeCreateModal()
    }
  }

  const editTask = async(taskData: ITaskDetail)=>{
    const request : ApiDefinition.UpdateTask.IRequest = {
      taskId: taskData.id,
      title: taskData.title,
      description: taskData.description,
    }
    detailLoading.value = true
    try {
      await ApiDefinition.UpdateTask.Request(request)

      await loadMyTasks()
    } catch (error) {
      console.error('Failed to update task', error)
      throw error
    } finally {
      detailLoading.value = false
      closeEditModal()
    }
  }

  return {
    resetAPI,
    loadAllTasks,
    loadMyTasks,
    loadPendingTasks,
    loadTask,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openCompleteModal,
    closeCompleteModal,
    openRejectModal,
    closeRejectModal,
    openCreateModal,
    closeCreateModal,
    deleteTask,
    completeTask,
    rejectTask,
    openDetailModal,
    closeDetailModal,
    createTask,
    editTask,
    resetLoading,
    editModalOpen,
    deleteModalOpen,
    completeModalOpen,
    rejectModalOpen,
    detailModalOpen,
    createModalOpen,
    AllTasks,
    listLoading,
    detailLoading,
    MyTasks,
    PendingTasks,
    PlayableTask
  }
})
