import { useRef, useEffect } from 'react'

export default function (effect: Function, dependencies: any[]) {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      effect()
    }
  }, dependencies)
}
