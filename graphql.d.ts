//declare module 'graphql.js' {

import { DocumentNode, FormattedExecutionResult, GraphQLError, GraphQLFormattedError } from 'graphql'

export type FragmentOptions = {
  [key: string]: string | FragmentOptions
}

export type HttpRequest = (options: {
  method: 'POST' | 'GET'
  url: string
  contentType?: string
  accept?: string
  headers?: Record<string, string>
  data: any
}) => Promise<{
  data?: any
  status: number
  statusText: string
  headers: Record<string, string>
}>

export type GraphqlRequest<A extends Record<string, any> = Record<string, any>, R = any> = {
  (args?: A): Promise<R>
  merge(name: string, args?: A): Promise<R>
}

export type GraphqlClientOptions = {
  method?: 'POST' | 'GET'
  asJSON?: boolean
  alwaysAutodeclare?: boolean
  headers?: Record<string, string | (() => string)>
  fragments?: FragmentOptions
  //   /**
  //    * http调用程序，如果不传递则默认会使用axios
  //    */
  //   request?: HttpRequest

  debug?: boolean
  /**
   * 当请求发生异常时
   */
  onRequestError?: (error: any, status?: number) => void
  /**
   * 当请求Graphql遇到错误时
   */
  onGraphqlError?: (errors: GraphQLFormattedError[]) => void
}

export type GraphqlClient = {
  <A extends Record<string, any> = Record<string, any>, R = any>(gql: string | DocumentNode, variables: A): Promise<R>
  <A extends Record<string, any> = Record<string, any>, R = any>(gql: string | DocumentNode): (
    variables: A
  ) => Promise<R>

  getUrl(): string
  setUrl(url: string): void

  getOptions(): GraphqlClientOptions
  headers(headers: Record<string, string | (() => string)>): void
  query<A extends Record<string, any> = Record<string, any>, R = any>(
    gql: string | DocumentNode
  ): GraphqlRequest<A, R>
  query<A extends Record<string, any> = Record<string, any>, R = any>(
    gql: TemplateStringsArray,
    ...items: any[]
  ): GraphqlRequest<A, R>
  mutate<A extends Record<string, any> = Record<string, any>, R = any>(gql: string): (args?: A) => Promise<R>
  mutate<A extends Record<string, any> = Record<string, any>, R = any>(
    gql: TemplateStringsArray,
    ...items: any[]
  ): GraphqlRequest<A, R>
  fragment(name: string): string
  fragment(options: FragmentOptions): void
  fragments(): Record<string, string>
  commit<R1, R2, R3 = {}, R4 = {}, R5 = {}>(name: string): Promise<R1 & R2 & R3 & R4 & R5>
}

export type GraphqlClientFactory = (url: string, config?: GraphqlClientOptions) => GraphqlClient
declare const graphqlFactory: GraphqlClientFactory
export default graphqlFactory

//}
