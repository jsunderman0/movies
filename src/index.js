import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios'

const App = ()=> {
  const [movies, setMovies] = useState([])
  const [error, setError] = useState("")

  useEffect(()=> {
    const fetchMovies = async() => {
      const response = await axios.get('/api/movies')
      const data = response.data
      setMovies(data)
    }
    fetchMovies()
  }, [])

  const increaseRating = (async (movie) => {
    try{
      setError('')
      const newRating = movie.stars + 1
    const {data} = await axios.put(`/api/movies/${movie.id}`, {title: movie.title, stars: newRating});
    console.log(data)
    const newMovies= movies.map((movieMap) => {
      if(movieMap.id === movie.id) {
        return data
      }
      else{
        return movieMap
      }
    })
    setMovies(newMovies)
    }
    catch(error){
      setError(error.response.data)
    }
    
  })

  const decreaseRating = (async (movie) => {
    try{
      setError('')
    const newRating = movie.stars - 1
    const {data} = await axios.put(`/api/movies/${movie.id}`, {title: movie.title, stars: newRating});
    console.log(data)
    const newMovies= movies.map((movieMap) => {
      if(movieMap.id === movie.id) {
        return data
      }
      else{
        return movieMap
      }
    })
    setMovies(newMovies)
  }
  catch(error){
    setError(error.response.data)
  }
  })

  const deleteMovie = (async (movie) => {
    const data = await axios.delete(`/api/movies/${movie.id}`)
    const updatedMovieList = movies.filter((movieFilt) => {
      return movieFilt.id !== movie.id
    })
    setMovies(updatedMovieList)
  })

  return (
    <>
    <h1>Jack's Movies ({movies.length}) </h1>
    <p>{error ? error : ''}</p>
    <ul>
      {
        movies.map((movie) => {
          return (
            <li key = {movie.id}>
              <h3> Title: {movie.title} </h3>
              <span>
              <h4> Rating: {movie.stars} stars</h4>
              <button onClick={() => {increaseRating(movie)}}> + </button> <button onClick={() => {decreaseRating(movie)}}> - </button>
              </span> 
              <button onClick={() => {deleteMovie(movie)}}> Delete </button>
            </li>
          )
        })
      }
    </ul>
    
    </>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
