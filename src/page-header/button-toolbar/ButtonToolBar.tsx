import React from 'react'

import { useButtons } from './ButtonBarProvider'

const ButtonToolBar = () => {
  const buttons = useButtons()

  if (buttons.length === 0) {
    return null
  }

  return <div className="button-toolbar">{buttons.map((button) => button)}</div>
}

export default ButtonToolBar
