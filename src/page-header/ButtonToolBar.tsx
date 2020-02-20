import React from 'react'
import { useButtons } from './ButtonBarProvider'

const ButtonToolBar = () => {
  const buttons = useButtons()
  return <>{buttons.map((button) => button)}</>
}

export default ButtonToolBar
