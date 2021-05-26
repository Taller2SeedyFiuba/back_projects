const axios = require('axios');
const { msErrorHandler } = require('../errors/errorHandler');
const URL = process.env.USER_SERVICE_URL || 'http://user-service:8080/api';
//const URL = 'https://seedyfiuba-back-users.herokuapp.com/api';

class Proxy{
    async validateUserExistance(id){

        try {
          await axios.get(URL + '/' + id);
        } catch (err) {
          msErrorHandler(err);
        }
    }
}

module.exports = { Proxy }
