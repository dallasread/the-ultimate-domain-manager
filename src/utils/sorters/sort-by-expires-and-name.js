import sortByName from '@/utils/sorters/sort-by-name'

export default (queries) => {
  return (a, b) => {
    if (queries.isExpiring(a) && !queries.isExpiring(b)) return -1
    if (!queries.isExpiring(a) && queries.isExpiring(b)) return 1

    if (queries.isExpiring(a) && queries.isExpiring(b)) {
      if (queries.expiresAt(a).getTime() < queries.expiresAt(b).getTime()) return -1
      if (queries.expiresAt(a).getTime() > queries.expiresAt(b).getTime()) return 1
    }

    return sortByName(a, b)
  }
}
