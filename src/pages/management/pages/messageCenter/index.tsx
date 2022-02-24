import React from 'react'

const ws = new WebSocket('ws://localhost:3002/blog-admin')

ws.onopen = function () {
  console.log('Connection open ...')
  // ws.send(JSON.stringify({event: 'newComment', data: {s: 1}}))
}

ws.onmessage = function (evt) {
  console.log(`Received Message: ${evt.data}`)
}

ws.onclose = function () {
  console.log('Connection closed.')
}


// readyState 属性返回实例对象的当前状态，共有四种。
switch (ws.readyState) {
  case WebSocket.CONNECTING: // 值为0，表示正在连接。
    break
  case WebSocket.OPEN: // 值为1，表示连接成功，可以通信了。
    break
  case WebSocket.CLOSING: // 值为2，表示连接正在关闭。
    break
  case WebSocket.CLOSED: // 值为3，表示连接已经关闭，或者打开连接失败。
    break
  default:
    // this never happens
    break
}


const MessageCenter = () => {
  const a = 'messgaecenter'
  return (
    <div>
      { a}
      fdsfsd
    </div>
  )
}

export default MessageCenter
