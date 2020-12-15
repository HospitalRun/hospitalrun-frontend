export function expectOneConsoleError(expected: Error) {
  jest.spyOn(console, 'error').mockImplementationOnce((actual) => {
    expect(actual).toEqual(expected)
  })
}
