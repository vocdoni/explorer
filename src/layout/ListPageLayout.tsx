import { Box, Flex, Heading, Text } from '@chakra-ui/react'
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
    <Flex direction={'column'} mt={'40px'} gap={6}>
      <Flex direction={{ base: 'column', md: 'row' }} justify={'space-between'}>
        <Flex direction={'column'}>
          <Heading isTruncated wordBreak='break-word'>
            {title}
          </Heading>
          {subtitle && <Text color={'lighterText'}>{subtitle}</Text>}
        </Flex>
        {rightComponent && <Box>{rightComponent}</Box>}
      </Flex>
      {children}
    </Flex>
  )
}

export default ListPageLayout
