import './App.css'
import { useMovies } from './hooks/useMovies'
import { ListMovies } from './components/ListMovies'
import { useEffect, useRef, useState, useCallback } from 'react'
import debounce from 'just-debounce-it'

function useSearch () {
  const [errorSearch, setErrorSearch] = useState(null)
  const [search, updateSearch] = useState('')
  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      // Se iguala al resultado a la comparación:  es search === '' ? true or false
      // Es true hasta que se realiza la primera busqueda != de ''
      return
    }

    if (search === '') {
      setErrorSearch('No se puede buscar sin poner un nombre')
      return
    }
    if (search.match(/^\d+$/)) {
      setErrorSearch('No puede empezar por un número')
      return
    }
    if (search.length < 3) {
      setErrorSearch('No puedes buscar nombres de menos de 3 caracteres')
      return
    }
    setErrorSearch(null)
  }, [search])

  return { search, updateSearch, errorSearch, isFirstInput }
}

function App () {
  const [sort, setSort] = useState(false)
  const { search, updateSearch, errorSearch, isFirstInput } = useSearch()
  const { getMovies, movies, loading, error } = useMovies(search, sort)

  const debouncedGetMovies = useCallback(
    debounce(search => {
      getMovies({ search })
    }, 300)
    , [getMovies]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    // const resultsForm = Object.fromEntries(new window.FormData(event.target)) // .get('query-search2')
    // console.log(resultsForm.querySearch)
    getMovies({ search })
  }

  const handleChangeSearch = (event) => {
    const newQuerySearch = event.target.value
    if (newQuerySearch.startsWith(' ')) return
    // prevalidación, no admite empezar por espacio, no guardamos el estado
    updateSearch(newQuerySearch)
    debouncedGetMovies(newQuerySearch)
    // getMovies({ search: newQuerySearch })

    // if (newQuerySearch === '') {
    //   setErrorQuery('No se puede buscar sin poner un nombre')
    //   return
    // }
    // if (newQuerySearch.match(/^\d+$/)) {
    //   setErrorQuery('No puede empezar por un número')
    //   return
    // }
    // if (newQuerySearch.length < 3) {
    //   setErrorQuery('No puedes buscar nombres de menos de 3 caracteres')
    //   return
    // }
    // setErrorQuery(null)
  }

  const handleSort = () => {
    setSort(!sort)
  }

  return (
    <>
      <div className='App'>
        <h3>Buscador de Peliculas</h3>
        <header>
          <form className='form-search' onSubmit={handleSubmit}>
            <input className={errorSearch && 'error'} type='text' name='querySearch' value={search} onChange={handleChangeSearch} placeholder='Avengers, Matrix, Blade Runner...' />
            <button type='submit'>Buscar</button>
            <input type='checkbox' onChange={handleSort} checked={sort} />
            {errorSearch && <p className='form-search__error'>{errorSearch}</p>}
          </form>
        </header>
        <main className='list-movies'>
          {loading
            ? <h1>Cargando....</h1>
            : isFirstInput.current ? <h3>Inicia una busqueda...</h3> : <ListMovies responseFetch={movies} />}

        </main>
      </div>
    </>
  )
}

export default App
