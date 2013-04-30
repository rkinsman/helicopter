function error() {
    alert('Stream generation failed.');
}

function getUserMedia(dictionary, callback) {
    try {
        navigator.webkitGetUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('webkitGetUserMedia threw exception :' + e);
    }
}

var lastTimeRun=0;

function gotStream(stream) {
	var context = new webkitAudioContext();  
    // Create an AudioNode from the stream.
    var microphone = context.createMediaStreamSource(stream);

    var levelChecker = context.createJavaScriptNode(4096, 1 ,1);
	microphone.connect(levelChecker);

    // Connect it to the destination.
    levelChecker.connect( context.destination );
    console.log("gotStream : " + microphone);

    var lastCall = new Date().getTime(); 

    levelChecker.onaudioprocess = function(e) {
        var buffer = e.inputBuffer.getChannelData(0);
        if(new Date().getTime() - lastCall > 100) {
        // Iterate through buffer to check if any of the values exceeds 1.
     
        for (var i = 0; i < buffer.length; i++) {
            if (1 <= buffer[i]) { 
                //var e = $.Event("keydown", { keyCode: 13 });
                //$(document).trigger(e);

                heliKeyDown({ keyCode: 13 });
                //setTimeout("heliKeyUp({keyCode:13})",50);
                keyUp = function () {
                    heliKeyUp({keyCode:13});
                }
                //setTimeout(keyUp, 100); 
                //console.log("Oh noes! We got a peak.", buffer[i]);
                return;
                }
            }
            heliKeyUp({keyCode:13}); 
            
        }
	}
}

function toggleLiveInput() {
    getUserMedia({audio:true}, gotStream);
}


