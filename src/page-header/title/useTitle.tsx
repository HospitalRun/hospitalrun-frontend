import { useEffect } from 'react'

import { useUpdateTitle } from './TitleContext'

export default function useTitle(title: string): void {
  const updateTitle = useUpdateTitle()

  useEffect(() => updateTitle(title))
}
