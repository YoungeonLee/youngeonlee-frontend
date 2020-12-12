import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
} from '@chakra-ui/react'
import { ErrorMessage, FieldHookConfig, useField } from 'formik'

type CustomInputFieldProps = FieldHookConfig<any> & {
  label: string
  isDisable?: boolean
  hide?: boolean
  min?: number
}

export function CustomInputField({ label, ...props }: CustomInputFieldProps) {
  const [field, meta] = useField(props)
  return (
    <FormControl
      isInvalid={(meta.error && meta.touched) as boolean}
      hidden={props.hide}
    >
      <FormLabel htmlFor={props.name}>{label}</FormLabel>
      <Input {...field} type={props.type} id={props.name} placeholder={label} />
      <ErrorMessage component={FormErrorMessage} name={props.name} />
    </FormControl>
  )
}

export function CustomSwitchField({ label, ...props }: CustomInputFieldProps) {
  const [field, meta] = useField(props)
  console.log(field)
  return (
    <FormControl isInvalid={(meta.error && meta.touched) as boolean}>
      <FormLabel htmlFor={props.name}>{label}</FormLabel>
      <Switch {...field} id={props.name} />
      <ErrorMessage component={FormErrorMessage} name={props.name} />
    </FormControl>
  )
}

export function CustomNumberInputField({
  label,
  ...props
}: CustomInputFieldProps) {
  const [field, meta, helpers] = useField<number>(props)
  // console.log(field)
  // console.log(meta)
  // console.log(helpers)
  // console.log(props)
  return (
    <FormControl isInvalid={(meta.error && meta.touched) as boolean}>
      <FormLabel htmlFor={props.name}>{label}</FormLabel>
      <NumberInput
        {...field}
        id={props.name}
        onChange={(_, value) => helpers.setValue(value)}
        min={props.min}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <ErrorMessage component={FormErrorMessage} name={props.name} />
    </FormControl>
  )
}
