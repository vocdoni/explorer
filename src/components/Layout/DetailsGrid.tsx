import { Flex, Grid, GridItem, GridProps, Text } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import Hint from '~components/Layout/Hint'

export type GridItemProps = { label: string; info?: string; isNumber?: boolean } & PropsWithChildren

/**
 * Util component used to render a grid of details with its label
 * @param details String label, and the component that should render on the grid
 * @constructor
 */
export const DetailsGrid = ({ details, ...rest }: { details: GridItemProps[] } & GridProps) => {
  return (
    <Grid templateColumns={{ base: '1fr', sm: '1fr 4fr' }} columnGap={3} rowGap={2} {...rest}>
      {details.map(({ children, ...rest }, key) => (
        <DetailRow key={key} {...rest}>
          {children}
        </DetailRow>
      ))}
    </Grid>
  )
}

const DetailRow = ({ label, info, isNumber, children }: GridItemProps) => {
  return (
    <>
      <GridItem py={1} lineHeight={{ base: 5, lg: 6 }}>
        <Flex columnGap={2} alignItems='flex-start'>
          {info && <Hint label={info} isLoading={false} my={{ lg: '2px' }} />}
          <Text my={{ lg: '2px' }} lineHeight={{ base: 5, lg: 6 }} align={'left'}>
            {label}
          </Text>
        </Flex>
      </GridItem>
      <GridItem
        display='flex'
        alignItems='center'
        flexWrap='wrap'
        rowGap={3}
        pl={{ base: 7, lg: 0 }}
        py={1}
        lineHeight={{ base: 5, lg: 6 }}
        whiteSpace='nowrap'
        justifyContent={isNumber ? 'end' : 'start'}
      >
        {children}
      </GridItem>
    </>
  )
}
