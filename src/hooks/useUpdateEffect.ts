import { useRef, useEffect } from 'react'

export default function (effect: Function, dependencies: any[]) {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    // eslint-disable-next-line consistent-return
    return effect && effect()
  }, dependencies) //eslint-disable-line
}
