import { act, renderHook } from '@testing-library/react-hooks'

export default async function executeMutation(callback: any, ...input: any[]) {
  let mutateToTest: any
  await act(async () => {
    const renderHookResult = renderHook(callback)
    const { result, waitForNextUpdate } = renderHookResult
    await waitForNextUpdate()
    const [mutate] = result.current as any
    mutateToTest = mutate
  })

  let actualData: any
  await act(async () => {
    const result = await mutateToTest(...input)
    actualData = result
  })

  return actualData
}
