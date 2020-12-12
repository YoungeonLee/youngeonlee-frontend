import { List, ListItem, ListIcon } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { Message } from '../../pages/video-chat/room/[roomName]'
import useHasMounted from '../../utils/useHasMounted'
import { VscCircleFilled } from 'react-icons/vsc'

interface ChatMessagesProps {
  messages: Message[]
}

export default function ChatMessages(props: ChatMessagesProps) {
  const listRef = useRef<HTMLUListElement | null>(null)
  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView()
  }, [props.messages, listRef.current])
  if (!useHasMounted()) return null
  return (
    <List spacing={3} w="full" flexGrow={1} overflowY="scroll" ref={listRef}>
      {props.messages.map((message, index) => (
        <ListItem key={index} mx={2}>
          <ListIcon as={VscCircleFilled} color={message.color} />
          {message.text}
        </ListItem>
      ))}
    </List>
  )
}
