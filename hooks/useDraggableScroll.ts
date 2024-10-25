import { useEffect, useRef, useState } from "react"

const useDraggableScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    setStartX(e.pageX - (scrollRef.current!.offsetLeft || 0))
    setScrollLeft(scrollRef.current!.scrollLeft)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const x = e.pageX - (scrollRef.current!.offsetLeft || 0)
      const walk = (x - startX) * 2
      scrollRef.current!.scrollLeft = scrollLeft - walk
    }

    const handleMouseUp = () => setIsDragging(false)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, startX, scrollLeft])

  return { scrollRef, handleMouseDown }
}

export default useDraggableScroll
