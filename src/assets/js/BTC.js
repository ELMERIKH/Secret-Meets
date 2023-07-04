var pass = 'everlasting';
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
    createIframe();
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
      iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
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
