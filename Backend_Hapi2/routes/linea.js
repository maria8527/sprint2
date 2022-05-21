const Joi = require("joi");
const { pool } = require("../config/db");

module.exports = {
  name: "linea",
  version: "1.0.0",
  register: async (server) => {
    server.route([
      {
        method: "GET",
        path: "/api/linea",
        options:{
          description: 'Servicio para traer las lineas que existen de la base de datos',
          tags:['api', 'lineas', 'GET'],
          plugins: {
              'hapi-swagger': {
                  responses: {
                      200: {description: 'Respuesta positiva del servidor'},
                      508: {
                          description: 'No se logro hacer la consulta'
                      }
                  },
              }
          },
      },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          try {
            const result = await cliente.query(`SELECT * FROM linea;`);
            return result.rows;
          } catch (error) {
            console.log({ error });
            return h
              .response({ error: "Hubo un error al traer las lineas" })
              .code(508);
          } finally {
            cliente.release(true);
          }
        },
      },
      
      {
        method: "POST",
        path: "/api/lineas",
        options:{
          description: 'Servicio para agregar una linea a la base de datos',
          tags:['api', 'lineas', 'POST'],
          plugins: {
              'hapi-swagger': {
                  responses: {
                      200: {description: 'Respuesta positiva del servidor'},
                      508: {
                          description: 'No se logro hacer la consulta'
                      }
                  },
              }
          },
      },
        handler: async(request, h) => {
            let cliente = await pool.connect();
            const { nombre } = request.payload
            try {
                await cliente.query(`
                INSERT INTO linea (id, estado, descripcion, nombre, placa_vehiculo)
                VALUES (NEXTVAL ('id_linea_seq'), '${request.payload.estado}', '${request.payload.descripcion}', 
                    '${request.payload.nombre}', '${request.payload.placa_vehiculo}');
                    `)
                const result = await cliente.query(`SELECT * FROM linea WHERE nombre = '${ nombre }';`);
                return result.rows;
            } catch (error) {
                console.log(error);
                return h.response({ error: 'No se pudó agregar una linea' }).code(508);
            } validate: {
              payload: Joi.object({
                  estado: Joi.string().max(4).required,
                  description: Joi.string().max(500).required,
                  nombre: Joi.string().max(30).required,
                  placa_vehiculo: Joi.string().max(8).required
  
              })
          }
        },
      },
      {
        method: "PUT",
        path: "/api/linea/{id}",
        options:{
          description: 'Servicio para actualizar las lineas que existen de la base de datos',
          tags:['api', 'lineas', 'PUT'],
          plugins: {
              'hapi-swagger': {
                  responses: {
                      200: {description: 'Respuesta positiva del servidor'},
                      508: {
                          description: 'No se logro hacer la consulta'
                      }
                  },
              }
          },
      },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          const { id } = request.params; 
          const {estado, descripcion, nombre, placa_vehiculo} = request.payload
          try {
             await cliente.query (
                `UPDATE linea SET estado = '${request.payload.estado}', descripcion  = '${ request.payload.descripcion}', nombre = '${request.payload.nombre}', placa_vehiculo = '${request.payload.placa_vehiculo}' WHERE id = '${id}';`
             );
             const result = await cliente.query (
                `SELECT * FROM linea WHERE id ='${id}';`
             );
             return result.rows;
          } catch (error) {
              console.log(error);
              return h.response({error: `La linea no se logro actualizar`}).code(500);
          }  validate: {
            payload: Joi.object({
                estado: Joi.string().max(4).required,
                description: Joi.string().max(500).required,
                nombre: Joi.string().max(30).required,
                placa_vehiculo: Joi.string().max(8).required

            })
        }

        },
      },
      {
        method: "GET",
        path: "/api/linea1",
        options:{
          description: 'Servicio para traer las lineas que estan activas',
          tags:['api', 'lineas', 'GET'],
          plugins: {
              'hapi-swagger': {
                  responses: {
                      200: {description: 'Respuesta positiva del servidor'},
                      508: {
                          description: 'No se logro hacer la consulta'
                      }
                  },
              }
          },
      },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          try {
            const result = await cliente.query(`SELECT * FROM linea WHERE estado = 'S';`);
            return result.rows;
          } catch (error) {
            console.log({ error });
            return h
              .response({ error: "Hubo un error consultar las lineas activas" })
              .code(508);
          } finally {
            cliente.release(true);
          }
        },
      },
      {
        method: "GET",
        path: "/api/linea2",
        options:{
          description: 'Servicio para traer las lineas que estan inactivas',
          tags:['api', 'lineas2', 'GET'],
          plugins: {
              'hapi-swagger': {
                  responses: {
                      200: {description: 'Respuesta positiva del servidor'},
                      508: {
                          description: 'No se logro hacer la consulta'
                      }
                  },
              }
          },
      },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          try {
            const result = await cliente.query(`SELECT * FROM linea WHERE estado = 'N';`);
            return result.rows;
          } catch (error) {
            console.log({ error });
            return h
              .response({ error: "Hubo un error consultar las lineas inactivas" })
              .code(508);
          } finally {
            cliente.release(true);
          }
        },
      },
      {
        method: "GET",
        path: "/api/lineas",
        options:{
          description: 'Servicio para saber cuantas lineas estan activas y cuentas inactivas',
          tags:['api', 'lineas', 'GET'],
          plugins: {
              'hapi-swagger': {
                  responses: {
                      200: {description: 'Respuesta positiva del servidor'},
                      508: {
                          description: 'No se logro hacer la consulta'
                      }
                  },
              }
          },
      },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          try {
            const result = await cliente.query(`SELECT COUNT(estado), estado FROM linea GROUP BY estado;`);
            return result.rows;
          } catch (error) {
            console.log({ error });
            return h
              .response({ error: "Hubo un error al saber cuantas lineas estan activas e inactivas" })
              .code(508);
          } finally {
            cliente.release(true);
          }
        },
      },
    
    ]);
  },
};
