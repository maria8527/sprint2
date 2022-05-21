const { pool } = require("../config/db");
const Joi = require("joi");

module.exports = {
  name: "vehiculo",
  version: "1.0.0",
  register: async (server) => {
    server.route([
      {
        method: "GET",
        path: "/api/vehiculos",
        options: {
          cors: true,
          handler: async (request, h) => {
            let cliente = await pool.connect();
            try {
              const result = await cliente.query(`SELECT * FROM vehiculo;`);
              return result.rows;
            } catch (error) {
              console.log({ error });
              return h
                .response({ error: "Hubo un error al traer los vehiculos" })
                .code(508);
            } finally {
              cliente.release(true);
            }
          },
          description:
            "Servicio para traer los vehículos que existen de la base de datos",
          tags: ["api", "Vehículo"],
          notes: [
            "Este servicio nos permite consultar todos los vehículos que tenemos almacenados en  la base de datos",
          ],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: { description: "Nos devuelve los vehículos" },
                508: {
                  description: "No se logro consultar los vehículos",
                },
              },
            },
          },
        },
      },
      {
        method: "POST",
        path: "/api/vehiculos1",
        options: {
          cors: true,
          description: "Agregar un nuevo Vehículo a la base de datos",
          tags: ["api", "Vehículos"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: { description: "Respuesta positiva del servidor" },
                508: {
                  description:
                    "No se pudo agregar un vehículo a la base de datos",
                },
              },
            },
          },
        },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          const vehiculo = {
            n_placa: request.payload.n_placa,
            modelo: request.payload.modelo,
            fecha_v_seguro: request.payload.fecha_v_seguro,
            fecha_v_tecnomecanica: request.payload.fecha_v_tecnomecanica,
            imagen: request.payload.imagen,
          };
          try {
            await cliente.query(
              `INSERT INTO vehiculo VALUES ('${request.payload.n_placa}', '${request.payload.modelo}', '${request.payload.fecha_v_seguro}', '${request.payload.fecha_v_tecnomecanica}', '${request.payload.imagen}' );`
            );
            const result = await cliente.query(
              `SELECT * FROM vehiculo WHERE n_placa='${request.payload.n_placa}';`
            );
            return result.rows;
          } catch (error) {
            console.log(error);
            return h
              .response({ error: "No se logro colocar un nuevo vehiculo" })
              .code(508);
          }
          validate: {
            payload: Joi.object({
              n_placa: Joi.string().max(8).required,
              modelo: Joi.string().max(5).required,
              fecha_v_seguro: Joi.date().required,
              fecha_v_tecnomecanica: Joi.date().required,
              imagen: Joi.string(),
            });
          }
        },
      },
      {
        method: "PUT",
        path: "/api/vehi1/{n_placa}",
        options: {
          cors: true,
          description: "Editar el Vehículo",
          tags: ["api", "Vehículos", "PUT"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: { description: "Respuesta positiva del servidor" },
                508: {
                  description: "No se logro editar el vehículo",
                },
              },
            },
          },
        },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          const { n_placa } = request.params;
          const { modelo, fecha_v_seguro, fecha_v_tecnomecanica, imagen } =
            request.payload;
          try {
            await cliente.query(
              `UPDATE vehiculo SET modelo = '${request.payload.modelo}', fecha_v_seguro  = '${request.payload.fecha_v_seguro}', fecha_v_tecnomecanica = '${request.payload.fecha_v_tecnomecanica}', imagen = '${request.payload.imagen}' WHERE n_placa = '${n_placa}';`
            );
            const result = await cliente.query(
              `SELECT * FROM vehiculo WHERE n_placa='${n_placa}';`
            );
            return result.rows;
          } catch (error) {
            console.log(error);
            return h
              .response({ error: `El vehiculo no se logro actualizar` })
              .code(500);
          }
          validate: {
            payload: Joi.object({
              modelo: Joi.string().max(5).required,
              fecha_v_seguro: Joi.date().required,
              fecha_v_tecnomecanica: Joi.date().required,
              imagen: Joi.string(),
            });
          }
        },
      },
      {
        method: "DELETE",
        path: "/api/vehiculos/{n_placa}",
        options: {
          cors: true,
          description: "Eliminar un Vehículo",
          tags: ["api", "Vehículos", "DELETE"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: { description: "Respuesta positiva del servidor" },
                508: {
                  description: "No se logro eliminar el vehículo",
                },
              },
            },
          },
        },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          const { n_placa } = request.params;
          try {
            await cliente.query(
              `DELETE FROM vehiculo WHERE n_placa = '${n_placa}';`
            );
            return `Regristro eliminado`;
          } catch (error) {
            console.log(error);
            return h.response({ error: `El vehiculo no se elimino` }).code(500);
          }
        },
      },

      {
        method: "GET",
        path: "/api/{fecha}/{fecha1}",
        options: {
          description: "Optener un rango por fecha de vencimiento del seguro",
          tags: ["api", "Vehículos", "fecha"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: { description: "Respuesta positiva del servidor" },
                508: {
                  description: "No se pudo consultar a la base de datos",
                },
              },
            },
          },
        },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          const { fecha, fecha1 } = request.params;
          try {
            const result = await cliente.query(
              `SELECT * FROM vehiculo WHERE fecha_v_seguro BETWEEN '${fecha}' AND '${fecha1}' ORDER BY fecha_v_seguro;`
            );
            return result.rows;
          } catch (error) {
            console.log(error);
            return h
              .response({
                error: `No se logro consultar los vehiculos por la fecha de vencimiento del seguro`,
              })
              .code(500);
          } finally {
            cliente.release(true);
          }
        },
      },
      {
        method: "GET",
        path: "/api/modelo/{modelo}/{modelo1}",
        options: {
          description: "Optener un rango por el modelo de los vehiculos",
          tags: ["api", "modelos"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: { description: "Respuesta positiva del servidor" },
                508: {
                  description: "No se logro realizar la consulta",
                },
              },
            },
          },
        },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          const { modelo, modelo1 } = request.params;
          try {
            const result = await cliente.query(
              `SELECT * FROM vehiculo WHERE modelo BETWEEN '${modelo}' AND '${modelo1}' ORDER BY modelo;`
            );
            return result.rows;
          } catch (error) {
            console.log(error);
            return h
              .response({
                error: `No se logro consultar los vehiculos por el modelo`,
              })
              .code(500);
          } finally {
            cliente.release(true);
          }
        },
      },

      {
        method: "GET",
        path: "/api/modelo1",
        options: {
          description: "Optener el maximo y el minimo de los modelos",
          tags: ["api", "modelos"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: { description: "Respuesta positiva del servidor" },
                508: {
                  description: "No se logro realizar la consulta",
                },
              },
            },
          },
        },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          try {
            const result = await cliente.query(
              "SELECT MIN(modelo), MAX(modelo) FROM vehiculo;"
            );
            return result.rows;
          } catch (error) {
            console.log({ error });
            return h.response({ error: "internal server error" }).code(508);
          } finally {
            cliente.release(true);
          }
        },
      },
      {
        method: "GET",
        path: "/api/modelo2",
        options: {
          description: "Realizar la suma de los modelos",
          tags: ["api", "modelos"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: { description: "Respuesta positiva del servidor" },
                508: {
                  description: "No se logro hacer la consulta",
                },
              },
            },
          },
        },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          try {
            const result = await cliente.query(
              "SELECT SUM(modelo) FROM vehiculo;"
            );
            return result.rows;
          } catch (error) {
            console.log({ error });
            return h.response({ error: "internal server error" }).code(508);
          } finally {
            cliente.release(true);
          }
        },
      },
      {
        method: "GET",
        path: "/api/modelo3",
        options: {
          description: "Realizar el promedio de los modelos",
          tags: ["api", "modelos"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: { description: "Respuesta positiva del servidor" },
                508: {
                  description: "No se logro hacer la consulta",
                },
              },
            },
          },
        },
        handler: async (request, h) => {
          let cliente = await pool.connect();
          try {
            const result = await cliente.query(
              "SELECT AVG(modelo) FROM vehiculo;"
            );
            return result.rows;
          } catch (error) {
            console.log({ error });
            return h.response({ error: "internal server error" }).code(508);
          } finally {
            cliente.release(true);
          }
        },
      },
    ]);
  },
};
