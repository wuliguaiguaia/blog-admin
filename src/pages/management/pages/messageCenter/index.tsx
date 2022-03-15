import React, { FunctionComponent } from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { RootState } from '@/store/reducers/interface'

interface IProps {
  history: any
}
const MessageCenter: FunctionComponent<IProps> = ({ history }) => {
  const a = 'messgaecenter'
  const { userRole, authConfig } = useSelector((state: RootState) => state.common)
  if (!authConfig?.[userRole]?.message) {
    history.replace('/')
    return <></>
  }
  return (
    <div>
      { a}
      fdsfsd
    </div>
  )
}

export default withRouter(MessageCenter)
