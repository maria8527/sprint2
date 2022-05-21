let formu = document.getElementById("editarvh")

const API_URL = "http://localhost:3400";

formu.addEventListener('submit', async (e)=>{
    e.preventDefault();
    let n_placa= document.getElementById("placavehiculo").value;
    let modelo= document.getElementById("modelovehiculo").value;
    let fecha_v_seguro= document.getElementById("f_seguro").value;
    let fecha_v_tecnomecanica= document.getElementById("f_tecnomecanica").value; 
    let imagen= document.getElementById("imagenvehiculo").value;
    // window.location.href = "almacenados.html";

    const data = {modelo, fecha_v_seguro, fecha_v_tecnomecanica, imagen}
    console.log(data);
    
    const result = await fetch(`http://localhost:3400/api/vehi1/${n_placa}`, {
        method: 'PUT', 
        body: JSON.stringify(data), 
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .catch(error => error)

      console.log(result)
})