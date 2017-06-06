module.exports = {
  redis: {
    url: 'redis://localhost:6379/0',
    prefix: 'pay-cache:',
    expire: 60 * 10
  },
  mysql: {
    host: '192.168.0.103',
    user: 'root',
    password: '',
    database: 'admin'
  }
}
