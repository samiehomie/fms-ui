import { useEffect, useRef, useCallback } from 'react'

export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  enabled = true,
) {
  const ref = useRef<T>(null)
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as Element
    if (target.closest('.vehicle-container')) {
      return
    }
    if (ref.current && ref.current.contains(e.target as Node)) {
      savedHandler.current()
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    // mousedown을 사용하면 더 빠른 반응
    document.addEventListener('mousedown', handleClick, true)
    return () => {
      document.removeEventListener('mousedown', handleClick, true)
    }
  }, [handleClick, enabled])

  return ref
}
