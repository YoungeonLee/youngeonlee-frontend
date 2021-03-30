import { Heading, Container } from '@chakra-ui/react'
import Projects from '../components/Projects'
import { DarkModeSwitch } from '../components/shared/DarkModeSwitch'
import { Profile } from '../components/shared/Profile'

export default function Index() {
  return (
    <>
      <Container>
        <Heading textAlign="center" my={8} size="2xl">
          Welcome to my website!
        </Heading>
        <Profile />
        <Projects />
      </Container>
      <DarkModeSwitch />
    </>
  )
}
