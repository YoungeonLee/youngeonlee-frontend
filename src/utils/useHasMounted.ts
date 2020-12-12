// https://www.joshwcomeau.com/react/the-perils-of-rehydration/#abstractions
import { useEffect, useState } from 'react'

export default function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  return hasMounted
}
