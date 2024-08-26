import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react'
import { keepPreviousData } from '@tanstack/react-query'
import { FetchElectionsParameters } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { InputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'
import { useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { useProcessList } from '~queries/processes'
import useQueryParams from '~src/router/use-query-params'
import { isEmpty } from '~utils/objects'
import { ElectionCard } from './Card'
import { LuListFilter } from 'react-icons/lu'
import { isValidPartialProcessId } from '~utils/strings'
import { useState } from 'react'

type FilterQueryParams = {
  [K in keyof Omit<FetchElectionsParameters, 'organizationId'>]: string
}

const PopoverFilter = () => {
  const { queryParams, getNewParams } = useQueryParams<FilterQueryParams>()
  const { setPage } = useRoutedPagination()

  const setFilters = (filters: Partial<FilterQueryParams>) => {
    setPage(1, `?${getNewParams(filters).toString()}`)
  }

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton aria-label='TODO' icon={<LuListFilter />} />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <Flex direction={'column'}>
            <Checkbox
              isChecked={queryParams.withResults === 'true'}
              onChange={(e) => setFilters({ ...queryParams, withResults: e.target.checked ? 'true' : undefined })}
            >
              <Trans i18nKey='process.show_with_results'>Show only processes with results</Trans>
            </Checkbox>
            <Checkbox
              isChecked={queryParams.finalResults === 'true'}
              onChange={(e) => setFilters({ ...queryParams, finalResults: e.target.checked ? 'true' : undefined })}
            >
              <Trans i18nKey='process.final_results'>Final results</Trans>
            </Checkbox>
            <Checkbox
              isChecked={queryParams.manuallyEnded === 'true'}
              onChange={(e) => setFilters({ ...queryParams, manuallyEnded: e.target.checked ? 'true' : undefined })}
            >
              <Trans i18nKey='process.manually_ended'>Manually ended</Trans>
            </Checkbox>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export const ProcessSearchBox = () => {
  const { t } = useTranslation()
  const [isInvalid, setIsInvalid] = useState(false)

  const { queryParams, getNewParams } = useQueryParams<FilterQueryParams>()
  const { setPage } = useRoutedPagination()

  const setFilters = (filters: Partial<FilterQueryParams>) => {
    setPage(1, `?${getNewParams(filters).toString()}`)
  }

  return (
    <FormControl isInvalid={isInvalid}>
      <Flex direction={{ base: 'column', lg: 'row' }} flexDirection={{ base: 'column', md: 'row' }} gap={4}>
        <PopoverFilter />
        <Flex direction={'column'}>
          <InputSearch
            maxW={'300px'}
            placeholder={t('process.search_by')}
            onChange={(value: string) => {
              const isInvalid = value !== '' && !isValidPartialProcessId(value)
              setIsInvalid(isInvalid)
              if (!isInvalid) {
                setFilters({ ...queryParams, electionId: value })
              }
            }}
            initialValue={queryParams.electionId}
            debounceTime={500}
            isInvalid={isInvalid}
          />
          <Box minHeight='25px'>{isInvalid && <FormErrorMessage>Not valid partial process id</FormErrorMessage>}</Box>
        </Flex>
      </Flex>
    </FormControl>
  )
}

export const ProcessByTypeFilter = () => {
  const { t } = useTranslation()
  const { queryParams, getNewParams } = useQueryParams<FilterQueryParams>()
  const { setPage } = useRoutedPagination()

  const setFilters = (filters: Partial<FilterQueryParams>) => {
    setPage(1, `?${getNewParams(filters).toString()}`)
  }

  const currentStatus = queryParams.status

  const processStatusFilters = [
    {
      label: t('process.by_status_all'),
      value: undefined,
    },
    {
      label: t('process.by_status_all_active'),
      value: 'READY',
    },
    {
      label: t('process.by_status_paused'),
      value: 'PAUSED',
    },
    {
      label: t('process.by_status_ended'),
      value: 'ENDED',
    },
  ]

  return (
    <Flex align={'center'} justify={'center'} gap={4} wrap={'wrap'}>
      {processStatusFilters.map((filter, i) => (
        <Button
          flex={{ base: 'none', md: '1' }}
          key={i}
          onClick={() => setFilters({ ...queryParams, status: filter.value })}
          variant={currentStatus !== filter.value ? 'solid' : 'outline'}
        >
          {filter.label}
        </Button>
      ))}
    </Flex>
  )
}

export const ProcessList = () => {
  const { page }: { page?: number } = useRoutedPagination()
  const { queryParams: processFilters } = useQueryParams<FilterQueryParams>()

  const { data, isLoading, isFetching, isError, error } = useProcessList({
    filters: {
      electionId: processFilters.electionId, // electionId contains also the organizationId, so this is enough to find by partial orgId or electionId
      status: processFilters.status as FetchElectionsParameters['status'],
      withResults: processFilters.withResults ? processFilters.withResults === 'true' : undefined,
      finalResults: processFilters.finalResults ? processFilters.finalResults === 'true' : undefined,
      manuallyEnded: processFilters.manuallyEnded ? processFilters.manuallyEnded === 'true' : undefined,
      page: Number(page || 0),
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })

  if (isLoading || (isFetching && !isEmpty(processFilters))) {
    return <LoadingCards spacing={4} pl={4} skeletonHeight={4} />
  }

  if (data?.pagination.totalItems === 0) {
    return <NoResultsError />
  }

  if (!data || isError) {
    return <ContentError error={error} />
  }

  return (
    <>
      {data?.elections.map((election, i) => <ElectionCard key={i} id={election.id} election={election} />)}
      <RoutedPagination pagination={data.pagination} />
    </>
  )
}
