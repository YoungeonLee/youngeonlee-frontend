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
  RadioGroup,
  Radio,
  Switch,
  Textarea,
} from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import Draggable from 'react-draggable'

type FamilyType = '남편' | '아내' | '아들' | '딸'
type Family = { id: string; type: FamilyType; age: number }[]

const yearlyNeededMoney = 3600

export default function Ruler() {
  const [currentAge, setCurrentAge] = useState(100)
  const [retireAge, setRetireAge] = useState(100)
  const [family, setFamily] = useState<Family>([])
  const [selected, setSelected] = useState('me')
  const [show, setShow] = useState(false)
  let myAgeAtRetire: number
  if (selected === 'me') {
    myAgeAtRetire = retireAge
  } else {
    const moneyMaker = family.find(({ id }) => id === selected)!
    const timeUntilRetire = retireAge - moneyMaker.age
    myAgeAtRetire = currentAge + timeUntilRetire
  }
  // const myAgeAtRetire = selected === 'me' ? retireAge : currentAge + family.find(({id})=>id === selected)
  const [familyMemberAge, setFamilyMemberAge] = useState(100)
  const [familyMemberType, setFamilyMemberType] = useState<FamilyType>('남편')
  const lengths = [currentAge, myAgeAtRetire - currentAge, 100 - myAgeAtRetire]
  const longest = Math.max(...lengths)
  const tickW = 80 / longest
  const thridLength = 100 - myAgeAtRetire
  const formComplete = currentAge !== 100 && retireAge !== 100
  return (
    <Box w="100vw" h="100vh" fontWeight={600}>
      <Flex alignItems="center">
        <AgeInput
          state={currentAge}
          setState={setCurrentAge}
          min={1}
          label="현재 나이"
          w="5rem"
        />
        <AgeInput
          state={retireAge}
          setState={setRetireAge}
          min={currentAge + 1}
          label="퇴직 나이"
          w="5rem"
        />
        <Switch onChange={() => setShow((prev) => !prev)} />
      </Flex>
      <Flex>
        <Ticks
          start={1}
          end={currentAge + 1}
          setBreaks={() => {}}
          tickW={tickW}
        />
        <Box position="relative">
          <Box padding="1rem" position="absolute">
            <FamilyInput
              selected={selected}
              setSelected={setSelected}
              currentAge={currentAge}
              family={family}
              familyMemberAge={familyMemberAge}
              familyMemberType={familyMemberType}
              setFamily={setFamily}
              setFamilyMemberAge={setFamilyMemberAge}
              setFamilyMemberType={setFamilyMemberType}
            />
          </Box>
        </Box>
      </Flex>
      <Flex>
        <Ticks
          start={currentAge + 1}
          end={myAgeAtRetire + 1}
          setBreaks={() => {}}
          tickW={tickW}
        />
        <Box position="relative">
          <Box padding="1rem" position="absolute">
            {formComplete ? (
              <FamilyInfo
                currentAge={currentAge}
                family={family}
                offset={myAgeAtRetire - currentAge}
              />
            ) : null}
          </Box>
        </Box>
      </Flex>
      <Flex>
        <Ticks
          start={myAgeAtRetire + 1}
          end={101}
          setBreaks={() => {}}
          tickW={tickW}
        />
        {formComplete ? (
          <Box whiteSpace="pre-line" padding="1rem">
            {`수입없이 살아야 할 남은기간: ${thridLength}년
        1년 ${yearlyNeededMoney} x ${thridLength}년 = ${moneyNeededForYears(
              thridLength
            )}
        ${
          show
            ? `1년 ${yearlyNeededMoney} x ${
                thridLength + 20
              }년 = ${moneyNeededForYears(thridLength + 20)}`
            : ''
        }`}
          </Box>
        ) : null}
      </Flex>
      <Flex display={show ? 'flex' : 'none'}>
        <Box whiteSpace="pre-line" padding="1rem">
          {futureTexts}
        </Box>
        <Box position="relative">
          <Box position="absolute">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/BMnsvH_BBBU"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </Box>
      </Flex>
      <Draggable handle=".handle">
        <Flex padding="1rem">
          <Box className="handle" bg="red.400" w="1rem" borderRadius={5} />
          <Textarea resize="both" w="10rem" h="10rem" borderColor="red.400" />
        </Flex>
      </Draggable>
    </Box>
  )
}

function AgeInput({
  state,
  setState,
  min,
  w,
  label,
}: {
  state: number
  setState: Dispatch<SetStateAction<number>>
  min: number
  label?: string
  w?: number | string
}) {
  return (
    <Flex alignItems="center" padding="1rem">
      <Box marginRight="1rem">{label}</Box>
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
    </Flex>
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
  selected,
  setSelected,
}: {
  currentAge: number
  family: Family
  setFamily: Dispatch<SetStateAction<Family>>
  familyMemberType: FamilyType
  setFamilyMemberType: Dispatch<SetStateAction<FamilyType>>
  familyMemberAge: number
  setFamilyMemberAge: Dispatch<SetStateAction<number>>
  selected: string
  setSelected: Dispatch<SetStateAction<string>>
}) {
  return (
    <Box>
      <FamilyInfo
        selected={selected}
        setSelected={setSelected}
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
  selected,
  setSelected,
  offset = 0,
}: {
  currentAge: number
  family: Family
  setFamily?: Dispatch<SetStateAction<Family>>
  selected?: string
  setSelected?: Dispatch<SetStateAction<string>>
  offset?: number
}) {
  const myAge = `나: ${currentAge + offset}세`
  return (
    <Box>
      <RadioGroup onChange={setSelected} value={selected}>
        <Box>{selected ? <Radio value="me">{myAge}</Radio> : myAge}</Box>
        {family.map(({ id, type, age }) => (
          <Flex key={id}>
            {selected ? (
              <Radio value={id}>{`${type}: ${age + offset}세`}</Radio>
            ) : (
              `${type}: ${age + offset}세`
            )}
            {setFamily ? (
              <IconButton
                marginX="0.3rem"
                size="1rem"
                aria-label="remove family member"
                icon={<MinusIcon />}
                onClick={() =>
                  setFamily((prev) => prev.filter((value) => value.id !== id))
                }
              />
            ) : null}
          </Flex>
        ))}
      </RadioGroup>
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
      bg={computeColor(tick)}
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

const computeColor = (tick: number) => {
  if (tick < 11) {
    return 'green.300'
  } else if (tick < 21) {
    return 'green.500'
  } else if (tick < 31) {
    return 'green.700'
  } else if (tick < 41) {
    return 'yellow.400'
  } else if (tick < 51) {
    return 'orange.300'
  } else if (tick < 61) {
    return 'orange.600'
  } else if (tick < 71) {
    return 'yellow.800'
  } else if (tick < 81) {
    return 'yellow.600'
  } else if (tick < 91) {
    return 'pink.700'
  } else {
    return 'purple.300'
  }
}

const futureTexts = `미래수업 => 평균수명 120세 시대가 온다
미래학자 안네리세키에르: 2030년
유전학자 스티브 호바스: 2050년
레이커즈와일: 2045년`

const moneyNeededForYears = (years: number) => {
  const money = (years * yearlyNeededMoney).toString()
  return `${money.slice(0, -4)}억 ${money.slice(-4)}`
}
