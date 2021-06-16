import { Box, Flex } from '@chakra-ui/layout'
import { Dispatch, SetStateAction, useState } from 'react'
import { range } from '../utils/functions'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  IconButton,
} from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'

type FamilyType = '남편' | '아내' | '아들' | '딸'
type Family = { id: string; type: FamilyType; age: number }[]

export default function Ruler() {
  const [currentAge, setCurrentAge] = useState(100)
  const [retireAge, setRetireAge] = useState(100)
  const [family, setFamily] = useState<Family>([])
  console.log(family)
  const [familyMemberAge, setFamilyMemberAge] = useState(100)
  const [familyMemberType, setFamilyMemberType] = useState<FamilyType>('남편')
  const lengths = [currentAge, retireAge - currentAge, 100 - retireAge]
  const longest = Math.max(...lengths)
  const tickW = 80 / longest
  return (
    <Box w="100vw" h="100vh">
      <Flex>
        <AgeInput state={currentAge} setState={setCurrentAge} min={1} />
        <AgeInput
          state={retireAge}
          setState={setRetireAge}
          min={currentAge + 1}
        />
      </Flex>
      <Flex>
        <Ticks
          start={1}
          end={currentAge + 1}
          setBreaks={() => {}}
          tickW={tickW}
        />
        <Box w="20vw" padding="1rem">
          <FamilyInput
            currentAge={currentAge}
            family={family}
            familyMemberAge={familyMemberAge}
            familyMemberType={familyMemberType}
            setFamily={setFamily}
            setFamilyMemberAge={setFamilyMemberAge}
            setFamilyMemberType={setFamilyMemberType}
          />
        </Box>
      </Flex>
      <Flex>
        <Ticks
          start={currentAge + 1}
          end={retireAge + 1}
          setBreaks={() => {}}
          tickW={tickW}
        />
        <Box w="20vw" padding="1rem">
          <FamilyInfo
            currentAge={currentAge}
            family={family}
            offset={retireAge - currentAge}
          />
        </Box>
      </Flex>
      <Ticks
        start={retireAge + 1}
        end={101}
        setBreaks={() => {}}
        tickW={tickW}
      />
    </Box>
  )
}

function AgeInput({
  state,
  setState,
  min,
  w,
}: {
  state: number
  setState: Dispatch<SetStateAction<number>>
  min: number
  w?: number | string
}) {
  return (
    <NumberInput
      w={w}
      min={min}
      max={99}
      value={state}
      onChange={(_, value) => setState(value)}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  )
}

function FamilyInput({
  currentAge,
  family,
  setFamily,
  familyMemberType,
  setFamilyMemberType,
  familyMemberAge,
  setFamilyMemberAge,
}: {
  currentAge: number
  family: Family
  setFamily: Dispatch<SetStateAction<Family>>
  familyMemberType: FamilyType
  setFamilyMemberType: Dispatch<SetStateAction<FamilyType>>
  familyMemberAge: number
  setFamilyMemberAge: Dispatch<SetStateAction<number>>
}) {
  return (
    <Box>
      <FamilyInfo
        input
        currentAge={currentAge}
        family={family}
        setFamily={setFamily}
      />
      <Flex alignItems="center">
        <Select
          w="5rem"
          size="sm"
          value={familyMemberType}
          onChange={(e) => setFamilyMemberType(e.target.value as FamilyType)}
        >
          <option value="남편">남편</option>
          <option value="아내">아내</option>
          <option value="아들">아들</option>
          <option value="딸">딸</option>
        </Select>
        <AgeInput
          w="5rem"
          min={1}
          state={familyMemberAge}
          setState={setFamilyMemberAge}
        />
        <IconButton
          aria-label="add family member"
          icon={<AddIcon />}
          onClick={() =>
            setFamily((prev) => [
              ...prev,
              {
                id: Math.random().toString(),
                type: familyMemberType,
                age: familyMemberAge,
              },
            ])
          }
        />
      </Flex>
    </Box>
  )
}

function FamilyInfo({
  currentAge,
  family,
  setFamily,
  input,
  offset = 0,
}: {
  currentAge: number
  family: Family
  setFamily?: Dispatch<SetStateAction<Family>>
  input?: boolean
  offset?: number
}) {
  return (
    <Box>
      <Box>나: {currentAge + offset}세</Box>
      {family.map(({ id, type, age }) => (
        <Flex key={id}>
          <Box>{`${type}: ${age + offset}세`}</Box>
          {input ? (
            <IconButton
              marginX="0.3rem"
              size="1rem"
              aria-label="remove family member"
              icon={<MinusIcon />}
              onClick={() =>
                setFamily!((prev) => prev.filter((value) => value.id !== id))
              }
            />
          ) : null}
        </Flex>
      ))}
    </Box>
  )
}

function Ticks({
  start,
  end,
  setBreaks,
  tickW,
}: {
  start: number
  end: number
  setBreaks: Dispatch<SetStateAction<number[]>>
  tickW: number
}) {
  return (
    <Flex paddingY="2rem">
      {range(start, end).map((value) => (
        <Tick
          tick={value}
          key={`tick${value}`}
          setBreaks={setBreaks}
          tickW={tickW}
        />
      ))}
    </Flex>
  )
}

function Tick({
  tick,
  setBreaks,
  tickW,
}: {
  tick: number
  setBreaks: Dispatch<SetStateAction<number[]>>
  tickW: number
}) {
  return (
    <Flex
      width={`${tickW}vw`}
      bg="green.400"
      height="4rem"
      right={`${tickW}vw"`}
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-end"
      zIndex={tick % 5 === 0 ? 2 : 1}
    >
      {tick % 5 === 0 ? (
        <Box textColor="white" position="relative">
          {tick}
        </Box>
      ) : null}
      <Box
        bg="white"
        width="0.15vw"
        height={tick % 5 === 0 ? '2rem' : '1.5rem'}
        onClick={() => setBreaks((prev) => [...prev, tick].sort())}
      />
    </Flex>
  )
}
