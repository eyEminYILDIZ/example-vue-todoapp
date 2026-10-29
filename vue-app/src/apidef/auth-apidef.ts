import { AxiosClient } from "@/apidef/axios_setup"
import { ApiService } from "./ApiService";

export namespace ApiDefinition {
  export interface ICommonResponseModel  {
    code: string,
    payload: string
  }

  export namespace Login {
    export const Path = "/auth/login"
    export const Request = (data: IRequest) => ApiService.call<IResponse>(AxiosClient.post(Path, { ...data }));
    export interface IRequest {
      email: string
    }

    export interface IResponse {
     id:number,
     name: string,
     email: string,
     department: number,
     jwtToken: string
    }
  }

  export namespace AllUsers {
    export const Path = "/auth/all-users"
    export const Request = (_data?: IRequest) => ApiService.call<IResponse>(AxiosClient.get(Path));
    export interface IRequest {
      empty: string
    }
    export type IResponse = {
      id: number
      name: string
      title: string
      email: string
      department: number
    }[]
  }


  export namespace Me {
    export const Path = "/auth/me"
    export const Request = (_data?: IRequest) => ApiService.call<IResponse>(AxiosClient.get(Path));
    export interface IRequest {
      empty: string
    }
    export interface IResponse {
      id: number
      name: string
      title: string
      email: string
      department: number
    }
  }

  export namespace GetAllTasks {
    export const Path = "/task"
    export const Request = (_data?: IRequest) => ApiService.call<IResponse>(AxiosClient.get(Path));
    export interface IRequest {
      empty: string
    }
    export type IResponse = {
      id: number
      title: string
      description: string
      status: number
      assignedDepartment: number
      user: {
        id: number
        name: string
      }
    }[]
  }

  export namespace ResetData {
    export const Path = "/task/reset-data"
    export const Request = (_data?: IRequest) => ApiService.call<IResponse>(AxiosClient.get(Path));
    export interface IRequest {
      empty: string
    }
    export type IResponse = {
      id: number
      title: string
      description: string
      status: number
      assignedDepartment: number
      user: {
        id: number
        name: string
      }
    }[]
  }

  export namespace GetMyTasks {
    export const Path = "/task/my-tasks"
    export const Request = (_data?: IRequest) => ApiService.call<IResponse>(AxiosClient.get(Path));
    export interface IRequest {
      empty: string
    }
    export type IResponse = {
      id: number
      title: string
      description: string
      status: number
      assignedDepartment: number
      user: {
        id: number
        name: string
      }
    }[]
  }

  export namespace GetPendingTasks {
    export const Path = "/task/pendings"
    export const Request = (_data?: IRequest) => ApiService.call<IResponse>(AxiosClient.get(Path));
    export interface IRequest {
      empty: string
    }
    export type IResponse = {
      id: number
      title: string
      description: string
      status: number
      assignedDepartment: number
      user: {
        id: number
        name: string
      }
    }[]
  }

  export namespace GetTask {
    export const Path = (taskId: number) => `/task/${taskId}`
    export const Request = (data: IRequest) => ApiService.call<IResponse>(AxiosClient.get(Path(data.taskId)));
    export interface IRequest {
      taskId: number
    }
    export interface IResponse {
      id: number
      title: string
      description: string
      status: number
      assignedDepartment: number
      user: {
        id: number
        name: string
      }
    }
  }

  export namespace CreateTask {
    export const Path = "/task"
    export const Request = (data: IRequest) => ApiService.call<IResponse>(AxiosClient.post(Path, { ...data }));
    export interface IRequest {
      title: string
      description: string
      assignedDepartment: number
    }
    export interface IResponse {
      id: number
      title: string
      description: string
      status: number
      assignedDepartment: number
      user: {
        id: number
        name: string
      }
    }
  }

  export namespace UpdateTask {
    export const Path = (taskId: number) => `/task/${taskId}`
    export const Request = ({ taskId, ...body }: IRequest) => ApiService.call<IResponse>(AxiosClient.put(Path(taskId), body));
    export interface IRequest {
      taskId: number
      title: string
      description: string
    }
    export interface IResponse {
      id: number
      title: string
      description: string
      status: number
      assignedDepartment: number
      user: {
        id: number
        name: string
      }
    }
  }

  export namespace DeleteTask {
    export const Path = (taskId: number) => `/task/${taskId}`
    export const Request = (data: IRequest) => ApiService.call<IResponse>(AxiosClient.delete(Path(data.taskId)));
    export interface IRequest {
      taskId: number
    }
    export interface IResponse {
      id: number
      title: string
      description: string
      status: number
      assignedDepartment: number
      user: {
        id: number
        name: string
      }
    }
  }

  export namespace CompleteTask {
    export const Path = (taskId: number) => `/task/complete/${taskId}`
    export const Request = (data: IRequest) => ApiService.call<IResponse>(AxiosClient.get(Path(data.taskId)));
    export interface IRequest {
      taskId: number
    }
    export interface IResponse {
      id: number
      title: string
      description: string
      status: number
      assignedDepartment: number
      user: {
        id: number
        name: string
      }
    }
  }

  export namespace RejectTask {
    export const Path = (taskId: number) => `/task/reject/${taskId}`
    export const Request = (data: IRequest) => ApiService.call<IResponse>(AxiosClient.get(Path(data.taskId)));
    export interface IRequest {
      taskId: number
    }
    export interface IResponse {
      id: number
      title: string
      description: string
      status: number
      assignedDepartment: number
      user: {
        id: number
        name: string
      }
    }
  }
}
