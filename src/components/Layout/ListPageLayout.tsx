import { Flex, Heading, Text } from '@chakra-ui/react'
import { PropsWithChildren, ReactNode } from 'react'

const ListPageLayout = ({
  title,
  subtitle,
  rightComponent,
  children,
}: {
  title: string
  subtitle?: string
  rightComponent?: ReactNode
} & PropsWithChildren) => {
  return (
    <Flex direction='column' mt={10} gap={6}>
      <Flex direction={{ base: 'column', md: 'row' }} justify='space-between' gap={4}>
        <Flex direction='column'>
          <Heading isTruncated wordBreak='break-word'>
            {title}
          </Heading>
          {subtitle && <Text color='lighterText'>{subtitle}</Text>}
        </Flex>
        {rightComponent && (
          <Flex align='end' justify='end'>
            {rightComponent}
          </Flex>
        )}
      </Flex>
      <Flex gap={6} flexDir='column'>
        {children}
      </Flex>
    </Flex>
  )
}

export default ListPageLayout
