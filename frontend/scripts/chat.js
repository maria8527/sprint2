const socket = io('ws://localhost:3000'); 

const enviar = document.getElementById('send');
const pantalla = document.getElementById('dashboard')
const box = document.getElementById('box')
const roomcontent = document.getElementById('room');

let room = ''

const showMessage = (user,message) =>{
    pantalla.innerHTML += `<b>${user}:</b> ${message} <br>`;
}

enviar.addEventListener('click', (e)=>{
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user')).email;
    const message = document.getElementById('message').value;
    if(message !== ''){
        socket.emit('chat:message',{user,message,room});
    }else{
        alert('Campo vacío');
    } 
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

socket.on('connect', function() {
    room = `room${getRandomInt(1,3)}`;
    socket.emit('room', room);
    roomcontent.innerHTML = room;

})

socket.on('chat:message', data => {
    showMessage(data.user,data.message);
})

