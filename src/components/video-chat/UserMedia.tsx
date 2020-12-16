import VideoBox from './VideoBox'

interface UserMediaProps {
  stream: MediaStream | null
  startScreenShare?: () => Promise<boolean>
  stopScreenShare?: () => void
}

export default function UserMedia(props: UserMediaProps) {
  if (props.stream) {
    return (
      <VideoBox
        stream={props.stream}
        mute={false}
        buttons={[
          'mute',
          'video',
          'pictureInPicture',
          'fullScreen',
          'screenShare',
        ]}
        size="unset"
        startScreenShare={props.startScreenShare}
        stopScreenShare={props.stopScreenShare}
      />
    )
  }
  return null
}
