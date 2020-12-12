import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import React from 'react'
import * as Yup from 'yup'
import { useCreateRoomMutation } from '../../generated/graphql'
import {
  CustomInputField,
  CustomNumberInputField,
  CustomSwitchField,
} from './InputFields'
import { v4 } from 'uuid'

export default function CreateRoomForm() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [createRoom] = useCreateRoomMutation()
  const router = useRouter()
  return (
    <>
      <Button onClick={onOpen}>Create Room</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Room</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              roomName: '',
              description: '',
              maxPeople: 4,
              private: false,
              password: '',
            }}
            validationSchema={Yup.object({
              roomName: Yup.string()
                .max(15, 'Max 15 characters')
                .required('Required'),
              description: Yup.string().max(300, 'Max 300 characters'),
              maxPeople: Yup.number()
                .min(2, 'At least two people required')
                .max(5, 'Maximum 5 people')
                .required('Required'),
              private: Yup.boolean().required('Required'),
              password: Yup.string()
                .max(100, 'Max 100 characters')
                .when('private', {
                  is: true,
                  then: Yup.string().required('Required when private'),
                }),
            })}
            onSubmit={async (values, actions) => {
              console.log(values)

              try {
                const creatorKey = v4()
                localStorage.setItem('video-chat-creatorKey', creatorKey)
                await createRoom({
                  variables: {
                    userInput: { ...values, creatorKey: creatorKey },
                  },
                })
                router.push(`/video-chat/room/${values.roomName}`)
              } catch (error) {
                if (error.message.includes('duplicate key value')) {
                  actions.setFieldError(
                    'roomName',
                    'This name is already taken'
                  )
                } else {
                  alert(error.message)
                }
                actions.setSubmitting(false)
              }
            }}
          >
            {(props) => (
              <Form>
                <ModalBody>
                  <CustomInputField
                    name="roomName"
                    type="text"
                    label="Room Name"
                  />
                  <CustomInputField
                    name="description"
                    type="text"
                    label="Description"
                  />
                  <CustomNumberInputField
                    name="maxPeople"
                    type="number"
                    label="Max People"
                    min={2}
                  />
                  <CustomSwitchField
                    name="private"
                    type="checkbox"
                    label="Private"
                  />
                  <CustomInputField
                    name="password"
                    type="password"
                    label="Password"
                    hide={!props.values.private}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button isLoading={props.isSubmitting} type="submit">
                    Submit
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  )
}
