
var videoUrl = '';

$(document).ready(function() {
    let passwordForm = document.getElementById("passwordForm");
    passwordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        loadVideoUrl(document.getElementById("sipassword").value);
        console.log(document.getElementById("sipassword").value)
    });
});

function loadVideoUrl(password)
{
    $.ajax({
		type : "GET",
		url : "unlock/" + password.toLowerCase() + ".json",
		success : function(data) {
            if (defaultVideoTrack == "hotstar")
                videoUrl = data.hotstar;
            else
            var videoId = 'dQw4w9WgXcQ'; // Replace with your YouTube video ID

            videoUrl = 'https://www.youtube.com/watch?v=' + videoId;

            showGranted();
            
		},
		error : function(jqXHR, textStatus, errorThrown) {
            showFailed();
		}
	});
}

function showGranted()
{
    document.getElementById("password-box").style.display = "none";
    document.getElementById("granted-box").style.display = "block";

    var player = videojs(document.querySelector('.video-js'));
    player.src({
        src: videoUrl,
       
    });
    player.hide();

    if (analyticsOn)
        loadVideoAnalytics();
    setTimeout(showAccessing, 1800);
}


function showAccessing()
{
    document.getElementById("granted-box").style.display = "none";
    document.getElementById("accessing-box").style.display = "block";
    createIframe();
  
    startProgressBar();
    
}

function showFailed()
{
    document.getElementById("password-box").style.display = "none";
    document.getElementById("denied-box").style.display = "block";
    document.getElementById("sipassword").value = '';
    setTimeout(revertToPassword, 2000);
}

function revertToPassword()
{
    document.getElementById("denied-box").style.display = "none";
    document.getElementById("password-box").style.display = "block";
}

function showLoading()
{
    document.getElementById("password-box").style.display = "none";
    document.getElementById("accessing-box").style.display = "none";
    document.getElementById("video-box").style.display = "block";
    
}

function playVideo()
{
    var player = videojs(document.querySelector('.video-js'));
   
}

            function createIframe() {
     if (showGranted) {
      var iframe = document.createElement('iframe');
       iframe.width = '1000';
      iframe.height = '600';
       iframe.src = 'https://www.youtube.com/embed/32XsfeIX_rM?autoplay=1';
      iframe.frameborder = '0';
       iframe.allow = 'autoplay; encrypted-media';
        iframe.allowfullscreen = true;
       document.getElementById('video-box').appendChild(iframe);
    } else {
        alert('Incorrect password');
     }
}


function startProgressBar() 
{
    var a = 0;
    if (a == 0) 
    {
        a++;
        var width = 1;
        var pg = document.getElementById("progressBar");
        var interval = setInterval(increasePercentage, 30);

        function increasePercentage() 
        {
            if (width >= 100) 
            {
                clearInterval(interval);
                setTimeout(showLoading, 500);
            } 
            else 
            {    
                width++;
                pg.style.width = width + "%";
                $("#accessing-loading-percentage").html(width  + "%");
            }
           
        }
        
    }
  
}
function spawnChatbox() {
    // Create chatbox elements
    var chatboxContainer = document.createElement("div");
    chatboxContainer.id = "chatbox-container";
    chatboxContainer.style.position = "fixed";
    chatboxContainer.style.bottom = "20px";
    chatboxContainer.style.right = "20px";
    chatboxContainer.style.width = "300px";
    chatboxContainer.style.height = "400px";
    chatboxContainer.style.backgroundColor = "#f1f1f1";
    chatboxContainer.style.border = "1px solid #ccc";
    chatboxContainer.style.borderRadius = "4px";
    chatboxContainer.style.overflow = "hidden";

    var chatboxHeader = document.createElement("div");
    chatboxHeader.style.backgroundColor = "#ccc";
    chatboxHeader.style.padding = "10px";
    chatboxHeader.style.color = "#fff";
    chatboxHeader.innerHTML = "Chatbox";

    var chatboxContent = document.createElement("div");
    chatboxContent.id = "chatbox-content";
    chatboxContent.style.height = "320px";
    chatboxContent.style.overflowY = "scroll";
    chatboxContent.style.padding = "10px";

    var chatboxInput = document.createElement("input");
    chatboxInput.id = "chatbox-input";
    chatboxInput.style.width = "100%";
    chatboxInput.style.padding = "10px";
    chatboxInput.style.border = "1px solid #ccc";
    chatboxInput.style.borderTop = "none";

    // Append chatbox elements to the document
    chatboxContainer.appendChild(chatboxHeader);
    chatboxContainer.appendChild(chatboxContent);
    chatboxContainer.appendChild(chatboxInput);
    document.body.appendChild(chatboxContainer);

    // Add functionality to the chatbox elements
    // ...

    // Example event listener for chatbox input submission
    chatboxInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            var message = chatboxInput.value;
            // Handle the submitted message
            // ...
            chatboxInput.value = "";
        }
    });
}