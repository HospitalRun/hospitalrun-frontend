import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateText, updateLink, updateVisibility, updateIcon } from './button-slice'
import { IconType } from '@hospitalrun/components/dist/components/Icon/interfaces'

export default function useButton(text: string, link: string, visible: boolean, icon: IconType): void {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(updateText(text))
        dispatch(updateLink(link))
        dispatch(updateVisibility(visible))
        dispatch(updateIcon(icon))
    })
}