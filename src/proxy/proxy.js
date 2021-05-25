const axios = require('axios');
const URL = 'https://localhost:8080/api';

class Proxy{
    async userExists(id){
        const response = await axios.get(URL + '/' + req.id);
        console.log(response.data);
        res.status(200).send(response.data);
    }
}


module.exports = { Proxy }