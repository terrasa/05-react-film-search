const API_URL = 'http://www.omdbapi.com/'
const API_KEY = 'c7c41810'

export const fetchData = async (search) => {
  if (search === '') return null

  // const searchConcatWords = search.split(' ').join('+')
  const response = await fetch(`${API_URL}?apikey=${API_KEY}&s=${search}`)

  if (!response.ok) {
    throw new Error(`Error al cargar datos ${response.status}`)
  }
  try {
    const data = await response.json()

    const { Response, Search, totalResults } = data
    const responseStatus = Response
    const totalSearch = totalResults
    const results = Search?.map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      img: movie.Poster
    }))

    return { responseStatus, totalSearch, results }
  } catch (err) {
    console.error(err.message)
  }
}
