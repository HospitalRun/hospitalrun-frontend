import React from 'react'
import { useButtons } from './button-bar-context'

const ButtonToolBar = () => {
  const buttons = useButtons()
  return <>{buttons.map((button) => button)}</>
}

export default ButtonToolBar
