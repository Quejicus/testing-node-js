import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'moviesdb',
  port: 3306
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      )

      if (genres.length === 0) return []

      // get the id from the first genre result
      // const [{ id }] = genres

      // get all movies ids from database table
      // la query a movie_genres
      // join
      // y devolver resultados..
      return []
    }

    const [movies] = await connection.query(
      `SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate 
        FROM movie;`
    )

    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create ({ input }) {
    const {
      // genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // todo: genre connection

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      throw new Error('Error creating movie')
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return movies[0]
  }

  static async delete ({ id }) {
    const [movies] = await connection.query(
      'DELETE FROM movie WHERE id = UUID_TO_BIN(?);',
      [id]
    )

    if (movies.length === 0) return null

    return []
  }

  static async update ({ id, input }) {
    // todo: update
  }
}
