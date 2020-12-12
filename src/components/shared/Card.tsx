import { Box } from '@chakra-ui/react'
import React from 'react'

export interface CardProps {
  children: React.ReactNode
}

export default function Card(props: CardProps) {
  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" m={4}>
      <Box p="6">{props.children}</Box>
    </Box>
  )
}
