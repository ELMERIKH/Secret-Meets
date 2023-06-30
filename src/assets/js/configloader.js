var showLinks = true;
var selectedUrl = "";

//Analytics
var analyticsOn = false;
var configLoaded = false;
var measurementLoaded = false;
var pageViewSent = false;

//Video Playback
var defaultAudio = '';
var defaultSubtitle = '';
var defaultVideoTrack = 'disneyplus';

$(document).ready(function() {

    var countryCode = getParameterByName("c");
 
});


//------------------------------------------------------------------------------
//Custom Functions
//------------------------------------------------------------------------------
function loadConfig(countryCode)
{
    $.ajax({
		type : "GET",
        // url: "https://www.theinvasionhasbegun.com/assets/config/" + countryCode +  ".json",
		url : "assets/config/" + countryCode + ".json",
		success : function(data) {
            updateFooterLinks(data.footer_links);
            updateOneTrust(data.onetrust);
            updateAnalytics(data.analytics, data.onetrust);

            defaultAudio = data.language;
            defaultSubtitle = data.default_subtitle;

            if (data.hotstar)
                defaultVideoTrack = "hotstar";
		},
		error : function(jqXHR, textStatus, errorThrown) {
            console.log("Error when requesting config: ", errorThrown);
			show404();
		}
	});
}

function verifyMeasurementLoaded(src)
{
    console.log("verifyMeasurementLoaded");
    if (src == "assets/js/analytics/appmeasurement.js")
        measurementLoaded = true;
    else if (src == "assets/js/analytics/configuration_dev.js" || src == "assets/js/analytics/configuration.js")
        configLoaded = true;

    if (measurementLoaded && configLoaded && !pageViewSent)
        trackPageView();
}

function show404()
{
    document.body.innerHTML = '';
    document.head.innerHTML = '';
}

function updateFooterLinks(footerLinks)
{
    $('#footer-links').empty();
    footerLinks.forEach((item) => {
        $('#footer-links').append('<li><a href="' + item.url + '" target="_blank" rel="noopener noreferrer" class="link-footer aw-independent">' + item.text + '</a></li>');
    });

}

function updateAnalytics(active, onetrust)
{
    if (onetrust && typeof OnetrustActiveGroups === 'undefined')
    {
        console.log("Waiting on OneTrust libraries to be loaded.")
        setTimeout (function () {updateAnalytics (active, onetrust);}, 100);
    }
    else
    {
        if (active && (!onetrust || OnetrustActiveGroups.includes('C0004')))
        {
            //Adobe libraries
            loadScript("assets/js/analytics/visitorapi.js");
            loadScript("assets/js/analytics/appmeasurement.js", verifyMeasurementLoaded);
            loadScript("assets/js/analytics/mediasdk.js");    
            loadScript("assets/js/analytics/notification.center.js");
            if (window.location.hostname.startsWith("dev"))
                loadScript("assets/js/analytics/configuration_dev.js", verifyMeasurementLoaded);
            else
                loadScript("assets/js/analytics/configuration.js", verifyMeasurementLoaded);
            loadScript("assets/js/analytics/video.player.js");

            analyticsOn = true;
        }
        else 
        {
            console.log("Analytics will not be loaded.")
        }
    }
}

function updateOneTrust(active)
{
    if (active)
    {
        document.cookie = "tihb_trigger=true";

        let scriptElement = document.createElement("script");
        scriptElement.setAttribute("data-domain-script", "0273282a-f3e5-405a-bd81-aede2b7fe857-test");
        scriptElement.setAttribute("charset", "UTF-8");
        scriptElement.setAttribute("src", "https://cdn.cookielaw.org/scripttemplates/otSDKStub.js");
        scriptElement.addEventListener("load", () => {
            console.log("OneTrust loaded")
        });
        document.body.appendChild(scriptElement);


        $('#footer-links').append('<li><a id="ot-sdk-btn" class="ot-sdk-show-settings Footer__link">Do Not Sell or Share My Personal Information</a></li>');
        if (window.OneTrust)
            document.getElementById('ot-sdk-btn').addEventListener('click', window.OneTrust.ToggleInfoDisplay);
    }
}

//------------------------------------------------------------------------------
//Util Functions
//------------------------------------------------------------------------------
function getParameterByName(name, url) 
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setCookie(cname, cvalue, exdays) 
{
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
function getCookie(cname) 
{
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function loadScript(src, callback)
{
    let scriptElement = document.createElement("script");
    scriptElement.setAttribute("src", src);
    scriptElement.addEventListener("load", () => {
        console.log(src + " loaded")
        if (callback)
        {
            callback(src);
        }
    });
    document.body.appendChild(scriptElement);
}

function trackPageView()
{
    pageViewSent = true;
    var s = s_gi(Configuration.APP_MEASUREMENT.RSID);
    s.trackingServer = Configuration.APP_MEASUREMENT.TRACKING_SERVER;
    s.pageName = "TheInvasionHasBegun:home";
    s.evar3 = s.pageName;
    s.prop3 = s.evar3;
    s.evar4 = window.location.href;
    s.prop4 = s.evar4;

    s.t();
    console.log("Page view counted");
}

function OptanonWrapper() 
{ 
    window.dataLayer.push({event:'OneTrustGroupsUpdated'}); 
    OneTrust.OnConsentChanged(function() {
        location.reload();
    });
}