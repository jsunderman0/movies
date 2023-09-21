import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios'

const App = ()=> {
  const [movies, setMovies] = useState([])

  useEffect(()=> {
    const fetchMovies = async() => {
      const response = await axios.get('/api/movies')
      const data = response.data
      setMovies(data)
    }
    fetchMovies()
  }, [])
  return (
    <>
    <h1>Jack's Movies ({movies.length}) </h1>
    <ul>
      {
        movies.map((movie) => {
          return <li key = {movie.id}> {movie.title}, {movie.stars} stars </li>
        })
      }
    </ul>
    </>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
