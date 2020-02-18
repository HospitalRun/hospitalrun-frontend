import React, { useState } from 'react'

type Props = {
  children?: React.ReactNode
}

type ButtonUpdater = (buttons: React.ReactNode[]) => void

const ButtonBarStateContext = React.createContext<React.ReactNode[]>([])
const ButtonBarUpdateContext = React.createContext<ButtonUpdater>(() => {
  // empty initial state
})

function ButtonBarProvider(props: Props) {
  const { children } = props
  const [state, setState] = useState<React.ReactNode[]>([])
  return (
    <ButtonBarStateContext.Provider value={state}>
      <ButtonBarUpdateContext.Provider value={setState}>{children}</ButtonBarUpdateContext.Provider>
    </ButtonBarStateContext.Provider>
  )
}
function useButtons() {
  const context = React.useContext(ButtonBarStateContext)
  if (context === undefined) {
    throw new Error('useButtons must be used within a Button Bar Context')
  }
  return context
}
function useButtonToolbarSetter() {
  const context = React.useContext(ButtonBarUpdateContext)
  if (context === undefined) {
    throw new Error('useButtonToolBarSetter must be used within a Button Bar Context')
  }
  return context
}

export { ButtonBarProvider, useButtons, useButtonToolbarSetter }
