import { Avatar } from '@chakra-ui/avatar'
import { Box, Divider, Flex } from '@chakra-ui/layout'

export const Profile = () => {
  return (
    <>
      <Divider />
      <Flex my={2} alignItems="center">
        <Avatar mx="auto" size="2xl" name="Youngeon Lee" src="/profile.jpg" />
        <Box ml={3} mr="auto" fontSize="1.25rem">
          Hello, I'm Youngeon Lee. I will be sharing my side projects here, so
          feel free to check them out! My current interests are full-stack
          developement and data science. More projects coming!
        </Box>
      </Flex>
      <Divider />
    </>
  )
}
