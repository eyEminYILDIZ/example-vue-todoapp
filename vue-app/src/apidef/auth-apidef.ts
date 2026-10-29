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
    export const Method = "GET"
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
    export const Method = "GET"
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
    export const Method = "GET"
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
    export const Method = "GET"
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
    export const Method = "GET"
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
    export const Method = "GET"
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
    export const Method = "GET"
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
    export const Method = "POST"
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
    export const Method = "PUT"
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
    export const Method = "DELETE"
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
    export const Method = "GET"
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
    export const Method = "GET"
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
