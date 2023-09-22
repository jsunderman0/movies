const pg = require('pg');
const client = new pg.Client('postgres://localhost/movies_db');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json())

const homePage = path.join(__dirname, 'index.html');
app.get('/', (req, res)=> res.sendFile(homePage));

const reactApp = path.join(__dirname, 'dist/main.js');
app.get('/dist/main.js', (req, res)=> res.sendFile(reactApp));

const reactSourceMap = path.join(__dirname, 'dist/main.js.map');
app.get('/dist/main.js.map', (req, res)=> res.sendFile(reactSourceMap));

const styleSheet = path.join(__dirname, 'styles.css');
app.get('/styles.css', (req, res)=> res.sendFile(styleSheet));

app.get('/api/movies', async (req, res, next) => {
  try{
    const SQL = `
      SELECT *
      FROM movies
    `
    const response = await client.query(SQL);
    res.send(response.rows)
  }
  catch(error){
    next(error)
  };

});

app.put('/api/movies/:id', async (req, res, next) => {
  
  try{
    if(req.body.stars < 1 || req.body.stars > 5){
    throw new Error("Invalid Rating")
  }
    const SQL = `
      UPDATE movies
      SET title = $1, stars = $2
      WHERE id = $3
      RETURNING *
    `
    const response = await client.query(SQL, [req.body.title, req.body.stars, req.params.id]);
    res.send(response.rows[0]); 
  }
  catch(error){
    next(error)
  };

});

app.delete('/api/movies/:id', async (req, res, next) => {
  try{
    const SQL = `
    DELETE *
    FROM movies
    WHERE id =$1
    `
    const response = await client.query( SQL, [req.params.id])
    res.send(response)
  }
  catch(error){
    next(error)
  }
})

app.use((err, req, res, next) => {
  res.status(500).send(err.message)
})

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  const SQL = `
    DROP TABLE IF EXISTS movies;
    CREATE TABLE movies(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      stars INT
    );

    INSERT INTO movies (title, stars) VALUES ('The Lion King', 5);
    INSERT INTO movies (title, stars) VALUES ('The Good Dinosaur', 1);
    INSERT INTO movies (title, stars) VALUES ('The Incredibles', 5);
    INSERT INTO movies (title, stars) VALUES ('Good Will Hunting', 5);
    INSERT INTO movies (title, stars) VALUES ('Big Fat Liar', 2)
    
  `;
  await client.query(SQL);
  console.log("data seeded")

  const port = process.env.PORT || 4000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
