export function ListMovies ({ responseFetch }) {
  const { responseStatus, totalSearch, results } = responseFetch
  const titleSearch = responseStatus === 'True' // No es un bolean
    ? `Se han encontrado ${totalSearch} coincidencias`
    : 'No se han obtenido resultados'

  return (
    <>
      <h3 className='list-movies__title'>{titleSearch}</h3>
      <ul>
        {responseStatus === 'True' && results?.map(movie => (
          <li key={movie.id}>
            <h3>{movie.title}</h3>
            <p>{movie.year}</p>
            <img src={movie.img} alt={movie.Title} />
          </li>
        ))}
      </ul>
    </>
  )
}
