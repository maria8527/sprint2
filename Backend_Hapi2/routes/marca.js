const { pool } = require("../config/db");
const Joi = require("joi");

module.exports = {
  name: "marca",
  version: "1.0.0",
  register: async (server) => {
    server.route([
      {
        method: "GET",
        path: "/api/marca",
        options:{
          description: 'Servicio para traer las marcas que existen de la base de datos',
          tags:['api', 'marcas', 'GET'],
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
            const result = await cliente.query(`SELECT * FROM marca;`);
            return result.rows;
          } catch (error) {
            console.log({ error });
            return h
              .response({ error: "Hubo un error al traer las marcas" })
              .code(508);
          } finally {
            cliente.release(true);
          }
        },
      },
      
      {
        method: "POST",
        path: "/api/marca",
        options:{
          description: 'Servicio para crear una nueva marca',
          tags:['api', 'marcas', 'POST'],
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
                INSERT INTO marca (id, nombre, descripcion, estado, id_linea)
                VALUES (NEXTVAL ('id_marca_seq'), '${request.payload.nombre}', '${request.payload.descripcion}', 
                    '${request.payload.estado}', ${request.payload.id_linea});
                    `)
                const result = await cliente.query(`SELECT * FROM marca WHERE nombre = '${ nombre }';`);
                return result.rows;
            } catch (error) {
                console.log(error);
                return h.response({ error: 'No se pudó agregar una nueva marca' }).code(508);
            }validate: {
              payload: Joi.object({
                  nombre: Joi.string().max(30).required,
                  description: Joi.string().max(500).required,
                  estado: Joi.string().max(4).required,
                  id_linea: Joi.number().max(8).required
  
              })
          }
        },
      },
      {
        method: "PUT",
        path: "/api/marca/{id}",
        options:{
          description: 'Servicio para actualizar las marcas que existen de la base de datos',
          tags:['api', 'marcas', 'PUT'],
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
          const {nombre, descripcion, estado, id_linea} = request.payload
          try {
             await cliente.query (
                `UPDATE marca SET nombre = '${request.payload.nombre}', descripcion  = '${ request.payload.descripcion}', estado = '${request.payload.estado}', id_linea = '${request.payload.id_linea}' WHERE id = '${id}';`
             );
             const result = await cliente.query (
                `SELECT * FROM marca WHERE id ='${id}';`
             );
             return result.rows;
          } catch (error) {
              console.log(error);
              return h.response({error: `La marca no se logro actualizar`}).code(500);
          }validate: {
            payload: Joi.object({
                nombre: Joi.string().max(30).required,
                description: Joi.string().max(500).required,
                estado: Joi.string().max(4).required,
                id_linea: Joi.number().max(8).required

            })
        }

        },
      },
      {
        method: "GET",
        path: "/api/marca1",
        options:{
          description: 'Servicio para traer las marcas activas de la base de datos',
          tags:['api', 'marcas', 'GET'],
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
            const result = await cliente.query(`SELECT * FROM marca WHERE estado = 'S';`);
            return result.rows;
          } catch (error) {
            console.log({ error });
            return h
              .response({ error: "Hubo un error consultar las marcas activas" })
              .code(508);
          } finally {
            cliente.release(true);
          }
        },
      },
      {
        method: "GET",
        path: "/api/marca2",
        options:{
          description: 'Servicio para traer las marcas inactivas de la base de datos',
          tags:['api', 'marcas', 'GET'],
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
            const result = await cliente.query(`SELECT * FROM marca WHERE estado = 'N';`);
            return result.rows;
          } catch (error) {
            console.log({ error });
            return h
              .response({ error: "Hubo un error consultar las marcas inactivas" })
              .code(508);
          } finally {
            cliente.release(true);
          }
        },
      },

    ]);
  },
};

