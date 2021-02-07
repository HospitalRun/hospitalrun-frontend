import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { ReactQueryConfigProvider, QueryResult } from 'react-query'

const reactQueryOverrides = { queries: { retry: false } }

const wrapper: React.FC = ({ children }) => (
  <ReactQueryConfigProvider config={reactQueryOverrides}>{children}</ReactQueryConfigProvider>
)

export default async function executeQuery<TResult>(
  callback: () => QueryResult<TResult>,
  waitCheck = (query: QueryResult<TResult>) => query.isSuccess,
) {
  const { result, waitFor } = renderHook(callback, { wrapper })
  await waitFor(() => waitCheck(result.current), { timeout: 1000 })
  return result.current.data
}
