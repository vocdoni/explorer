import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonText,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { IconType } from 'react-icons'
import { RawModal } from '~components/Layout/ShowRawButton'
import { ContentError, ContentErrorType } from '~components/Layout/ContentError'
import { useTranslation } from 'react-i18next/index'
import { useChainCosts } from '~queries/stats'
import { Icons } from '~src/theme/components/Icons'
import { IoIosPricetag } from 'react-icons/io'

interface StatisticsCardProps {
  title: string
  icon: IconType
  raw?: object
  link?: string
  isLoading?: boolean
  isError?: boolean
  error?: ContentErrorType
}

export const StatsCardWrapper = ({
  title,
  icon,
  raw,
  children,
  isLoading,
  isError,
  error,
  ...rest
}: StatisticsCardProps & PropsWithChildren & CardProps) => {
  return (
    <Card flex='1' w={'full'} {...rest}>
      <CardHeader pb={0} display='flex' gap={3} alignItems='center' justifyContent={'space-between'} flexDir='row'>
        <HStack spacing={3}>
          <Icon color='textAccent1' fontSize='2xl' as={icon} />
          <Text>{title}</Text>
        </HStack>
        {!!raw && <RawModal color={'lightText'} fontSize={'xs'} obj={raw} />}
      </CardHeader>
      <CardBody>
        <CardBodyWrapper error={error} isError={isError} isLoading={isLoading}>
          {children}
        </CardBodyWrapper>
      </CardBody>
    </Card>
  )
}

export const StatsModalWrapper = ({
  title,
  icon,
  link,
  children,
  raw,
  error,
  isError,
  isLoading,
}: StatisticsCardProps & PropsWithChildren) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <IconButton
        variant={'text'}
        onClick={onOpen}
        icon={<Icon as={Icons.InfoIcon} boxSize={5} />}
        aria-label={'info'}
        height={1}
        minW={2}
        w={1}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Icon color='textAccent1' fontSize='2xl' as={icon} />
              <Text>{title}</Text>
              {link && (
                <Box as={Link} href={link} isExternal>
                  <Icon boxSize={4} as={Icons.ExternalIcon} />
                </Box>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CardBodyWrapper error={error} isError={isError} isLoading={isLoading}>
              {children}
            </CardBodyWrapper>
          </ModalBody>
          <ModalFooter>
            {raw && (
              <Box pr={4}>
                <RawModal obj={raw} />
              </Box>
            )}
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const CardBodyWrapper = ({
  isLoading,
  isError,
  error,
  children,
}: Pick<StatisticsCardProps, 'isLoading' | 'isError' | 'error'> & PropsWithChildren) => {
  if (isLoading) {
    return <SkeletonText noOfLines={3} spacing={3} skeletonHeight={3} py={2} />
  }
  if (isError) {
    return <ContentError error={error} />
  }
  return (
    <Flex h={'full'} direction={'column'} justify={'space-between'}>
      {children}
    </Flex>
  )
}
