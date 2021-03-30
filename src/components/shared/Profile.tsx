import { Avatar } from '@chakra-ui/avatar'
import { Box, Divider } from '@chakra-ui/layout'

export const Profile = () => {
  return (
    <>
      <Divider />
      <Box>
        <Avatar mx="auto" size="2xl" name="Youngeon Lee" src="/profile.jpg" />
      </Box>
      <Divider />
    </>
  )
}
