const socket = io()

// socket.on('countUpdated', (count)=>{
//     console.log('The count has been updated!',count)
// })

socket.on('message', (message)=>{
    console.log(message);
})
document.querySelector('#message-form').addEventListener('submit', (e)=>{
    e.preventDefault()

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error)=>{
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

document.querySelector('#send-location').addEventListener('click', ()=>{
    if (!navigator.geolocation) {
        return alert('Geo location is not supported by your browser')
    } else {
        navigator.geolocation.getCurrentPosition((position)=>{
            socket.emit('sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, ()=>{
                console.log('Location shared!')
            })
        })
    }
})

// document.querySelector('#increment').addEventListener('click', ()=>{
//     console.log('clicked');
//     socket.emit('increment')    
// })