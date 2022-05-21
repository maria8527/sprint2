let formu= document.getElementById("crearv"); 

const API_URL = "http://localhost:3000";
const obtenerInfo = async() => {
    const data = await fetch(`${API_URL}/api/vehiculos`);
    const local = await data.json();
    console.log(local);
}
obtenerInfo(); 

formu.addEventListener('submit', async (e)=>{
    e.preventDefault();
    let n_placa= document.getElementById("placavehiculo").value;
    let modelo= document.getElementById("modelovehiculo").value;
    let fecha_v_seguro= document.getElementById("f_seguro").value;
    let fecha_v_tecnomecanica= document.getElementById("f_tecnomecanica").value; 
    window.location.href = "almacenados.html";

    const data = {n_placa, modelo, fecha_v_seguro, fecha_v_tecnomecanica}

    const result = await fetch('http://localhost:3000/api/vehiculos1', {
        method: 'POST', 
        body: JSON.stringify(data), 
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .catch(error => error)

      console.log(result)
})




