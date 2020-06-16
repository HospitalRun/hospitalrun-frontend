import { useRef, useEffect, EffectCallback } from 'react'

export default function (effect: EffectCallback, dependencies: any[]): void {
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
