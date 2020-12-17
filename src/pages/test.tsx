import { Button } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'

export default function Test() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
        .then((stream) => (videoRef.current!.srcObject = stream))
    }
  }, [videoRef.current])
  return (
    <>
      <video ref={videoRef} autoPlay playsInline muted />
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
