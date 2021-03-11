export const extractUsername = (username: string) =>
  username ? username.slice(username.lastIndexOf(':') + 1) : ''
