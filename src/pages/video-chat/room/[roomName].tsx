import { HStack, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import UserMedia from '../../../components/video-chat/UserMedia'
import { ChatUser } from '../../../types'
import generateUser from '../../../utils/generateUser'
import Peer, { Instance, SignalData } from 'simple-peer'
import OtherVideos from '../../../components/video-chat/OtherVideos'
import { objectRemoveKey } from '../../../utils/objectFilter'
import ChatMessages from '../../../components/video-chat/ChatMessages'
import ChatInput from '../../../components/video-chat/ChatInput'

export interface Message {
  text: string
  color: string
}

interface PeerObject {
  [id: string]: Instance
}

export interface StreamObject {
  [id: string]: MediaStream
}

interface UserSetting {
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
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `You joined as ${userSettingRef.current.name}`,
      color: userSettingRef.current.color,
    },
  ])
  const socketRef = useRef<Socket | null>(null)
  const secretKeyRef = useRef<string | undefined>(undefined)

  let userStream: MediaStream
  console.log('Peers: ', peers.current)

  function sendChat(e: KeyboardEvent<HTMLInputElement>) {
    const message = e.currentTarget.value
    if (
      e.key === 'Enter' &&
      socketRef.current &&
      secretKeyRef.current &&
      message !== ''
    ) {
      socketRef.current.emit(
        'send-message',
        message,
        userSettingRef.current,
        secretKeyRef.current
      )
      e.currentTarget.value = ''
      setMessages((prevState) => [
        ...prevState,
        {
          text: `${userSettingRef.current.name}: ${message}`,
          color: userSettingRef.current.color,
        },
      ])
    }
  }

  // disable scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

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

      socket.on('user-joined', (user: ChatUser) => {
        setMessages((prevState) => [
          ...prevState,
          { text: `${user.name} has joined`, color: user.color },
        ])
      })

      socket.on(
        'user-setting-changed',
        (prevUser: ChatUser, newUser: ChatUser) => {
          setMessages((prevState) => [
            ...prevState,
            {
              text: `${prevUser.name} has changed to ${newUser.name}`,
              color: newUser.color,
            },
          ])
        }
      )

      socket.on('user-disconnected', (user: ChatUser, socketId: string) => {
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
      })

      // handle incoming chat messages
      socket.on('message', (message: string, user: ChatUser) => {
        setMessages((prevState) => [
          ...prevState,
          { text: `${user.name}: ${message}`, color: user.color },
        ])
      })

      // when you get secret key join video chat
      socket.on('secret-key', (key: string) => {
        console.log('secret key recieved')
        secretKeyRef.current = key
      })

      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          userStream = stream
          setStream(stream)

          //once we get secret key join the video room
          const intervalId = setInterval(() => {
            if (secretKeyRef.current) {
              socket.emit('join-video', secretKeyRef.current)
              console.log('emitted join video')
              clearInterval(intervalId)

              // call user when joined
              socket.on('user-video-joined', (socketId: string) => {
                console.log('user video join received')
                const peer = new Peer({ initiator: true, stream: stream })
                peer.on('error', (err) => console.error(err))
                peers.current = { ...peers.current, [socketId]: peer }
                peer.on('signal', (data) => {
                  console.log('caller signal received... calling user')
                  console.log(data)
                  socket.emit('call-user', data, socketId)
                })
                peer.on('stream', (stream) => {
                  setOtherStreams((prev) => {
                    return { ...prev, [socketId]: stream }
                  })
                })
              })
            }
          }, 10)

          // answer calls
          socket.on('call-received', (data: SignalData, socketId: string) => {
            console.log('call received')
            // if peer already exists, just siganl data
            if (peers.current[socketId]) {
              return peers.current[socketId].signal(data)
            }
            const peer = new Peer({ stream: stream })
            peer.on('error', (err) => console.error(socketId, err))
            peers.current = { ...peers.current, [socketId]: peer }
            peer.on('signal', (data) => {
              console.log('signal data:', data)
              socket.emit('answer-call', data, socketId)
            })
            peer.signal(data)
            peer.on('stream', (stream) => {
              setOtherStreams((prev) => {
                return { ...prev, [socketId]: stream }
              })
            })
          })

          // complete the call
          socket.on('answered-call', (data: SignalData, socketId: number) => {
            console.log('answered call')
            peers.current[socketId].signal(data)
          })
        })
        .catch((err) => alert(err))

      return () => {
        // close websocket connection
        socket.close()
        // clear usermedia sharing
        userStream?.getTracks().forEach(function (track) {
          track.stop()
        })
      }
    } else {
      // do nothing if roomName isn't defined
    }
  }, [roomName])

  return (
    <>
      <HStack h="100vh" spacing={0}>
        <VStack
          h="100%"
          w="5vw"
          bg="gray.100"
          minW="280px"
          justify="space-between"
          align="unset"
        >
          <UserMedia stream={stream} />
          <ChatMessages messages={messages} />
          <ChatInput submit={sendChat} />
        </VStack>
        <OtherVideos streams={otherStreams} />
      </HStack>
    </>
  )
}