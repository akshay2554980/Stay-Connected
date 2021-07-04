 
const socket=io('/');
const videoGrid=document.getElementById('video-grid')
//You are a new peer .. id is auto defined by lib so given undefined
// give host and peejs port number...
const myPeer=new Peer(undefined,{
    host:'/',
    port:'3001'
})


const myVideo=document.createElement('video');
const peers={}
let myVideoStream;
//reciving calls.
navigator.mediaDevices.getUserMedia({
    video:true,audio:true
}).then(stream=>{
    myVideoStream=stream;
    console.log(myVideoStream , 'akshay')
    addVideoStream(myVideo,stream)  
    
    })
    
    myPeer.on('call',call=>{
        console.log("new user is called successfully");
        call.answer(myVideoStream);  
        console.log(myVideoStream);
       
        const video=document.createElement('video');
        call.on('stream',(userVideoStream)=>{    // to get callers video use 'stream' event
            addVideoStream(video,userVideoStream);
        })      
      })    


    socket.on('user-connected',(userId)=>{
        console.log("new user entered :", userId); // now from this user i need to send and revice streams.
        //connectToNewUser(userId,myVideoStream);  // send our own stream to the new user.
        setTimeout(connectToNewUser,1000,userId,myVideoStream);
        })
        
myPeer.on('open',id=>{
    socket.emit('join-room',roomId,id);    
})
    




        
      function connectToNewUser(userId,stream)  
      {
          console.log('calling');
          const call  = myPeer.call(userId,stream)
          console.log('call return to base');
          const video=document.createElement('video')
          call.on('stream',newuservideostream=>{     
                  addVideoStream(video,newuservideostream);
          })  
        //   call.on('close',()=>{
        //       video.remove();
        //   })
          peers[userId]=call   
      }
      





      socket.on('newMessage',(message)=>{
        $('ul').append(`<li class="message"> <b>user : </b><br/>${message}</li>`)
        scrollMsg();
    })    

    




  socket.on('user-disconnected',userId=>{
    if(peers[userId])
    peers[userId].close()  //remove that peer from the array of peers.
})






















































function addVideoStream(video,stream)
{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}

let text = $("input");
$('html').keydown(function (e) {
  if (e.which == 13 && text.val().length !== 0) {
  socket.emit('message', text.val());
  text.val('')
 }
});
const scrollMsg=()=>{
    let d=$('.chatWindow');
    d.scrollTop(d.prop("scrollHeight"));
}
const muteUnmute =()=>{
 const enabled=myVideoStream.getAudioTracks()[0].enabled;
 if(enabled){
     muteAudio();
    myVideoStream.getAudioTracks()[0].enabled=false;
 }
 else{
     unmuteAudio();
    myVideoStream.getAudioTracks()[0].enabled=true;
 }
}
const unmuteAudio=()=>{
    const newIcon=`<i class="fas fa-microphone "></i> <span>Mute</span>`
    document.querySelector('.muteButton').innerHTML=newIcon;
}
const muteAudio=()=>{
    const newIcon=`<i class="fas fa-microphone-slash color"></i> <span>Unmute</span>`
    document.querySelector('.muteButton').innerHTML=newIcon;
}
const playstop =()=>{
    const enabled=myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        stopVideo();
       myVideoStream.getVideoTracks()[0].enabled=false;
    }
    else{
        playVideo();
       myVideoStream.getVideoTracks()[0].enabled=true;
    }
}  
const stopVideo=()=>{
    const newIcon=`<i class="fas fa-video-slash color"></i> <span>Play Video</span>`
    document.querySelector('.videoButton').innerHTML=newIcon;
}
const playVideo=()=>{
    const newIcon=`<i class="fas fa-video"></i> <span>Stop Video</span>`
    document.querySelector('.videoButton').innerHTML=newIcon;
}










