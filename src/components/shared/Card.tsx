import { Box, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

export interface CardProps {
  children: React.ReactNode
}

export default function Card(props: CardProps) {
  const bg = useColorModeValue('gray.50', 'gray.700')
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      m={4}
      bg={bg}
    >
      <Box p="6">{props.children}</Box>
    </Box>
  )
}
