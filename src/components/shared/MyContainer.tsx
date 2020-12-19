import { BoxProps, Box } from '@chakra-ui/react'

export const MyContainer = (props: BoxProps) => {
  const { maxW = 'lg', ...restProps } = props
  return <Box maxW={maxW} {...restProps} />
}
