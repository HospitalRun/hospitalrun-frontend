import * as React from 'react'

type Action = { type: 'setTitle'; payload: string }
type Dispatch = (action: Action) => void
type State = { title: string }
type TitleProviderProps = { children: React.ReactNode }
const TitleStateContext = React.createContext<State | undefined>(undefined)
const TitleDispatchContext = React.createContext<Dispatch | undefined>(undefined)
function titleReducer(state: State, action: Action) {
  switch (action.type) {
    case 'setTitle': {
      return { ...state, title: action.payload }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}
function TitleProvider({ children }: TitleProviderProps) {
  const [state, dispatch] = React.useReducer(titleReducer, { title: '' })
  return (
    <TitleStateContext.Provider value={state}>
      <TitleDispatchContext.Provider value={dispatch}>{children}</TitleDispatchContext.Provider>
    </TitleStateContext.Provider>
  )
}
function useTitleState() {
  const context = React.useContext(TitleStateContext)
  if (context === undefined) {
    throw new Error('useTitleState must be used within a TitleProvider')
  }
  return context
}
function useTitleDispatch() {
  const context = React.useContext(TitleDispatchContext)
  if (context === undefined) {
    throw new Error('useTitleDispatch must be used within a TitleProvider')
  }
  return context
}
export { TitleProvider, useTitleState, useTitleDispatch }
