import { useCallback, useRef, useState, useMemo } from 'react'
import { fetchData } from '../services/fetchData'

export function useMovies (search, sort) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const previusSearch = useRef(search)

  const getMovies = useCallback(
    async ({ search }) => {
      if (search === previusSearch.current) return
      if (search === '') {
        setMovies([])
        return
      }
      try {
        setLoading(true)
        setError(null)
        previusSearch.current = search
        const { ...newMovies } = await fetchData(search)
        setMovies(newMovies)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }, [])

  const results = useMemo(() => {
    return sort
      ? [...movies.results].sort((a, b) => a.title.localeCompare(b.title)) // .sort((a, b) => a.year - b.year)
      : movies.results
  }, [sort, movies.results])

  const newMovies = { ...movies, results }

  return { movies: newMovies, loading, error, getMovies }
}
