import { Box, Flex, Grid, GridItem, GridProps, Icon, Text, Tooltip } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { GrStatusInfo } from 'react-icons/gr'

export type GridItemProps = { label: string; info?: string } & PropsWithChildren

/**
 * Util component used to render a grid of details with its label
 * @param details String label, and the component that should render on the grid
 * @constructor
 */
export const DetailsGrid = ({ details, ...rest }: { details: GridItemProps[] } & GridProps) => {
  return (
    <Grid templateColumns={{ base: '1fr', sm: '1fr 4fr' }} gap={4} alignItems={'baseline'} {...rest}>
      {details.map(({ children, ...rest }, key) => (
        <DetailRow key={key} {...rest}>
          {children}
        </DetailRow>
      ))}
    </Grid>
  )
}

const DetailRow = ({ label, info, children }: GridItemProps) => {
  const gridProps = { display: 'flex', alignItems: 'center' }
  return (
    <>
      <GridItem {...gridProps}>
        <Flex alignItems='center'>
          {!!info && (
            <Tooltip label={info}>
              <Box pt={1} pr={1}>
                <Icon as={GrStatusInfo} />
              </Box>
            </Tooltip>
          )}
          <Text fontWeight={'bold'}>{label}</Text>
        </Flex>
      </GridItem>
      <GridItem {...gridProps}>{children}</GridItem>
    </>
  )
}
