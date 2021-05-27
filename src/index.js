const { createApp } = require("./app");
const DataBase = require("./database/index");
const { Proxy } = require("./proxy/proxy")
const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV;

function main() {
  try{
    const app = createApp();
  
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
      console.log(`Corriendo en modo: ${ENV}`);
    });
  } catch(e){
    console.log(e.message)
  }
}


main()

