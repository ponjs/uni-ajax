export interface AnyObject {
  [x: string]: any
}

export type Data = string | AnyObject | ArrayBuffer
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'HEAD' | 'OPTIONS' | 'TRACE'
export type DataType = 'json' | 'text' | 'html'
export type ResponseType = 'text' | 'arraybuffer'
export type Callback<T = any> = (result: T) => void

export interface Request<T> extends Promise<T>, AjaxRequestTask<Request<T>> {}

export interface RequestConstructor extends PromiseConstructor {
  readonly prototype: Request<any>
  new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Request<T>
  task: AjaxRequestTask | null
  aborted: boolean
  onHeadersReceivedCallback: Callback | null
  offHeadersReceivedCallback: Callback | null
  onHeadersReceived(callback: Callback): void
  offHeadersReceived(callback: Callback): void
}

export interface AjaxRequestTask<T = void> {
  abort(): T
  onHeadersReceived(callback: Callback): T
  offHeadersReceived(callback: Callback): T
}

export interface AjaxRequestConfig {
  baseURL?: string
  url?: string
  data?: Data
  query?: AnyObject
  params?: AnyObject
  header?: any
  method?: Method
  timeout?: number
  dataType?: DataType
  responseType?: ResponseType
  sslVerify?: boolean
  withCredentials?: boolean
  firstIpv4?: boolean
  xhr?: (task: AjaxRequestTask, config: AjaxRequestConfig) => void
  validateStatus?: ((statusCode?: number) => boolean) | null
  adapter?: (config: AjaxRequestConfig, Request: RequestConstructor) => Promise<any>
}

export type AjaxConfigType =
  | AjaxRequestConfig
  | (() => AjaxRequestConfig)
  | (() => Promise<AjaxRequestConfig>)
  | undefined

export interface AjaxCallbackConfig<T = any> extends AjaxRequestConfig {
  success?: Callback<T>
  fail?: Callback
  complete?: Callback
}

export interface AjaxResponse<T = any> {
  data: T
  statusCode: number
  header: any
  config: AjaxRequestConfig
  errMsg: string
  cookies: string[]
}

export interface AjaxInterceptorManager<V> {
  use<T = V>(onFulfilled?: (value: V) => T | Promise<T>, onRejected?: (error: any) => any): number
  eject(id: number): void
}

export interface AjaxInvoke {
  <T = any, R = AjaxResponse<T>>(config?: AjaxRequestConfig): Request<R>
  <T = any, R = AjaxResponse<T>>(config?: AjaxCallbackConfig<R>): Request<void>
  <T = any, R = AjaxResponse<T>>(url?: string, data?: Data, config?: AjaxRequestConfig): Request<R>
}

export interface AjaxInstance<T extends AjaxConfigType> extends AjaxInvoke {
  get: AjaxInvoke
  post: AjaxInvoke
  put: AjaxInvoke
  delete: AjaxInvoke
  connect: AjaxInvoke
  head: AjaxInvoke
  options: AjaxInvoke
  trace: AjaxInvoke
  getURL(config?: AjaxConfigType): Promise<string>
  readonly defaults: AjaxRequestConfig
  readonly config: T
  interceptors: {
    request: AjaxInterceptorManager<AjaxRequestConfig>
    response: AjaxInterceptorManager<AjaxResponse>
  }
}

export interface AjaxStatic extends AjaxInstance<undefined> {
  create<T extends AjaxConfigType = undefined>(config?: T): AjaxInstance<T>
}

declare const Ajax: AjaxStatic

export default Ajax
