import { Box, Input, useColorModeValue } from '@chakra-ui/react'
import { KeyboardEvent } from 'react'

interface ChatInputProps {
  submit: (e: KeyboardEvent<HTMLInputElement>) => void
}

export default function ChatInput(props: ChatInputProps) {
  const bg = useColorModeValue('white', 'gray.800')
  return (
    <Box w="full" p={4}>
      <Input placeholder="Type here" bg={bg} onKeyDown={props.submit} />
    </Box>
  )
}
