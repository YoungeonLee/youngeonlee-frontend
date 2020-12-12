import { Box, Input } from '@chakra-ui/react'
import { KeyboardEvent } from 'react'

interface ChatInputProps {
  submit: (e: KeyboardEvent<HTMLInputElement>) => void
}

export default function ChatInput(props: ChatInputProps) {
  return (
    <Box w="full" p={4}>
      <Input placeholder="Type here" bg="white" onKeyDown={props.submit} />
    </Box>
  )
}
