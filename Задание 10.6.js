const chatWindow = document.querySelector('.container')
const messageOut = document.querySelector('.messages');
const btnSend = document.querySelector('.btnSend');
const btnGeo = document.querySelector('.btnGeo');
const messageInput = document.querySelector('.message');
let websocket = new WebSocket('wss://echo-ws-service.herokuapp.com');
chatWindow.ondragstart = () => false;
chatWindow.addEventListener('mousedown', function(e) {
    
    chatWindow.style.position = 'absolute';
    let offX = e.offsetX;
    let offY = e.offsetY;
  
    function moveWindow(event) {
        chatWindow.style.left = event.pageX - offX + 'px';
        chatWindow.style.top = event.pageY - offY + 'px';
    }
    function endMovement() {
        document.body.removeEventListener('mousemove', moveWindow);
        document.body.removeEventListener('mouseup', endMovement);
    }
    document.body.addEventListener('mouseup', endMovement);
    let isContainer = e.target.classList.value.includes('container');
    if(isContainer) {
        document.body.addEventListener('mousemove', moveWindow);
    }
});
class Message {
    constructor(type) {
        this.type = type,
        this.content = {},
        this.timestamp = new Date().getTime();
    }
}

function printMessage(msg, direction) {
    const p = document.createElement('P');
    p.classList.add(direction);
    const span = document.createElement('SPAN');
    span.textContent = msg;
    p.appendChild(span);
    messageOut.appendChild(p);
}
/*
const status = document.querySelector('#status');
const mapLink = document.querySelector('#map-link');
const btn = document.querySelector('.j-btn-test');

// Функция, выводящая текст об ошибке
const error = () => {
  status.textContent = 'Невозможно получить ваше местоположение';
}

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
  console.log('position', position);
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;

  status.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
  mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
  mapLink.textContent = 'Ссылка на карту';
}

btn.addEventListener('click', () => {
  mapLink.href = '';
  mapLink.textContent = '';
  
  if (!navigator.geolocation) {
    status.textContent = 'Geolocation не поддерживается вашим браузером';
  } else {
    status.textContent = 'Определение местоположения…';
    navigator.geolocation.getCurrentPosition(success, error);
  }
});

*/

function getLocation() {
    return new Promise(function(resolve, reject){
        const geo = navigator.geolocation;
        geo.getCurrentPosition( position => resolve(position), err => reject(console.log(new Error(err))) );
    });
}

function sendLocation(location) {
    let lat = location.coords.latitude;
    let long = location.coords.longitude;
    let position = new Message('geolocation');
    position.content = {
        latitude: lat,
        longitude: long,
        accuracy: location.coords.accuracy,
    }
    let json = JSON.stringify(position);
    console.log('position', position);
    let a = document.createElement('A');
    a.href = `https://www.openstreetmap.org/#map=16/${lat}/${long}`;
    a.textContent = 'Гео-локация';
    a.target = '_blank';
    a.style.textDecoration = 'none';
    a.style.color = '#1684DF';
    let span = document.createElement('SPAN');
    span.appendChild(a)
    let p = document.createElement('P');
    p.classList.add('myMessage');
    p.appendChild(span);
    messageOut.appendChild(p);
    websocket.send(json);
}

function sendMessage(msgText) {
    let message = new Message('text');
    if(typeof msgText === 'string') {
        message.content.text = msgText;
        printMessage(msgText, 'myMessage');
        websocket.send(JSON.stringify(message));
    } else console.log('This type of content is not supported yet');
}
function receiveMessage(msgJSON) {
    let message = JSON.parse(msgJSON);
    if (message.type === 'text') {
        let text = message.content.text;
        printMessage(text, 'oppMessage');
    }
}
websocket.onopen = function () {
    console.log('websocket open');
    btnSend.addEventListener('click', () => {
        let message = messageInput.value;
        messageInput.value = '';
        if (message) sendMessage(message);
    });
}
    btnGeo.addEventListener('click', async () => {
        let location = await getLocation();
        sendLocation(location);
    });
    websocket.onmessage = function(msg) {
        receiveMessage(msg.data);
    }
    websocket.onerror = function(event) {
        console.log('Error: ' + event.data);
    }