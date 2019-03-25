// Matthew Threader - 101034977
// Assignment 3 - Multi-User Interaction - Egg Hunt

const express   = require('express');
const app       = express();
const http      = require('http');
const server    = http.createServer(app);
const socketIO  = require('socket.io')(server);

const LISTEN_PORT = 8080; //make sure greater than 3000. Some ports are reserved/blocked by firewall ...
let isHOSTReady = false;
let isCLIENTReady = false;
let BeginStopWatch = false;
let GameActive = false;
let GameComplete = false;
let EGGSleft = 5;

let EGG1Collected = false;
let EGG2Collected = false;
let EGG3Collected = false;
let EGG4Collected = false;
let EGG5Collected = false;

var dateStart = new Date();
var timeStart = 0;
var timeoffest = 0;
var i = 0;

app.use((express.static(__dirname + '/public'))); //set root dir to the public folder

//routes
app.get('/HOST', function(req,res) {
    res.sendFile(__dirname + '/public/HOST.html');
});

app.get('/CLIENT', function(req,res) {
    res.sendFile(__dirname + '/public/CLIENT.html');
});

//websocket stuff
socketIO.on('connection', function(socket) {
    console.log(socket.id + ' has connected!');
    timeStart = dateStart.getTime();
    timeoffest = 0;
    isHOSTReady = false;
    isCLIENTReady = false;
    BeginStopWatch = false;
    GameActive = false;
    var i = 0;

    socket.on('disconnect', function(data) {
        console.log(socket.id + ' has disconnected');
    });

    //Player Host postion and rotation

    socket.on('position_HOST', function(data){
        socketIO.sockets.emit('GetPosition_HOST', data);
    });


    socket.on('rotation_HOST', function(data){
        socketIO.sockets.emit('GetRotation_HOST', data);
    });

        //Player Client postion and rotation

    socket.on('position_CLIENT', function(data){
        socketIO.sockets.emit('GetPosition_CLIENT', data);
    });
    

    socket.on('rotation_CLIENT', function(data){
        socketIO.sockets.emit('GetRotation_CLIENT', data);
    });

    //EGG COLLECTion CHECKS

    socket.on('EGG1Collected', function(data){
        if(!EGG1Collected)
        {
            EGGSleft--;
            EGG1Collected = true
            console.log(EGGSleft);
        }
    });

    socket.on('EGG2Collected', function(data){
        if(!EGG2Collected)
        {
            EGGSleft--;
            EGG2Collected = true
            console.log(EGGSleft);
        }
    });

    socket.on('EGG3Collected', function(data){
        if(!EGG3Collected)
        {
            EGGSleft--;
            EGG3Collected = true
            console.log(EGGSleft);
        }
    });

    socket.on('EGG4Collected', function(data){
        if(!EGG4Collected)
        {
            EGGSleft--;
            EGG4Collected = true
            console.log(EGGSleft);
        }
    });

    socket.on('EGG5Collected', function(data){
        if(!EGG5Collected)
        {
            EGGSleft--;
            EGG5Collected = true
            console.log(EGGSleft);
        }
    });

    socket.on('EGG2Collected', function(data){
        
    });

    //Ready Up Phase

    socket.on('PlayerReady_HOST', function(data){
        if(data)
        {
            socketIO.sockets.emit('ShowReady_HOST', data);
            isHOSTReady = true;
        }
    });

    socket.on('PlayerReady_CLIENT', function(data){
        if(data)
        {
            socketIO.sockets.emit('ShowReady_CLIENT', data);
            isCLIENTReady = true;
        }
    });

    //Collection Check

    setInterval(function(){ 

        if(EGG1Collected && EGG2Collected && EGG3Collected && EGG4Collected && EGG5Collected && !GameComplete)
        {
            console.log("ALL EGGS COLLECTED");
            GameComplete = true;
            socketIO.sockets.emit('GameFinish', GameComplete);
        }

        if(isHOSTReady && isCLIENTReady &&  !BeginStopWatch && !GameActive && !GameComplete)
        {
            
            timeStart = dateStart.getTime();
            BeginStopWatch = true;
            GameActive = true;
            socketIO.sockets.emit('GameState', GameActive);
        }

    }, 1000);

    setInterval(function(){ 

        //Timer Stuff
        if(BeginStopWatch)
        {
            var dateCurrent = new Date();
            var timeCurrent = dateCurrent.getTime();
            time = (timeCurrent - timeStart)/1000;
            if (i <= 0){timeoffest = time;}
            i++;
            socketIO.sockets.emit('TIME', time - timeoffest);
            
            if(GameComplete)
            {
                TotalTime = time - timeoffest;
                BeginStopWatch = false;
                console.log("FINAL TIME" + TotalTime);
                socketIO.sockets.emit('FINALTIME', TotalTime);
            }
        }
    }, 10);

});

//finally, start server
server.listen(LISTEN_PORT);
console.log('listening to port: ' + LISTEN_PORT);