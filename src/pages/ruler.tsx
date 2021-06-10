import { Box, Flex } from '@chakra-ui/layout'
import { Dispatch, SetStateAction, useState } from 'react'
import { range } from '../utils/functions'

export default function Ruler() {
  const [breaks, setBreaks] = useState<number[]>([])
  // const ranges = breaks.reduce((prev, curr)=>[...prev, [prev[-1][-1], curr]], [] as number[][])
  const ranges = [1, ...breaks, 101]
  return (
    <Box
      bg="gray.900"
      w="100vw"
      h="100vh"
      justifyContent="center"
      overflow="scroll"
    >
      {ranges.map((_, index) => {
        if (index === ranges.length - 1) {
          return null
        } else {
          const start = ranges[index]
          const end = ranges[index + 1]
          return (
            <Ticks
              start={start}
              end={end}
              setBreaks={setBreaks}
              key={`ticks${start}-${end}`}
            />
          )
        }
      })}
    </Box>
  )
}

function Ticks({
  start,
  end,
  setBreaks,
}: {
  start: number
  end: number
  setBreaks: Dispatch<SetStateAction<number[]>>
}) {
  return (
    <Flex paddingY="1rem">
      {range(start, end).map((value) => (
        <Tick tick={value} key={`tick${value}`} setBreaks={setBreaks} />
      ))}
    </Flex>
  )
}

function Tick({
  tick,
  setBreaks,
}: {
  tick: number
  setBreaks: Dispatch<SetStateAction<number[]>>
}) {
  return (
    <Flex
      width="1vw"
      bg="green.400"
      height="6rem"
      right="1vw"
      zIndex={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-end"
    >
      {/* <Box textColor="white">{tick}</Box> */}
      <Box
        bg="white"
        width="0.1vw"
        height="2.75rem"
        onClick={() => setBreaks((prev) => [...prev, tick].sort())}
      />
    </Flex>
  )
}
