import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Box, Button, Heading, HStack, Wrap, WrapItem } from '@chakra-ui/react'
import React from 'react'
import { RoomsQuery } from '../../generated/graphql'
import Card from '../shared/Card'
import NextLink from 'next/link'

interface RoomsProps {
  data: RoomsQuery
}

export default function Rooms(props: RoomsProps) {
  console.log(props.data)
  return (
    <>
      <Heading my={4}>Public Rooms</Heading>
      <Wrap justify="center">
        {props.data.rooms.map((room) => (
          <Room
            key={room.id}
            title={room.roomName}
            description={room.description}
            status={`${room.currentUsers}/${room.maxPeople}`}
            href={`/video-chat/room/${room.roomName}`}
          />
        ))}
      </Wrap>
    </>
  )
}

interface RoomProps {
  title: string
  description: string
  href: string
  status: string
}

function Room(props: RoomProps) {
  return (
    <WrapItem>
      <Card>
        <HStack justify="space-between">
          <Box fontWeight="bold">{props.title}</Box>
          <Box fontWeight="light">{props.status}</Box>
        </HStack>
        <Box my={1}>{props.description}</Box>
        <HStack justify="flex-end" my={1}>
          <NextLink href={props.href}>
            <Button my={1} as="a" colorScheme="blue">
              Join &nbsp; <ArrowForwardIcon />
            </Button>
          </NextLink>
        </HStack>
      </Card>
    </WrapItem>
  )
}
