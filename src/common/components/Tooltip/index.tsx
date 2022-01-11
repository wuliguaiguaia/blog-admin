import { Tooltip } from 'antd'
import React, {
  createRef, FunctionComponent, useEffect, useState,
} from 'react'

interface IProps {
  // selector: string
  txt: string,
  width: number
}

const MyTooltip: FunctionComponent<IProps> = ({ txt, width }) => {
  const [show, setShow] = useState(false)
  const el = createRef<HTMLDivElement>()
  useEffect(() => {
    if (!el.current) return
    const {scrollWidth} = el.current
    if (scrollWidth > width) {
      setShow(true)
    }
  }, [el, width])
  return (
    <>
      <Tooltip title={txt} style={{ display: show ? 'block' : 'none' }}>
        <span className="text-ellipsis">{txt}</span>
      </Tooltip>
      <div ref={el} style={{ display: show ? 'none' : 'block'}}>{txt}</div>
    </>
  )
}
export default MyTooltip
