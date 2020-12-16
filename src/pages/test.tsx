import { Button } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'

export default function Test() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => (videoRef.current!.srcObject = stream))
    }
  }, [videoRef.current])
  return (
    <>
      <video ref={videoRef} />
      <Button
        onClick={() => {
          ;(videoRef.current as any).requestPictureInPicture()
        }}
      >
        Picture In Picture+
      </Button>
    </>
  )
}
