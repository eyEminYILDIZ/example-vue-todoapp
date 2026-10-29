import type { AxiosPromise } from "axios";

export class ApiService {
	static call = async <T>(request: AxiosPromise, cb: () => void = () => { }): Promise<T> => {
		try {
			const response = await request
			if (response.data.hasError) {
				throw {
					isControlled: true,
					message: response.data.error.message
				}
			}
			return response.data.payload as T
		} catch (err: unknown) {
			return Promise.reject((err as any).message ?? "An error occurred while processing the request");
		} finally {
			cb()
		}
	}
}
