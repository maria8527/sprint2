CREATE DATABASE semillero_2 WITH
ENCODING = 'UTF8';

\c semillero_2

//Creación de tabla vehiculo
CREATE TABLE vehiculo (
n_placa VARCHAR(8) NOT NULL,
modelo VARCHAR(5) NOT NULL,
fecha_v_seguro DATE NOT NULL,
fecha_v_tecnomecanica DATE NOT NULL,
imagen TEXT, 
CONSTRAINT pk_vehiculo
PRIMARY KEY (n_placa)
);


//Creacion de la tabla linea
CREATE SEQUENCE id_linea_seq;
CREATE TYPE enum_linea AS ENUM ('S','N');

CREATE TABLE linea (
id INTEGER NOT NULL DEFAULT NEXTVAL('id_linea_seq'),
estado enum_linea NOT NULL,
descripcion VARCHAR(500) NOT NULL,
nombre VARCHAR(30) NOT NULL, 
placa_vehiculo VARCHAR(8) NOT NULL, 
CONSTRAINT pk_linea
PRIMARY KEY (id), 
CONSTRAINT fk_vehiculo
FOREIGN KEY (placa_vehiculo) REFERENCES vehiculo(n_placa)
ON DELETE RESTRICT
ON UPDATE CASCADE
);


// Creacion de la tabla marca 
CREATE SEQUENCE id_marca_seq;
CREATE TYPE enum_marca_vehi AS ENUM ('S','N');

CREATE TABLE marca (
id INTEGER NOT NULL DEFAULT NEXTVAL('id_marca_seq'), 
nombre VARCHAR(30) NOT NULL, 
descripcion VARCHAR(500) NOT NULL, 
estado enum_marca_vehi NOT NULL, 
id_linea INT4 NOT NULL,
CONSTRAINT id_marca 
PRIMARY KEY(id),
CONSTRAINT fk_linea
FOREIGN KEY (id_linea) REFERENCES linea(id)
ON DELETE RESTRICT
ON UPDATE CASCADE
);

 ALTER TABLE vehiculo ALTER COLUMN modelo TYPE int USING modelo::integer;


INSERT INTO vehiculo
VALUES('SQP72D', '2015', '2022/09/20', '2022/07/30', 'imagen');
INSERT 0 1
SELECT * FROM vehiculo;
 n_placa | modelo | fecha_v_seguro | fecha_v_tecnomecanica | imagen
---------+--------+----------------+-----------------------+--------
 SQP72D  | 2015   | 2022-09-20     | 2022-07-30            | imagen
(1 fila)


INSERT INTO linea
VALUES(NEXTVAL ('id_linea_seq'), 'S', 'Exelente linea', 'mazda10', 'SQP72D');
INSERT 0 1
SELECT * FROM linea;
 id | estado |  descripcion   | nombre  | placa_vehiculo
----+--------+----------------+---------+----------------
  1 | S      | Exelente linea | mazda10 | SQP72D
(1 fila)


INSERT INTO marca
VALUES(NEXTVAL ('id_marca_seq'), 'Mazda','Gran marca', 'S', 1);
INSERT 0 1
semillero_2=# SELECT * FROM marca;
 id | nombre | descripcion | estado | id_linea
----+--------+-------------+--------+----------
  1 | Mazda  | Gran marca  | S      |        1
(1 fila)
