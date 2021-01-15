export function expectOneConsoleError(expected: any) {
  jest.spyOn(console, 'error').mockImplementationOnce((actual) => {
    expect(actual).toEqual(expected)
  })
}
