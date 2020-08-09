import { act, renderHook } from '@testing-library/react-hooks'

import waitUntilQueryIsSuccessful from './wait-for-query.util'

export default async function executeQuery(callback: any) {
  let actualData: any
  await act(async () => {
    const renderHookResult = renderHook(callback)
    const { result } = renderHookResult
    await waitUntilQueryIsSuccessful(renderHookResult)
    actualData = (result as any).current.data
  })

  return actualData
}
