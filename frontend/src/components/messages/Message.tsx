import React from 'react'
import { Box, Paper } from '@mui/material'

interface MessageProps {
  senderId: string,
  message: string
}

const MessageBox: React.FC<MessageProps> = ({ senderId, message }) => {

  const userId = sessionStorage.getItem("userId") ?? ""
  const isSender = senderId === userId
  const bubbleBgColor = isSender ? "#bb86fc" : "gray"
  const alignMessage = isSender ? "flex-end" : "flex-start"

  return (
    <Box sx={{ justifyContent: alignMessage, display: 'flex', padding: '10px' }} >
      <Paper sx={{ backgroundColor: bubbleBgColor, display: 'flex', padding: '10px' }} >
        {message}
      </Paper>
    </Box>
  )
}

export default MessageBox