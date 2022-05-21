const Hapi = require('@hapi/hapi');
const path = require('path');
const Package = require('./package.json');
const Inert = require('@hapi/inert');
const Vision  = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const { description } = require('@hapi/joi/lib/base');
const cors = require('cors');

require('dotenv').config();


const init = async() =>{

    const server = new Hapi.Server({
        port: process.env.PORT,
        host: process.env.HOST_DB,
        routes: {
            cors: true
        }
    
    });

    //Documentacion
    const swaggerOptions = {
        info: {
            title: 'API del semillero', 
            description: 'Esta es la documentación de la API semillero realizada con Swagger', 
            contact: {
                name: 'Alejandra Trujillo', 
                email: 'at386855@gmail.com'
            }, 
            servers: [`${server.info.uri}`], 
            version: '0.0.1'
        }
    }
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            option: swaggerOptions
        }
    ]);


    server.route({
        method: 'GET',
        path: '/hello',
        options: {
            description: 'Comprobar conexión con el servior',
            tags: ['api', 'Inicio', 'Index'],
            
        },
        handler: (request, h) => {
            return 'Hello World!';
        },
    },
    );

     await server.register([
        require("./routes/vehiculo"),
        require("./routes/marca"),
        require("./routes/linea"),
    ]);

    await server.start();
    console.log(`Server running on: ${server.info.uri}`);

}

init();