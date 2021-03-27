import { Heading, Container, Center, Text } from '@chakra-ui/react'
import { DarkModeSwitch } from '../../components/shared/DarkModeSwitch'
import CreateRoomForm from '../../components/video-chat/CreateRoomForm'
import Rooms from '../../components/video-chat/Rooms'
import { useRoomsQuery } from '../../generated/graphql'
import { RoomsQuery } from '../../generated/graphql'
import useHasMounted from '../../utils/useHasMounted'

export default function VideoChat() {
  const { loading, error, data } = useRoomsQuery()
  if (!useHasMounted()) return null
  if (loading)
    return (
      <Text my="auto" textAlign="center">
        Loading...
      </Text>
    )
  if (error) {
    console.log(error)
    return (
      <Text my="auto" textAlign="center">
        Error!
      </Text>
    )
  }
  // console.log(data)

  return (
    <>
      <Container maxW="lg">
        <Heading textAlign="center" my={8} size="2xl">
          Video Chat
        </Heading>
        <Center>
          <CreateRoomForm />
        </Center>
        <Rooms data={data as RoomsQuery} />
      </Container>
      <DarkModeSwitch />
    </>
  )
}
