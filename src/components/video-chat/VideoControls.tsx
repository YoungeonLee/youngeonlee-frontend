import {
  HStack,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IconType } from 'react-icons'
import { AiOutlineAudio, AiOutlineAudioMuted } from 'react-icons/ai'
import {
  BiExitFullscreen,
  BiFullscreen,
  BiVideo,
  BiVideoOff,
  BiVolumeFull,
  BiVolumeMute,
} from 'react-icons/bi'
import {
  RiPictureInPicture2Line,
  RiPictureInPictureExitLine,
} from 'react-icons/ri'
import { FaRegShareSquare } from 'react-icons/fa'
import HTMLElementContains from '../../utils/HTMLElementContains'

export type ButtonTypes =
  | 'mute'
  | 'video'
  | 'speaker'
  | 'pictureInPicture'
  | 'fullScreen'
  | 'screenShare'

interface VideoControlProps {
  size: string | number
  buttons: ButtonTypes[]
  startScreenShare?: () => Promise<boolean>
  stopScreenShare?: () => void
}

type ToggleFunction = (
  video: HTMLVideoElement,
  on: boolean,
  setOn: React.Dispatch<React.SetStateAction<boolean>>,
  startScreenShare?: () => Promise<boolean>,
  stopScreenShare?: () => void
) => void

let toggleMute: ToggleFunction = function (video, on, setOn) {
  ;(video.srcObject as MediaStream).getAudioTracks()[0].enabled = !on
  setOn((prev) => !prev)
}

let toggleVideo: ToggleFunction = function (video, on, setOn) {
  ;(video.srcObject as MediaStream).getVideoTracks()[0].enabled = !on
  setOn((prev) => !prev)
}

let togglePictureInPicture: ToggleFunction = function (video, on, setOn) {
  if (on) {
    ;(video as any).requestPictureInPicture().catch((err: Error) => alert(err))
    setOn((prev) => !prev)
    ;(video as any).addEventListener(
      'leavepictureinpicture',
      () => {
        setOn(true)
      },
      { once: true }
    )
  } else {
    ;(document as any).exitPictureInPicture().catch((err: Error) => alert(err))
    setOn((prev) => !prev)
  }
}

let toggleFullScreen: ToggleFunction = function (video, on, setOn) {
  if (on) {
    video.parentElement?.requestFullscreen()
    setOn((prev) => !prev)
    video.parentElement?.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        setOn(true)
      }
    })
  } else {
    document.exitFullscreen()
    setOn((prev) => !prev)
  }
}

let toggleScreenShare: ToggleFunction = async function (
  _,
  on,
  setOn,
  startScreenShare,
  stopScreenShare
) {
  if (on) {
    const success = await startScreenShare!()
    if (success) {
      setOn((prev) => !prev)
    }
  } else {
    stopScreenShare!()
    setOn((prev) => !prev)
  }
}

export default function VideoControls(props: VideoControlProps) {
  return (
    <HStack spacing={0} justify="space-evenly">
      {props.buttons.map((type, index) => {
        switch (type) {
          case 'mute':
            return (
              <ToggleIcon
                key={index}
                on={AiOutlineAudio}
                off={AiOutlineAudioMuted}
                size={props.size}
                fn={toggleMute}
                onLabel="mute"
                offLabel="unmute"
              />
            )
          case 'video':
            return (
              <ToggleIcon
                key={index}
                on={BiVideo}
                off={BiVideoOff}
                size={props.size}
                fn={toggleVideo}
                onLabel="turn video off"
                offLabel="turn video on"
              />
            )
          case 'speaker':
            return <VolumeIcon key={index} size={props.size} />
          case 'pictureInPicture':
            return (
              <ToggleIcon
                key={index}
                on={RiPictureInPicture2Line}
                off={RiPictureInPictureExitLine}
                size={props.size}
                fn={togglePictureInPicture}
                onLabel="picture in picture"
                offLabel="exit picture in picture"
              />
            )
          case 'fullScreen':
            if (HTMLElementContains('video', 'requestFullscreen')) {
              return (
                <ToggleIcon
                  key={index}
                  on={BiFullscreen}
                  off={BiExitFullscreen}
                  size={props.size}
                  fn={toggleFullScreen}
                  onLabel="fullscreen"
                  offLabel="exit fullscreen"
                />
              )
            } else {
              return null
            }

          case 'screenShare':
            if ((navigator.mediaDevices as any).getDisplayMedia) {
              return (
                <ToggleIcon
                  key={index}
                  on={FaRegShareSquare}
                  off={FaRegShareSquare}
                  size={props.size}
                  fn={toggleScreenShare}
                  onLabel="screen share"
                  offLabel="exit screen share"
                  startScreenShare={props.startScreenShare}
                  stopScreenShare={props.stopScreenShare}
                />
              )
            } else {
              return null
            }
        }
      })}
    </HStack>
  )
}

interface ToggleIconProps {
  on: IconType
  off: IconType
  size: string | number
  fn: ToggleFunction
  onLabel: string
  offLabel: string
  startScreenShare?: () => Promise<boolean>
  stopScreenShare?: () => void
}

function ToggleIcon(props: ToggleIconProps) {
  const [on, setOn] = useState(true)
  const spanRef = useRef<HTMLSpanElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (spanRef.current) {
      videoRef.current = spanRef.current?.parentElement?.parentElement
        ?.firstElementChild as HTMLVideoElement
    }
  }, [spanRef.current])

  const toggle = useCallback(() => {
    if (videoRef.current) {
      if (props.startScreenShare && props.stopScreenShare) {
        props.fn(
          videoRef.current,
          on,
          setOn,
          props.startScreenShare,
          props.stopScreenShare
        )
      } else {
        props.fn(videoRef.current, on, setOn)
      }
    }
  }, [on, props.fn])

  return (
    <Tooltip label={on ? props.onLabel : props.offLabel} placement="top">
      <span ref={spanRef}>
        <Icon
          as={on ? props.on : props.off}
          color={on ? 'currentcolor' : 'red.500'}
          boxSize={props.size}
          onClick={toggle}
        />
      </span>
    </Tooltip>
  )
}

interface VolumeIconProps {
  size: string | number
}

function VolumeIcon(props: VolumeIconProps) {
  const [volume, setVolume] = useState(100)
  const spanRef = useRef<HTMLSpanElement>(null)
  const [muted, setMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (spanRef.current) {
      videoRef.current = spanRef.current?.parentElement?.parentElement
        ?.firstElementChild as HTMLVideoElement
    }
  }, [spanRef.current])

  // control volume
  useEffect(() => {
    if (videoRef.current) {
      if (volume === 0) {
        setMuted(true)
      } else {
        setMuted(false)
        videoRef.current.volume = volume / 100
      }
    }
  }, [volume])

  // control mute/unmute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted
    }
  }, [muted])

  return (
    <Popover placement="top" gutter={0} variant="responsive" trigger="hover">
      <PopoverTrigger>
        <span ref={spanRef}>
          <Icon
            as={!muted ? BiVolumeFull : BiVolumeMute}
            color={!muted ? 'currentcolor' : 'red.500'}
            boxSize={props.size}
            onClick={() => {
              setMuted((prev) => !prev)
            }}
          />
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <Slider
            colorScheme={!muted ? 'blue' : ''}
            value={volume}
            orientation="vertical"
            minH="100px"
            mt={2}
            onChange={(value) => {
              setVolume(value)
            }}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
