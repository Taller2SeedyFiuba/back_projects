const axios = require('axios');
const { msErrorHandler } = require('../errors/handler');
const URL = process.env.USER_SERVICE_URL || 'http://user-service:8080/api/users';
//const URL = 'https://seedyfiuba-back-users.herokuapp.com/api';

async function validateUserExistance(id){

  try {
    await axios.get(URL + '/' + id);
  } catch (err) {
    msErrorHandler(err);
  }
}

module.exports = { validateUserExistance }
