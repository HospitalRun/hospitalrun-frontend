import { act, renderHook } from '@testing-library/react-hooks'
import { MutateFunction } from 'react-query'

export default async function executeMutation<TResult>(
  callback: () => [MutateFunction<unknown, unknown, TResult>, ...any[]],
  ...input: TResult[]
) {
  const { result } = renderHook(callback)
  const [mutate] = result.current

  let actualData: any
  await act(async () => {
    actualData = await mutate(...input)
  })

  return actualData
}
