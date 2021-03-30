import { Avatar } from '@chakra-ui/avatar'
import { Box } from '@chakra-ui/layout'
import Image from 'next/image'

export const Profile = () => {
  return (
    <Box mx="auto">
      <Image src="/profile-picture.jpg" alt="me" width="64" height="64" />
      <Avatar size="2xl" name="Segun Adebayo" src="/profile-picture.jpg" />
    </Box>
  )
}
