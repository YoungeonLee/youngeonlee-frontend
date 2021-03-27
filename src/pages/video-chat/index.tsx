import { Heading, Container, Center, Flex } from '@chakra-ui/react'
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
      <Flex justify="center" align="center" height="100vh">
        Loading...
      </Flex>
    )
  if (error) {
    console.log(error)
    return (
      <Flex justify="center" align="center" height="100vh">
        Loading...
      </Flex>
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
