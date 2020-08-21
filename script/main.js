const mediaStatus = document.getElementById('status');
const audioElement = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const recordBtn = document.getElementById('recordbtn');
const downloadBtn = document.getElementById('downloadBtn');
const timer = document.getElementById('timer')

// global init;

var mediaRecorder

// array init of chunk data

var blobArray = [];


// event listner

playPauseBtn.addEventListener('click', audioController);
recordBtn.addEventListener('click', recordController);
downloadBtn.addEventListener('click', downloadAudio);

// initial function call
accessMedia();


// check has media or not
function hasAudioDevice(){
    if(navigator.mediaDevices){
        return true
    }
    return false
}

function addAudioStream(){

    const blob = blobStreamData();
    if(blobArray){
        const audioURL = window.URL.createObjectURL(blob);
        audioElement.src = audioURL;

    }
}

async function accessMedia(){
    const constraints ={
        audio: {
            echoCancellation: false,
            noiseSuppression: true,
        }
    }
    if (hasAudioDevice) {
        await navigator.mediaDevices.getUserMedia(constraints).then( stream =>{
            activityStream(stream);
        }).catch( err =>{
            console.log(err);
        })
    }
}

// media recorder class & property init
function activityStream(stream){

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = addDataToArray;

}

function recordController(){
    if (mediaRecorder.state ==="recording") {
        stopRecording();
    }else {
      startRecording();
    }
}

function startRecording(){
    mediaRecorder.start();
    mediaStatus.innerHTML = mediaRecorder.state;
    recordBtn.style.backgroundImage = `url('${window.location.href}img/stop.png')`;
}

function stopRecording(){
    mediaRecorder.stop();
    mediaStatus.innerHTML = mediaRecorder.state;
    recordBtn.style.backgroundImage = `url('${window.location.href}img/record.png')`;
    
}



// adding recording to array

var addDataToArray = function(event){
    
    
    if(event.data.size > 0){
        blobArray.push(event.data);
    }
}


// audio play pause control
function audioController(){
    
    if(!audioElement.paused){
        audioElement.pause();
        
    }else {
        addAudioStream();
      audioElement.play(10);
    }
}

// audio callback on playing function
audioElement.onplaying = function (e){
    if (e) {
        playPauseBtn.style.backgroundImage = `url('${window.location.href}img/pause.png')`;
    }
}

// audio callback on pause function
audioElement.onpause = function (e){
    if (event) {
        playPauseBtn.style.backgroundImage = `url(${window.location.href}img/playpause-btn.png)`;
    }
    
}

// returning blob data
function blobStreamData(){
    return new Blob(blobArray, {
        type: 'audio/webm; codecs=opus'
    })
}

// download audio in file 
function downloadAudio(){
    const blobStream = blobStreamData();

    if (blobArray.length > 0) {
        var url = URL.createObjectURL(blobStream);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = `audio-recorder${new Date()}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        
    }else {
      console.log('No Data');
      
    }
}
