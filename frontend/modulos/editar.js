let formu = document.getElementById("editarvh")

const API_URL = "http://localhost:3000";

formu.addEventListener('submit', async (e)=>{
    e.preventDefault();
    let imagen= document.getElementById("imagenvehiculo").value;
    let n_placa= document.getElementById("placavehiculo").value;
    let modelo= document.getElementById("modelovehiculo").value;
    let fecha_v_seguro= document.getElementById("f_seguro").value;
    let fecha_v_tecnomecanica= document.getElementById("f_tecnomecanica").value; 
    window.location.href = "almacenados.html";

    const data = { imagen, modelo, fecha_v_seguro, fecha_v_tecnomecanica}
    console.log(data);
    
    const result = await fetch(`http://localhost:3000/api/vehi2/${n_placa}`, {
        method: 'PUT', 
        body: JSON.stringify(data), 
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .catch(error => error)

      console.log(result)
})