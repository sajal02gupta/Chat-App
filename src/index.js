const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//server(emit) -> client(receive) - countUpdated
//client(emit) -> server(receive) - increment

//let count = 0

io.on('connection', (socket)=>{
    console.log('New websocket connection')

    socket.emit('message','Welcome! ')
    socket.broadcast.emit('message', 'A new user has joined the chat')
    // socket.emit('countUpdated', count)

    // socket.on('increment', ()=>{
    //     count++
    //     io.emit('countUpdated', count)
    // })
    socket.on('sendMessage', (message, callback)=>{

        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity not allowed!')
        }
        io.emit('message', message)
        callback()
    })

    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left!')
    })
    socket.on('sendLocation', (coords, callback)=>{
        io.emit('message',`https://google.com/maps/@${coords.latitude},${coords.longitude}`)
        callback()
    })  
})

server.listen(port, ()=>{
    console.log(`server is listening on port ${port}!`)
})