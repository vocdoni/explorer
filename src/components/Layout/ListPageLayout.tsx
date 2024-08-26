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
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify='space-between'
        gap={4}
        align={{ base: 'center', lg: 'start' }}
      >
        <Flex direction='column' textAlign={{ base: 'center', md: 'start' }}>
          <Heading isTruncated wordBreak='break-word'>
            {title}
          </Heading>
          {subtitle && <Text color='lighterText'>{subtitle}</Text>}
        </Flex>
        {rightComponent && (
          <Flex mt={{ base: 0, md: 4 }} align='center' justify={{ base: 'center', md: 'end' }}>
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
