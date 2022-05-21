
let contenedor = document.getElementById("container-card");

const API_URL = "http://localhost:3400";
const obtenerInfo = async () => {
  const respuesta = await fetch(`${API_URL}/api/vehiculos`);
  const data = await respuesta.json();
  pintar(data);
  console.log(data);
};
obtenerInfo();

function pintar(array) {
    array.forEach((item) => {
      
        const {  n_placa, modelo, fecha_v_seguro, fecha_v_tecnomecanica, imagen} = item;
        contenedor.innerHTML += `    
        <div class="card d-inline-block" style="width: 18rem;">
        <div class="almacen">
          <h5 class="card-title">Tú vehículo es:</h5>
          <p class="card-text">placa:${n_placa}</p>
          <p class="card-text">marca:${modelo}</p>
          <p class="card-text">fecha vencimiento seguro:${fecha_v_seguro}</p>
          <p class="card-text">fecha vencimiento tecnomecanica:${fecha_v_tecnomecanica}</p>
          <img src="${imagen}" class="card-img-top" alt="...">
          <a href="editar.html" class="btn btn-primary">Editar</a>
          <a href="#" class="btn btn-primary btnE" id="${n_placa}">Eliminar</a>
        </div>
      </div>  
            `;
      });
      
}

const btneliminar = document.querySelector(".btnE"); 
document.addEventListener("click", ({target}) => {
  if(target.classList.contains('btnE')){
      
      let n_placa = target.id;
      let confirmar = confirm(`Seguro quíeres eliminar el vehículos con placa: ${n_placa}`);

      if(confirmar){
        fetch(`http://localhost:3400/api/vehiculos/${n_placa}`, {
          method: 'DELETE' 
        }).then(res => res.json())
        .catch(error => error)

        obtenerInfo();
      };
    };
  });