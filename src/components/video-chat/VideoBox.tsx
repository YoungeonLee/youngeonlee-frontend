import { VStack } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import VideoControls, { ButtonTypes } from './VideoControls'

interface VideoBoxProps {
  stream: MediaStream
  mute: boolean
  buttons: ButtonTypes[]
  size: string
}

export default function VideoBox(props: VideoBoxProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (props.stream && videoRef.current) {
      videoRef.current.srcObject = props.stream
    }
  }, [props.stream, videoRef.current])
  return (
    <VStack align="unset" w={props.size} h={props.size}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={props.mute}
        style={{ flexGrow: 1, maxHeight: 'calc(100% - 40px)' }}
      />
      <VideoControls size="2em" buttons={props.buttons} />
    </VStack>
  )
}
