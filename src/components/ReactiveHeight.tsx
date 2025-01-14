import React, { useCallback, useRef, useState, useEffect } from 'react'
import useReactiveHeightVirtualList from '../hooks/useReactiveHeightVirtualList'

interface IProps<T> {
  data: T[];
  estimatedItemHeight: number
  itemRender: (item: T) => JSX.Element
}

function ReactiveHeight <T>({ data, estimatedItemHeight, itemRender }: IProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0);  
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])

  const { totalHeight, visibleData, offset } = useReactiveHeightVirtualList({
    data,
    estimatedItemHeight,
    scrollTop,
    clientHeight,
    itemRefs,
  })

  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop)
    }
  }, [])

  const containerRefCallback = useCallback((node: HTMLDivElement) => {
    if (node) {
      containerRef.current = node
      setClientHeight(node.clientHeight)
    } else {
      containerRef.current = null
    }
  }, [])

  return (
    <div
      className="container"
      ref={containerRefCallback}
      onScroll={handleScroll}
    >
      <div
        className="total-list"
        style={{ height: `${totalHeight}px` }}
      ></div>
      <div
        className="visible-list"
        style={{ transform: `translateY(${offset}px)` }}
      >
		
        {visibleData.map((data, index) => (
          <div
            key={(data as any).id}
            // 有其他办法拿到一组 DOM 吗？
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
          >{itemRender(data)}</div>
        ))}
      </div>
    </div>
  )
}

export default ReactiveHeight
