import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Box, Button, Heading, HStack, Wrap, WrapItem } from '@chakra-ui/react'
import React from 'react'
import Card from './shared/Card'
import NextLink from 'next/link'

export default function Projects() {
  return (
    <>
      <Heading ml={32} my={4}>
        Projects
      </Heading>
      <Wrap justify="center">
        <Project
          title="Video Chat"
          description="Supports: Group Call | Screen Sharing | Text Chat"
          href="/video-chat"
        />
      </Wrap>
    </>
  )
}

interface ProjectProps {
  title: string
  description: string
  href: string
}

function Project(props: ProjectProps) {
  return (
    <WrapItem>
      <Card>
        <Box my={1} fontWeight="semibold" as="h4">
          {props.title}
        </Box>
        <Box my={1}>{props.description}</Box>
        <HStack justify="flex-end" my={1}>
          <NextLink href={props.href}>
            <Button as="a">
              More &nbsp; <ArrowForwardIcon />
            </Button>
          </NextLink>
        </HStack>
      </Card>
    </WrapItem>
  )
}