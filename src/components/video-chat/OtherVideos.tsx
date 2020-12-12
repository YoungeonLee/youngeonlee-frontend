import { HStack } from '@chakra-ui/react'
import { StreamObject } from '../../pages/video-chat/room/[roomName]'
import VideoBox from './VideoBox'

interface OtherVideosProps {
  streams: StreamObject
}

export default function OtherVideos(props: OtherVideosProps) {
  let size: string

  switch (Object.keys(props.streams).length) {
    case 1:
      size = 'full'
      break
    case 2:
      size = '50%'
      break
    case 3:
      size = '50%'
      break
    case 4:
      size = '50%'
      break

    default:
      size = '50%'
      break
  }

  return (
    <HStack w="full" h="full" justify="center" wrap="wrap" spacing={0}>
      {Object.keys(props.streams).map((socketId) => (
        <VideoBox
          stream={props.streams[socketId]}
          mute={false}
          key={socketId}
          buttons={['video', 'speaker', 'pictureInPicture', 'fullScreen']}
          size={size}
        />
      ))}
    </HStack>
  )
}
