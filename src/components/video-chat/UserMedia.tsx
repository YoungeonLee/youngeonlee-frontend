import VideoBox from './VideoBox'

interface UserMediaProps {
  stream: MediaStream | null
}

export default function UserMedia(props: UserMediaProps) {
  if (props.stream) {
    return (
      <VideoBox
        stream={props.stream}
        mute
        buttons={['mute', 'video', 'pictureInPicture', 'fullScreen']}
        size="unset"
      />
    )
  }
  return null
}
