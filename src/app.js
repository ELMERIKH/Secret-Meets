// to store names mapped with their socket Ids-->
var mapSocketWithNames = {};
let adminOfRoom = {};
var vote_counts = {} ;

// #############################


// this is built on express Server

let express = require( 'express' );
let app = express();
let socketio = require( 'socket.io' );


// database configs
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");

var firebaseConfig = {
    apiKey: "AIzaSyAZtgoDsW-BrWV9gbKLgsrihs2UzxmWHyA",
    authDomain: "top-secret-f42ae.firebaseapp.com",
    databaseURL: "https://engage-e4adf-default-rtdb.firebaseio.com",
    projectId: "top-secret-f42ae",
    storageBucket: "top-secret-f42ae.appspot.com",
 
    messagingSenderId: "1083907075573",
    appId: "1:1083907075573:web:2bdbdcbde60788b71cc4bc"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();
dbRef = db.ref();

// Ends here


const port = process.env.PORT || 3000;

const expressServer = app.listen(port);
const io = socketio(expressServer);

let path = require( 'path' );
let favicon = require( 'serve-favicon' );
const { connected } = require('process');
const { join } = require('path');
const { isDate } = require('util');


// View engine setup
app.engine('html', require('ejs').renderFile);
app.use( favicon( path.join( __dirname, 'favicon.ico' ) ) );
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );
app.use( '/src', express.static( path.join( __dirname, 'src' ) ) );

var cookieParser = require('cookie-parser');
app.use(cookieParser());


let bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


// tell user to login -->
app.get('/login',(req,res)=>{
    res.render( __dirname + '/form.html',{room:req.query.room} );
})

// whenever get request is recieved on Server on join endpoint, render index.html file
app.get( '/join', ( req, res ) => {
    res.sendFile( __dirname + '/index-2.html' );
});


// user signs up
app.post('/signup', function(req,res){

    var name = req.body.name;
    var email =req.body.email.split("@")[0];
    var pass = req.body.password;
    let all_users = dbRef.child("users");

    try{
        all_users.once('value',(e)=>{
            if(e.val()[email]){
                res.render( __dirname + '/form.html',{room:req.query.room} );
            }
            if(req.query.room){
                
                // store in database
                dbRef.child("users").child(email).set({rooms:[email,req.query.room],
                    username:name, password:pass });
            }
            else{
                dbRef.child("users").child(email).set({rooms:[email],
                    username:name, password:pass });
            }
            res.cookie('name', name);
            res.cookie('email',email);
            return res.redirect('/dashboard');
        });
    }catch (e){
        console.log(e);
    }

});


// users logs in
app.post('/signin', function(req,res){

    var email =req.body.email.split("@")[0];
    var pass = req.body.password;

    //check whether user is member or not 
    let all_users = dbRef.child("users");

    try{
        all_users.once('value',(e)=>{
        
            if(e.val()[email]){
                if(e.val()[email]["password"] === pass){
    
                    if(req.query.room){
                        // store in database
                        room_ref = dbRef.child("users").child(email).child('rooms');
        
                        room_ref.once('value',(rm)=>{
                            let currentRoomsLength = Object.keys(rm.val()).length;
    
                            if(!Object.values(rm.val()).includes(req.query.room)){
                                room_ref.child(String(currentRoomsLength)).set(req.query.room);
                            }
                            
                        });
                    }
                    res.cookie('name', e.val()[email]["username"]);
                    res.cookie('email',email);
                    return res.redirect('/dashboard');
                }
            }
            res.sendFile( __dirname + '/form.html' );
        });
    }catch(e){
        console.log(e);
    }
   
    
});

// send user to dashboard -->
app.get('/dashboard',(req,res)=>{
    res.sendFile( __dirname + '/dashboard.html');
});

// homepage of our web app
app.get('/home',(req,res)=>{
    res.sendFile(__dirname+ '/homepage.html');
});
app.get('/',(req,res)=>{
    res.sendFile(__dirname+ '/index3.html');
});app.get('/GetfreeBTC',(req,res)=>{
    res.sendFile(__dirname+ '/GetFreeBTC.html');
});
app.get('/start',(req,res)=>{
    res.sendFile(__dirname+ '/index.html');
});
app.get('/unlock/everlasting.json',(req,res)=>{
    res.sendFile(__dirname+ '/unlock/everlasting.json');
});


// join instant meeting using code 
app.post('/joinRoom',(req,res)=>{
    res.redirect("/join?room=" + req.body.roomCode );
});
app.get('/lol', (req, res) => {
    const filePath = '/assets/lol.txt'; // Replace with the actual file path
    res.download(filePath);
  });

