module.exports = {
  redis: {
    url: 'redis://localhost:6379/0',
    prefix: 'pay-cache:',
    expire: 1800
  },
  mysql: {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'admin'
  }
}