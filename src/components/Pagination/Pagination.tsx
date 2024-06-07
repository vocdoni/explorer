import { Button, ButtonGroup, ButtonGroupProps, ButtonProps, Input, InputProps } from '@chakra-ui/react'
import { ReactElement, useMemo, useState } from 'react'
import { generatePath, Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { usePagination, useRoutedPagination } from './PaginationProvider'

export type PaginationProps = ButtonGroupProps & {
  maxButtons?: number | false
  buttonProps?: ButtonProps
  inputProps?: InputProps
}

const createButton = (page: number, currentPage: number, props: ButtonProps) => (
  <Button key={page} isActive={currentPage === page} {...props}>
    {page + 1}
  </Button>
)

type EllipsisButtonProps = ButtonProps & {
  gotoPage: (page: number) => void
  inputProps?: InputProps
}

const EllipsisButton = ({ gotoPage, inputProps, ...rest }: EllipsisButtonProps) => {
  const [ellipsisInput, setEllipsisInput] = useState(false)

  if (ellipsisInput) {
    return (
      <Input
        placeholder='Page #'
        width='50px'
        {...inputProps}
        onKeyDown={(e) => {
          if (e.target instanceof HTMLInputElement && e.key === 'Enter') {
            const pageNumber = Number(e.target.value)
            gotoPage(pageNumber)
            setEllipsisInput(false)
          }
        }}
        onBlur={() => setEllipsisInput(false)}
        autoFocus
      />
    )
  }

  return (
    <Button
      as='a'
      href='#goto-page'
      {...rest}
      onClick={(e) => {
        e.preventDefault()
        setEllipsisInput(true)
      }}
    >
      ...
    </Button>
  )
}

const usePaginationPages = (
  currentPage: number,
  totalPages: number | undefined,
  maxButtons: number | undefined | false,
  gotoPage: (page: number) => void,
  createPageButton: (i: number) => ReactElement,
  inputProps?: InputProps,
  buttonProps?: ButtonProps
) => {
  return useMemo(() => {
    if (totalPages === undefined) return []

    let pages: ReactElement[] = []

    // Create an array of all page buttons
    for (let i = 0; i < totalPages; i++) {
      pages.push(createPageButton(i))
    }

    if (!maxButtons || totalPages <= maxButtons) {
      return pages
    }

    const startEllipsis = (
      <EllipsisButton key='start-ellipsis' gotoPage={gotoPage} inputProps={inputProps} {...buttonProps} />
    )
    const endEllipsis = (
      <EllipsisButton key='end-ellipsis' gotoPage={gotoPage} inputProps={inputProps} {...buttonProps} />
    )

    // Add ellipsis and slice the array accordingly
    const sideButtons = 2 // First and last page
    const availableButtons = maxButtons - sideButtons // Buttons we can distribute around the current page

    if (currentPage <= availableButtons / 2) {
      // Near the start
      return [...pages.slice(0, availableButtons), endEllipsis, pages[totalPages - 1]]
    } else if (currentPage >= totalPages - 1 - availableButtons / 2) {
      // Near the end
      return [pages[0], startEllipsis, ...pages.slice(totalPages - availableButtons, totalPages)]
    } else {
      // In the middle
      const startPage = currentPage - Math.floor((availableButtons - 1) / 2)
      const endPage = currentPage + Math.floor(availableButtons / 2)
      return [pages[0], startEllipsis, ...pages.slice(startPage, endPage - 1), endEllipsis, pages[totalPages - 1]]
    }
  }, [currentPage, totalPages, maxButtons, gotoPage])
}

export const Pagination = ({ maxButtons = 10, buttonProps, inputProps, ...rest }: PaginationProps) => {
  const { page, setPage, totalPages } = usePagination()

  const pages = usePaginationPages(
    page,
    totalPages,
    maxButtons ? Math.max(5, maxButtons) : false,
    (page) => {
      if (page >= 0 && totalPages && page < totalPages) {
        setPage(page)
      }
    },
    (i) => createButton(i, page, { onClick: () => setPage(i), ...buttonProps })
  )

  return (
    <ButtonGroup {...rest}>
      {totalPages === undefined ? (
        <>
          <Button key='previous' onClick={() => setPage(page - 1)} isDisabled={page === 0} {...buttonProps}>
            Previous
          </Button>
          <Button key='next' onClick={() => setPage(page + 1)} {...buttonProps}>
            Next
          </Button>
        </>
      ) : (
        pages
      )}
    </ButtonGroup>
  )
}

export const RoutedPagination = ({ maxButtons = 10, buttonProps, ...rest }: PaginationProps) => {
  const { path, totalPages } = useRoutedPagination()
  const { page, ...extraParams }: { page?: number } = useParams()
  const navigate = useNavigate()

  const p = Number(page) || 1

  const pages = usePaginationPages(
    p,
    totalPages,
    maxButtons ? Math.max(5, maxButtons) : false,
    (page) => {
      if (page >= 0 && totalPages && page < totalPages) {
        navigate(generatePath(path, { page: page, ...extraParams }))
      }
    },
    (i) => (
      <Button
        as={RouterLink}
        key={i}
        to={generatePath(path, { page: i + 1, ...extraParams })}
        isActive={p - 1 === i}
        {...buttonProps}
      >
        {i + 1}
      </Button>
    )
  )

  return (
    <ButtonGroup {...rest}>
      {totalPages === undefined ? (
        <>
          <Button
            key='previous'
            onClick={() => navigate(generatePath(path, { page: p - 1, ...extraParams }))}
            isDisabled={p === 1}
            {...buttonProps}
          >
            Previous
          </Button>
          <Button
            key='next'
            onClick={() => navigate(generatePath(path, { page: p + 1, ...extraParams }))}
            {...buttonProps}
          >
            Next
          </Button>
        </>
      ) : (
        pages
      )}
    </ButtonGroup>
  )
}