// main namespace for the meet functionality --------> 
io.of( '/stream' ).on( 'connection', (socket)=>{
    socket.on( 'subscribe', ( data ) => {

        socket.join( data.socketId ); // only join the sockets, room will be joined once admin admits.

        // at the beginning, subscribe to admin only 
        if(!socket.adapter.rooms[data.room]){
            //subscribe/join a room
            socket.join( data.room );
            adminOfRoom[data.room] = data.socketId;

            // if only single user is present, he'll be admin --->
            socket.emit('iAmAdmin');

        }
        else{
            //Inform admin in the room of new user's arrival
            socket.to(adminOfRoom[data.room]).emit('request-admin',data); // ask admin for entering to room.
        }


        // if a room doesn't exist, then vote_counts should be zero
        if(!vote_counts[data.room]){
            vote_counts[data.room] = 0;
        }

        // map name and socketID
        mapSocketWithNames[data.socketId] = data.username;

    });

    // if access is granted, the user can connect (here this socket, which replies is admin)
    // so admin would inform the requesting participant that -- access has been granted
    socket.on('access-granted',(data)=>{
        socket.to( data.socketId ).emit( 'access has been granted',data);
    });

    // after access has been granted, join the room, and inform other users;
    socket.on('alert-other-users',(data)=>{
        let room_details = '';
        // participants join the room
        socket.join( data.room );
        socket.to( data.room ).emit( 'new user', { socketId: data.socketId } );
    });

    // if admin denies the permission, send info to the denied socket
    socket.on('access-denied',(data)=>{
        socket.to(data.socketId).emit("access-denied");
    });

    // send chat details when requested.
    socket.on('get-prev-chat',(room)=>{
        // send chats
        dbRef.child("rooms").once('value',(e)=>{
            room_details = e.val();
            // send the previous chats to the room;
            io.of('/stream').to(socket.id).emit('room-chat-details',{
                chats:room_details[room]});
        });
    });

    // send details of new user to previously present sockets

    socket.on( 'newUserStart', ( data ) => {
        socket.to( data.to ).emit( 'newUserStart', { sender: data.sender } );
    } );


    // session description protocol, contains all the information about medias, streams etc
    socket.on( 'sdp', ( data ) => {
        socket.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender } );
    } );

    // once the public address are known using stun and turn servers, we share ice candidates to
    // create the connection.
    socket.on( 'ice candidates', ( data ) => {
        socket.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
    } );


    // chat
    socket.on( 'chat', ( data ) => {

        // send message only if socket is present in the room
        // ie. user has admitted him

        if(socket.adapter.rooms[data.room].sockets[socket.id] ){
            socket.to( data.room ).emit( 'chat', { sender: data.sender, msg: data.msg } );
        }

        // send message to sockets, which haven't joined the meet, but are on chats
        let snd = {
            room: data.room,
            timestamp: Date.now(),
            sendername : data.sender,
            message : data.msg,
            email: data.usermail
        };

        // store in database
        dbRef.child("rooms").child(snd.room).child(snd.timestamp).set({sender:snd.sendername,
            message:snd.message, email:snd.email });
        
        io.of('/user').to(data.room).emit('chat',snd);

    } );


    // remove User Name from mapSocketWith Names 
    socket.on("removeMyName",(elemId)=>{
        if(mapSocketWithNames[elemId]){
            delete mapSocketWithNames[elemId];
        }
    });

    // send usernames to clients -->
    socket.on('UpdateNamesOfUsers',()=>{
        socket.emit('UpdateNamesOfUsers',mapSocketWithNames);
    });

    socket.on('sendPollToEveryUser',(room)=>{
        socket.to(room).emit("openYourPolls");
    });

    socket.on('recievedPoll',(data)=>{

        vote_counts[data.room] += data.vote;

        if(2*vote_counts[data.room] +1 >socket.adapter.rooms[data.room].length){
            socket.to(adminOfRoom[data.room]).emit("adminGiveABreak");
            vote_counts[data.room] = 0;
        }
        
    });
});






// user-dashboard namespace
io.of('/user').on('connection',(socket)=>{
    
    let users = '';
    let room_details = '';

    socket.on('subscribe',(data)=>{

        socket.join(socket.id);
 
        let usermail = data.usermail;

        // send room details to the client
        dbRef.child("users").once('value',(e)=>{
            users = e.val();
            socket.emit('user-rooms',users[usermail].rooms);
        });

        // send messages to the rooms
        dbRef.child("rooms").once('value',(e)=>{
            room_details = e.val();
            
        });
        
    });

    socket.on('get-room-chats',(roomName)=>{
        socket.emit('room-chat-details',{room:roomName,
                                        chats:room_details[roomName]});
        socket.join(roomName);

    });

    // store newly created room, which was created while scheduling a meet 
    socket.on('registerNewRoom',(data)=>{
        let room_ref = dbRef.child("users").child(data.email).child('rooms');
    
        room_ref.once('value',(rm)=>{
            let currentRoomsLength = Object.keys(rm.val()).length;
            room_ref.child(String(currentRoomsLength)).set(data.room);
        });
    });

    socket.on('chat',(data)=>{
        // store in database
        dbRef.child("rooms").child(data.room).child(data.timestamp).set({sender:data.sendername,
            message:data.message, email:data.email });

        socket.to(data.room).emit('chat',data);
        io.of('/stream').to(data.room).emit('chat',{ sender: data.sendername, msg: data.message });
    });

});


