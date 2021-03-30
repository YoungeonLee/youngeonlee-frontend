import { Avatar } from '@chakra-ui/avatar'
import { Box } from '@chakra-ui/layout'

export const Profile = () => {
  return (
    <Box mx="auto">
      <Avatar size="2xl" name="Youngeon Lee" src="/profile.jpg" />
    </Box>
  )
}
