export interface AnyObject {
  [key: string]: any
}

export type Data = string | AnyObject | ArrayBuffer
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'HEAD' | 'OPTIONS' | 'TRACE'
export type DataType = 'json' | 'text' | 'html'
export type ResponseType = 'text' | 'arraybuffer'

export interface AjaxRequestConfig {
  baseURL?: string
  url?: string
  data?: Data
  params?: AnyObject
  header?: any
  method?: Method
  timeout?: number
  dataType?: DataType
  responseType?: ResponseType
  sslVerify?: boolean
  withCredentials?: boolean
  firstIpv4?: boolean
  xhr?: (requestTask: AjaxRequestTask, config: AjaxRequestConfig) => void
  validateStatus?: ((statusCode?: number) => boolean) | null
}

export interface AjaxCallbackConfig<T = any> extends AjaxRequestConfig {
  success?: (result: T) => void
  fail?: (result: any) => void
  complete?: (result: any) => void
}

export interface AjaxResponse<T = any> {
  data: T
  statusCode: number
  header: any
  config: AjaxRequestConfig
  errMsg: string
  cookies: string[]
}

export interface AjaxInterceptorManager<T> {
  use(onFulfilled?: (value: T) => T | Promise<T>, onRejected?: (error: any) => any): void
}

export interface AjaxRequestTask<T = void> {
  abort(): T
  onHeadersReceived(callback: (result: any) => void): T
  offHeadersReceived(callback: (result: any) => void): T
}

export interface AjaxPromise<T = any> extends Promise<T>, AjaxRequestTask<AjaxPromise<T>> {}

export interface AjaxExecutor {
  <T = any, R = AjaxResponse<T>>(config?: AjaxRequestConfig): AjaxPromise<R>
  <T = any, R = AjaxResponse<T>>(config?: AjaxCallbackConfig<R>): Promise<AjaxRequestTask>
  <T = any, R = AjaxResponse<T>>(
    url?: string,
    data?: Data,
    config?: AjaxRequestConfig
  ): AjaxPromise<R>
}

export interface AjaxInstance extends AjaxExecutor {
  readonly baseURL: string
  readonly origin: string
  get: AjaxExecutor
  post: AjaxExecutor
  put: AjaxExecutor
  delete: AjaxExecutor
  connect: AjaxExecutor
  head: AjaxExecutor
  options: AjaxExecutor
  trace: AjaxExecutor
  config(iterable: (config: AjaxRequestConfig) => AjaxRequestConfig): void
  interceptors: {
    request: AjaxInterceptorManager<AjaxRequestConfig>
    response: AjaxInterceptorManager<AjaxResponse>
  }
}

export interface AjaxStatic extends AjaxInstance {
  create(config?: AjaxRequestConfig): AjaxInstance
}

declare const Ajax: AjaxStatic

export default Ajax
