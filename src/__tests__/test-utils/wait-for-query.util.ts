const isQuerySuccessful = (queryResult: any) => queryResult && queryResult.status === 'success'
const waitUntilQueryIsSuccessful = (renderHookResult: any) =>
  renderHookResult.waitFor(() => isQuerySuccessful(renderHookResult.result.current), {
    timeout: 1000,
  })

const isQueryUnsuccessful = (queryResult: any) => queryResult && queryResult.status === 'error'
export const waitUntilQueryFails = (renderHookResult: any) =>
  renderHookResult.waitFor(() => isQueryUnsuccessful(renderHookResult.result.current), {
    timeout: 1000,
  })

export default waitUntilQueryIsSuccessful
