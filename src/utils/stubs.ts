export function generateListStub<T>(stub: T, num = 4): T[] {
  return Array(num).fill(stub)
}

export const PaginationStub = {
  currentPage: 1,
  totalItems: 10,
  lastPage: 1,
  previousPage: null,
  nextPage: null,
}
