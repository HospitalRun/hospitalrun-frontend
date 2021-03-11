import * as React from 'react'

type SetTitle = (title: string) => void
type State = { title: string }
type TitleProviderProps = { children: React.ReactNode }
const TitleStateContext = React.createContext<State | undefined>(undefined)
const TitleDispatchContext = React.createContext<SetTitle | undefined>(undefined)

function TitleProvider({ children }: TitleProviderProps) {
  const [title, setTitle] = React.useState('')
  return (
    <TitleStateContext.Provider value={{ title }}>
      <TitleDispatchContext.Provider value={setTitle}>{children}</TitleDispatchContext.Provider>
    </TitleStateContext.Provider>
  )
}
function useTitle() {
  const context = React.useContext(TitleStateContext)
  if (context === undefined) {
    throw new Error('useTitle must be used within a TitleProvider')
  }
  return context
}
function useUpdateTitle() {
  const context = React.useContext(TitleDispatchContext)
  if (context === undefined) {
    throw new Error('useUpdateTitle must be used within a TitleProvider')
  }
  return context
}
export { TitleProvider, useTitle, useUpdateTitle }
