// config.js
module.exports = {
  db: 'mongodb://localhost:27017/digital-signature',
  // db_dev: 'mongodb://localhost:27017/digital-signature',
  db_dev: 'mongodb://digital-signature:Sandy12345678@ds117816.mlab.com:17816/digital-signature',
  JWT_SECRET: 'sandeep@bangarh',
  'directory': __dirname,
  'options' :  {
	  provider: 'google',
	  httpAdapter: 'https',
	  apiKey: 'AIzaSyABUgL0EM0WtQY0OXjgEz4eowfVk-raUeo',
	  formatter: null
	}
};

