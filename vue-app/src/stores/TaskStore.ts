import { ApiDefinition } from '@/apidef/auth-apidef'
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

  const approveModalOpen = ref(false)
  const openApproveModal = () => {
    approveModalOpen.value = true
  }
  const closeApproveModal = () => {
    approveModalOpen.value = false
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
    openApproveModal,
    closeApproveModal,
    openRejectModal,
    closeRejectModal,
    openCreateModal,
    closeCreateModal,
    resetLoading,
    editModalOpen,
    deleteModalOpen,
    approveModalOpen,
    rejectModalOpen,
    createModalOpen,
    AllTasks,
    listLoading,
    detailLoading,
    MyTasks,
    PendingTasks,
    PlayableTask
  }
})
