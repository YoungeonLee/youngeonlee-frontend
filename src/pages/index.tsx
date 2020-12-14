import { Heading, Container } from '@chakra-ui/react'
import Projects from '../components/Projects'
import { DarkModeSwitch } from '../components/shared/DarkModeSwitch'

export default function Index() {
  return (
    <>
      <Container maxW="lg">
        <Heading textAlign="center" my={8} size="2xl">
          Welcome to my website!
        </Heading>
        <Projects />
      </Container>
      <DarkModeSwitch />
    </>
  )
}
