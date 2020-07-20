const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'
const SERVER_HOST = '127.0.0.1'
const SERVER_PORT = 9000

const PROJECT_PATH = path.resolve(__dirname, '../')
const PROJECT_NAME = path.parse(PROJECT_PATH).name

module.exports = {
  isDev,
  SERVER_HOST,
  SERVER_PORT,
  PROJECT_PATH,
  PROJECT_NAME,
}
