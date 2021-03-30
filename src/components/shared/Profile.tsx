import { Avatar } from '@chakra-ui/avatar'
import { Box, Divider } from '@chakra-ui/layout'

export const Profile = () => {
  return (
    <>
      <Divider />
      <Box my={1}>
        <Avatar mx="auto" size="2xl" name="Youngeon Lee" src="/profile.jpg" />
        <Box mx="auto">
          Hello, I'm Youngeon Lee. I will be sharing my side projects here, so
          feel free to check them out! My current interests are full-stack
          developement and data science.
        </Box>
      </Box>
      <Divider />
    </>
  )
}
