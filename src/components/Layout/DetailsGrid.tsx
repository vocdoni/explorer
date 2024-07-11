import { Grid, GridItem, Text } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export type GridItemProps = { label: string } & PropsWithChildren

/**
 * Util component used to render a grid of details with its label
 * @param details String label, and the component that should render on the grid
 * @constructor
 */
export const DetailsGrid = ({ details }: { details: GridItemProps[] }) => {
  return (
    <Grid templateColumns={{ base: '1fr', sm: '1fr 4fr' }} gap={4} alignItems={'baseline'}>
      {details.map(({ label, children }, key) => (
        <DetailRow key={label} label={label}>
          {children}
        </DetailRow>
      ))}
    </Grid>
  )
}

const DetailRow = ({ label, children }: GridItemProps) => {
  const gridProps = { display: 'flex', alignItems: 'center' }
  return (
    <>
      <GridItem {...gridProps}>
        <Text fontWeight={'bold'}>{label}</Text>
      </GridItem>
      <GridItem {...gridProps}>{children}</GridItem>
    </>
  )
}
