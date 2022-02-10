import React, { useCallback, useRef, useState, useEffect } from 'react'
import useReverseReactiveHeightVirtualList from '../hooks/useReverseReactiveHeightVirtualList'
import dataGen from '../utils/data-generator'

interface IProps<T> {
  estimatedItemHeight: number
  itemRender: (item: object) => JSX.Element
}

function ReverseReactiveHeight <T>({ estimatedItemHeight, itemRender }: IProps<T>) {
  const [data, setData] = useState(()=>{
	  return dataGen(20).reverse();
  });
  const [scrollTop, setScrollTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0);  
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const setScrollerTop = useCallback((top)=>{
	if(containerRef.current) {
		containerRef.current.scrollTop = top;
	}
  }, [])

  const { totalHeight, visibleData, offset } = useReverseReactiveHeightVirtualList({
    data,
    estimatedItemHeight,
    scrollTop,
    clientHeight,
    itemRefs,
	setScrollerTop
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

  useEffect(()=>{
	  setTimeout(()=>{
		// 在第一次加载完数据的时候就设置scrollTop到底部
		setScrollerTop(bottomRef.current?.offsetTop);
	  },0)
  },[setScrollerTop])

  const loadData = useCallback(()=>{
	setData((prevData) => {
		return [...dataGen(20, prevData.length).reverse(), ...prevData]
	});
  },[])

  return (
	  <>
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
            // 有其他办法拿到一组 DOM 吗？ -- 有的。写成高阶组件用children拿
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
          >{itemRender(data)}</div>
        ))}
			  <div className='bottom' ref={bottomRef}></div>
      </div>
    </div>
	<button onClick={loadData}>加载数据--在scrollTop===0的时候再按，模拟滑到顶上自动加载的场景</button>
	</>
  )
}

export default ReverseReactiveHeight
