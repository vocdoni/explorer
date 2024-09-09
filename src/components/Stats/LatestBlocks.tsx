import { Flex } from '@chakra-ui/react'
import { keepPreviousData } from '@tanstack/react-query'
import { BlockCard } from '~components/Blocks/BlockCard'
import { PaginatedAsyncList } from '~components/Layout/AsyncList'
import { useBlockList } from '~queries/blocks'

export const LatestBlocks = () => {
  const blockListSize = 3

  const { data, isLoading, error, isError } = useBlockList({
    params: {
      page: 0,
      limit: blockListSize,
    },
    placeholderData: keepPreviousData,
  })

  return (
    <Flex direction={'column'} gap={7}>
      <PaginatedAsyncList
        isLoading={isLoading}
        elements={data?.blocks}
        isError={isError}
        error={error}
        component={({ element }) => <BlockCard block={element} />}
        skeletonProps={{ length: blockListSize }}
      />
    </Flex>
  )
}
