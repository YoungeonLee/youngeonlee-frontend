import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { Box, IconButton, Badge, Icon } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { VscCircleFilled } from 'react-icons/vsc'
import { Message } from '../../pages/video-chat/room/[roomName]'

interface OpenCloseButtonProps {
  setOpen: (value: React.SetStateAction<boolean>) => void
  openRef: React.MutableRefObject<boolean>
  unreadMessagesRef: React.MutableRefObject<number>
  setNewUnreadMessage: (value: React.SetStateAction<Message | null>) => void
  open: boolean
  newUnreadMessage: Message | null
  bg: string
}

export default function ChatOpenCloseButton({
  setOpen,
  openRef,
  unreadMessagesRef,
  setNewUnreadMessage,
  open,
  newUnreadMessage,
  bg,
}: OpenCloseButtonProps) {
  const badgeRef = useRef<HTMLSpanElement>(null)
  return (
    <Box pos="absolute" right="-40px" top="49%">
      <IconButton
        onClick={() => {
          setOpen((prev) => !prev)
          openRef.current = !openRef.current
          // mark all messages to be read
          if (openRef.current) {
            unreadMessagesRef.current = 0
            setNewUnreadMessage(null)
          }
        }}
        aria-label="Search database"
        colorScheme="gray"
        zIndex={100}
        icon={open ? <ArrowLeftIcon /> : <ArrowRightIcon />}
      />
      <Badge
        ref={badgeRef}
        colorScheme="red"
        pos="absolute"
        right={
          badgeRef.current ? `${-badgeRef.current.clientWidth / 2}px` : '0px'
        }
        top={
          badgeRef.current ? `${-badgeRef.current.clientHeight / 2}px` : '0px'
        }
        zIndex={101}
      >
        {unreadMessagesRef.current !== 0 ? unreadMessagesRef.current : null}
      </Badge>
      <Box
        pos="absolute"
        left="100%"
        top="50%"
        ml={1}
        borderRadius="lg"
        overflow="hidden"
        bg={bg}
        pl={1}
        pr={2}
      >
        {newUnreadMessage ? (
          <Box maxW="sm" isTruncated>
            <Icon as={VscCircleFilled} color={newUnreadMessage.color} mb={1} />
            {newUnreadMessage!.text}
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}
