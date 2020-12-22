import {
  Box,
  HStack,
  IconButton,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import UserMedia from '../../../components/video-chat/UserMedia'
import { ChatUser } from '../../../types'
import generateUser from '../../../utils/generateUser'
import Peer, { Instance, SignalData } from 'simple-peer'
import OtherVideos from '../../../components/video-chat/OtherVideos'
import { objectRemoveKey } from '../../../utils/objectFilter'
import ChatMessages from '../../../components/video-chat/ChatMessages'
import ChatInput from '../../../components/video-chat/ChatInput'
import { DarkModeSwitch } from '../../../components/shared/DarkModeSwitch'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import debounce from '../../../utils/debounce'
import {
  sendChat,
  startScreenShare,
  stopScreenShare,
} from '../../../utils/video-chat/functions'

export interface Message {
  text: string
  color: string
}

export interface PeerObject {
  [id: string]: Instance
}

export interface StreamObject {
  [id: string]: MediaStream
}

export interface UserSetting {
  color: string
  name: string
}

export default function Room() {
  const router = useRouter()
  const { roomName } = router.query
  console.log(roomName)

  const [stream, setStream] = useState<MediaStream | null>(null)
  const peers = useRef<PeerObject>({})
  const [otherStreams, setOtherStreams] = useState<StreamObject>({})
  const userSettingRef = useRef<UserSetting>(generateUser())
  const [messages, setMessagesState] = useState<Message[]>([
    {
      text: `Joining as ${userSettingRef.current.name}...`,
      color: userSettingRef.current.color,
    },
  ])
  const [open, setOpen] = useState(true)
  const openRef = useRef(true)
  function setMessages(fn: (prevState: Message[]) => Message[]) {
    setMessagesState(fn)
    if (!openRef.current) {
      console.log('not open')
    } else {
      console.log('open')
    }
  }

  const socketRef = useRef<Socket | null>(null)
  const [secretKey, setSecretKey] = useState<string | null>(null)

  const userStreamRef = useRef<MediaStream | undefined>(undefined)
  const userScreenRef = useRef<MediaStream | undefined>(undefined)
  console.log('Peers: ', peers.current)

  const startScreenShareCallback = useCallback(async () => {
    return startScreenShare(userStreamRef, userScreenRef, setStream, peers)
  }, [peers])

  const stopScreenShareCallback = useCallback(() => {
    stopScreenShare(userStreamRef, userScreenRef, setStream, peers)
  }, [peers])

  const sendChatCallback = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      sendChat(e, socketRef, secretKey, userSettingRef, setMessages)
    },
    [secretKey, open]
  )

  // disable scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // set stream
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        userStreamRef.current = stream
        setStream(stream)
      })
      .catch((err) => console.error(err))
    return () => {
      // clear usermedia sharing
      userStreamRef.current!.getTracks().forEach(function (track) {
        track.stop()
      })
      userScreenRef.current?.getTracks().forEach(function (track) {
        track.stop()
      })
    }
  }, [])

  // connect to socket
  useEffect(() => {
    if (roomName) {
      //create socket connection
      const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video-chat`)
      socketRef.current = socket

      socket.on('connect', () => {
        console.log('socket connected:', socket.id)
        socket.emit(
          'join-room',
          roomName,
          userSettingRef.current,
          localStorage.getItem('video-chat-creatorKey')
        )
        localStorage.removeItem('video-chat-creatorKey')
      })

      socket.on('disconnect', () => {
        console.log('socket disconnected')
      })

      socket.on('connect_error', (error: object) => {
        alert(error)
      })

      socket.on('server-error', (msg: string) => alert(msg))

      // when you get secret key join video chat
      socket.on('secret-key', (key: string) => {
        console.log('secret key recieved')
        setSecretKey(key)
      })

      return () => {
        // close websocket connection
        socket.close()
      }
    }
  }, [roomName])

  // sockets events with setMessages need to get reassigned when the function changes
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('user-joined', (user: ChatUser) => {
        setMessages((prevState: Message[]) => [
          ...prevState,
          { text: `${user.name} has joined`, color: user.color },
        ])
      })

      socketRef.current.on(
        'user-setting-changed',
        (prevUser: ChatUser, newUser: ChatUser) => {
          setMessages((prevState: Message[]) => [
            ...prevState,
            {
              text: `${prevUser.name} has changed to ${newUser.name}`,
              color: newUser.color,
            },
          ])
        }
      )

      socketRef.current.on(
        'user-disconnected',
        (user: ChatUser, socketId: string) => {
          setMessages((prevState) => [
            ...prevState,
            { text: `${user.name} has left`, color: user.color },
          ])
          console.log('user disconnected', socketId)
          if (peers.current[socketId]) {
            peers.current[socketId].destroy()
            delete peers.current[socketId]
            setOtherStreams((prev) => {
              return objectRemoveKey(prev, socketId)
            })
          }
        }
      )

      // handle incoming chat messages
      socketRef.current.on('message', (message: string, user: ChatUser) => {
        setMessages((prevState: Message[]) => [
          ...prevState,
          { text: `${user.name}: ${message}`, color: user.color },
        ])
      })
    }
  }, [socketRef.current, setMessages])

  // join video call
  useEffect(() => {
    if (secretKey && userStreamRef.current) {
      socketRef.current!.emit('join-video', secretKey)
      console.log('emitted join video')
      setMessages((prevState: Message[]) => [
        ...prevState,
        {
          text: `Joined as ${userSettingRef.current.name}`,
          color: userSettingRef.current.color,
        },
      ])

      // call user when joined
      socketRef.current!.on('user-video-joined', (socketId: string) => {
        console.log('user video join received')
        const peer = new Peer({
          initiator: true,
          stream: userScreenRef.current || userStreamRef.current,
        })
        peer.on('error', (err) => console.error(err))
        peers.current = { ...peers.current, [socketId]: peer }
        peer.on('signal', (data) => {
          console.log('caller signal received... calling user')
          console.log(data)
          socketRef.current!.emit('call-user', data, socketId)
        })
        peer.on('stream', (stream) => {
          setOtherStreams((prev) => {
            return { ...prev, [socketId]: stream }
          })
        })
      })

      // answer calls
      socketRef.current!.on(
        'call-received',
        (data: SignalData, socketId: string) => {
          console.log('call received')
          // if peer already exists, just siganl data
          if (peers.current[socketId]) {
            return peers.current[socketId].signal(data)
          }
          const peer = new Peer({
            stream: userScreenRef.current || userStreamRef.current,
          })
          peer.on('error', (err) => console.error(socketId, err))
          peers.current = { ...peers.current, [socketId]: peer }
          peer.on('signal', (data) => {
            console.log('signal data:', data)
            socketRef.current!.emit('answer-call', data, socketId)
          })
          peer.signal(data)
          peer.on('stream', (stream) => {
            setOtherStreams((prev) => {
              return { ...prev, [socketId]: stream }
            })
          })
        }
      )

      // complete the call
      socketRef.current!.on(
        'answered-call',
        (data: SignalData, socketId: number) => {
          console.log('answered call')
          peers.current[socketId].signal(data)
        }
      )
    }
  }, [secretKey, userStreamRef.current])

  const bg = useColorModeValue('gray.100', 'gray.600')
  const [innerHeight, setInnerHeight] = useState<'100vh' | number>('100vh')

  // resize on window change
  useEffect(() => {
    const debouncedFunction = debounce(() => {
      setInnerHeight(window.innerHeight)
      console.log('innerHeight changed')
    })
    window.addEventListener('resize', debouncedFunction)
    return () => {
      window.removeEventListener('resize', debouncedFunction)
    }
  }, [])

  return (
    <>
      <HStack h={innerHeight} spacing={0}>
        <Box
          h="100%"
          w={open ? '5vw' : '0px'}
          minW={open ? '280px' : '0px'}
          pos="relative"
        >
          <VStack
            h="100%"
            w="100%"
            bg={bg}
            justify="space-between"
            align="unset"
            overflow="hidden"
          >
            <UserMedia
              stream={stream}
              startScreenShare={startScreenShareCallback}
              stopScreenShare={stopScreenShareCallback}
            />
            <ChatMessages messages={messages} />
            <ChatInput submit={sendChatCallback} />
          </VStack>
          <IconButton
            onClick={() => {
              setOpen((prev) => !prev)
              openRef.current = !openRef.current
            }}
            pos="absolute"
            right="-40px"
            top="49%"
            aria-label="Search database"
            colorScheme="gray"
            zIndex={100}
            icon={open ? <ArrowLeftIcon /> : <ArrowRightIcon />}
          />
        </Box>
        <OtherVideos streams={otherStreams} />
      </HStack>
      <DarkModeSwitch />
    </>
  )
}
