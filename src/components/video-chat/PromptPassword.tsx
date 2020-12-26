import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import { Socket } from 'socket.io-client'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { UserSetting } from '../../pages/video-chat/room/[roomName]'
import { CustomInputField } from '../shared/InputFields'

interface PromptPasswordProps {
  isOpen: boolean
  onClose: () => void
  socketRef: React.MutableRefObject<Socket | null>
  roomName: string | string[] | undefined
  userSettingRef: React.MutableRefObject<UserSetting>
}

export default function PromptPassword({
  isOpen,
  onClose,
  socketRef,
  roomName,
  userSettingRef,
}: PromptPasswordProps) {
  const [loading, setLoading] = useState(false)
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Password Required</ModalHeader>
        <Formik
          initialValues={{
            password: '',
          }}
          validationSchema={Yup.object({
            password: Yup.string()
              .required('Required')
              .max(100, 'Max 100 characters'),
          })}
          onSubmit={async (values, actions) => {
            setLoading(true)
            console.log(values)
            socketRef.current?.emit(
              'join-room',
              roomName,
              userSettingRef.current,
              '',
              values.password
            )
            socketRef.current?.on('wrong-password', () => {
              actions.setFieldError('password', 'Wrong password')
              setLoading(false)
            })
            // try {
            //   const creatorKey = v4()
            //   localStorage.setItem('video-chat-creatorKey', creatorKey)
            //   await createRoom({
            //     variables: {
            //       userInput: { ...values, creatorKey: creatorKey },
            //     },
            //   })
            //   router.push(`/video-chat/room/${values.roomName}`)
            // } catch (error) {
            //   if (error.message.includes('duplicate key value')) {
            //     actions.setFieldError('roomName', 'This name is already taken')
            //   } else {
            //     alert(error.message)
            //   }
            //   actions.setSubmitting(false)
            // }
          }}
        >
          {(props) => (
            <Form>
              <ModalBody>
                <CustomInputField
                  name="password"
                  type="password"
                  label="Password"
                />
              </ModalBody>
              <ModalFooter>
                <Button isLoading={loading} type="submit">
                  Submit
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
}
