const isQuerySuccessful = (queryResult: any) => queryResult && queryResult.status === 'success'
const waitUntilQueryIsSuccessful = (renderHookResult: any) =>
  renderHookResult.waitFor(() => isQuerySuccessful(renderHookResult.result.current), {
    timeout: 1000,
  })

export default waitUntilQueryIsSuccessful
