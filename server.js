const  express=require('express')
const app=express();
const server = require('http').Server(app)
//server which is  used with socket io. and for that u need express server
const io=require('socket.io')(server);
const {v4:uuidv4}=require('uuid')
app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

io.on('connection',(socket)=>{

        socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);   
            
        socket.on('message',(message)=>{
            socket.broadcast.to(roomId).emit('newMessage',(message));
        })
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
          })
      
    })

    
})

server.listen(3000,()=>{
    console.log("server is active on port 3000");
});



