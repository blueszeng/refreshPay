module.exports = {
  redis: {
    url: 'redis://localhost:6379/0',
    prefix: 'pay-cache:',
    expire: 60 * 10
  },
  mysql: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'admin'
  }
}
