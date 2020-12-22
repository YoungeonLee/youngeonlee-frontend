import { KeyboardEvent } from 'react'
import { Socket } from 'socket.io-client'
import {
  PeerObject,
  UserSetting,
  Message,
} from '../../pages/video-chat/room/[roomName]'

export async function startScreenShare(
  userStreamRef: React.MutableRefObject<MediaStream | undefined>,
  userScreenRef: React.MutableRefObject<MediaStream | undefined>,
  setStream: (value: React.SetStateAction<MediaStream | null>) => void,
  peers: React.MutableRefObject<PeerObject>
) {
  try {
    const stream: MediaStream = await (navigator.mediaDevices as any).getDisplayMedia(
      { audio: false, video: true }
    )
    stream.addTrack(userStreamRef.current!.getAudioTracks()[0])
    userScreenRef.current = stream
    setStream(stream)
    Object.keys(peers.current).forEach((value) => {
      peers.current[value].replaceTrack(
        userStreamRef.current!.getVideoTracks()[0],
        stream.getVideoTracks()[0],
        userStreamRef.current!
      )
    })
    return true
  } catch (err) {
    alert(err)
    return false
  }
}

export function stopScreenShare(
  userStreamRef: React.MutableRefObject<MediaStream | undefined>,
  userScreenRef: React.MutableRefObject<MediaStream | undefined>,
  setStream: (value: React.SetStateAction<MediaStream | null>) => void,
  peers: React.MutableRefObject<PeerObject>
) {
  setStream(userStreamRef.current!)
  Object.keys(peers.current).forEach((value) => {
    peers.current[value].replaceTrack(
      userScreenRef.current!.getVideoTracks()[0],
      userStreamRef.current!.getVideoTracks()[0],
      userStreamRef.current!
    )
  })
  userScreenRef.current?.getVideoTracks().forEach(function (track) {
    track.stop()
  })
  userScreenRef.current = undefined
}

export function sendChat(
  e: KeyboardEvent<HTMLInputElement>,
  socketRef: React.MutableRefObject<Socket | null>,
  secretKey: string | null,
  userSettingRef: React.MutableRefObject<UserSetting>,
  setMessages: (fn: (prevState: Message[]) => Message[], open: boolean) => void
) {
  const message = e.currentTarget.value
  if (e.key === 'Enter' && socketRef.current && secretKey && message !== '') {
    socketRef.current.emit(
      'send-message',
      message,
      userSettingRef.current,
      secretKey
    )
    e.currentTarget.value = ''
    setMessages(
      (prevState) => [
        ...prevState,
        {
          text: `${userSettingRef.current.name}: ${message}`,
          color: userSettingRef.current.color,
        },
      ],
      true
    )
  }
}
