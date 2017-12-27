// ==UserScript==
// @name         rule34hentai
// @namespace    R34H
// @version      1.0
// @author       Damian666x
// @match        https://rule34hentai.net/*
// ==/UserScript==

//Calculates the total number of items in the given tag(s).
try { //Make it non-fuckappable.
    $("#image-list :header").html("Images (Total: checking... )");
    $('#paginator .blockbody a').each(function(index){
        if ( $('#paginator .blockbody a:eq(' + index + ')').html() == 'Last' ) {
            var Total_Page_Thumbs = $('.shm-image-list > *' ).length;
            var Total_Pages = $('#paginator .blockbody a:eq(' + index + ')').attr('href').split("/").reverse()[0];
            $.get( "https://rule34hentai.net" + $('#paginator .blockbody a:eq(' + index + ')').attr('href'), function(data){
                var Last_Page_Thumbs = data.split("thumb shm-thumb shm-thumb-link").length - 1;
                var Total_Images = (Total_Page_Thumbs * (Total_Pages-1))+Last_Page_Thumbs;
                $("#image-list :header").html("Images (Total: " + Total_Images + ")");
            });
        }});
}catch(err){} //We don't care to catch. We use "try" to prevent the script from failing as a whole since web scripts are dogshit.

//Assigning prerequisite functions.
function addGlobalStyle(css) { //Not my function, copy pasted and it worked, can't be bothered understanding how it works.
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
function insertAfter(referenceNode, newNode) { //A function to easily insert new elements after the reference elements.
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

//Adding style before everything so that when the script fails, styles work.
addGlobalStyle(`
#VideoPlayer {
    max-height:100vh;
}
#main_image {
    max-height:100vh;
}
.video_range {
    -webkit-appearance: none;
    appearance: none;
    width: calc(100% - 65px);
    height: 5px;
    background: #000;
    outline: none;
    opacity: 0.6;
    -webkit-transition: .2s;
    transition: opacity .2s;
}
.video_range:hover {
    background: #055;
    opacity: 1;
    -webkit-transition: .5s;
}
.video_range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 11px;
    height: 11px;
    background: #F00;
    cursor: pointer;
}
.video_range::-webkit-slider-thumb:hover {
    background: #0FF;
    -webkit-transition: .2s;
}
`);

//If Video is not converted, make a video element with "Image Only"'s action attribute as source. If it is converted, just assign an ID.
if ($('#Videomain .blockbody > video').length === 0) {
    $("#Videomain .blockbody").html(`
<video id="VideoPlayer" width="100%" controls loop preload="metadata">
<source src="https://rule34hentai.net` + $('#Image_Controlsleft .blockbody form:eq(3)').attr( 'action' ) + `">
Your browser does not support HTML5 video.
</video>
    `);
} else {
    $('#Videomain .blockbody > video').attr('id','VideoPlayer');
}

//Creating and inserting "Videocontrol" element after "Videomain" (Below the video).
var NewElement = document.createElement("Section"); NewElement.id = "VideoControl";
NewElement.innerHTML = `
<h3 data-toggle-sel="#Videocontrol" class="" style="cursor: pointer;">Video Controls ↧</h3>
<div class="blockbody">

<div style="position: absolute;margin-top:1px;">
<div>Playback Speed:</div>
<div>Brightness:</div>
<div>Contrast:</div>
<div>Saturation:</div>
<div>Hue:</div>
<div>Sepia:</div>
<div>Invert</div>
</div>
<div style="margin-left:110px;">
<div><input id="video_speed" class="video_range" type="range" value="1" step="0.1" min="0.1" max="10">
<span id="video_speed-value">1x</span></div>
<div><input id="video_brightness" class="video_range" type="range" value="100" step="5" min="0" max="1000">
<span id="video_brightness-value">100%</span></div>
<div><input id="video_contrast" class="video_range" type="range" value="100" step="5" min="0" max="1000">
<span id="video_contrast-value">100%</span></div>
<div><input id="video_saturation" class="video_range" type="range" value="100" step="5" min="0" max="1000">
<span id="video_saturation-value">100%</span></div>
<div><input id="video_hue" class="video_range" type="range" value="0" min="0" max="360">
<span id="video_hue-value">0°</span></div>
<div><input id="video_sepia" class="video_range" type="range" value="0" step="0.01" min="0" max="1">
<span id="video_sepia-value">0%</span></div>
<div><input id="video_invert" class="video_range" type="range" value="0" step="0.01" min="0" max="1">
<span id="video_invert-value">0%</span></div>
</div>
</div>
`; insertAfter(document.getElementById("Videomain"), NewElement);

//Adding an option to hide Video controlls by clicking on the "Videocontrol"'s header (title).
$("#VideoControl :header").click(function(){
    var VideoControl = $("#VideoControl .blockbody");
    if (VideoControl.attr('style') === "display:none") {
        VideoControl.attr('style','display:block');
    } else {
        VideoControl.attr('style','display:none');
    }
});

//Setting Video volume to 1%.
$("#VideoPlayer").prop("volume", 0.01);

//Assigning function for sliders.
$("input").on('input',function () {
  var video = $("#VideoPlayer");
  var speed = $("#video_speed").val();
  var saturation = $("#video_saturation").val();
  var hue = $("#video_hue").val();
  var brightness = $("#video_brightness").val();
  var contrast = $("#video_contrast").val();
  var invert = $("#video_invert").val();
  var sepia = $("#video_sepia").val();
  video.css('-webkit-filter', 'brightness('+brightness+'%) contrast('+contrast+'%) hue-rotate('+hue+'deg) sepia('+sepia+') invert('+invert+') saturate('+saturation+'%)');
  video[0].playbackRate = speed;
  $("#video_speed-value").text(speed + "x");
  $("#video_saturation-value").text(saturation + "%");
  $("#video_hue-value").text(hue + "°");
  $("#video_brightness-value").text( brightness + "%");
  $("#video_contrast-value").text(contrast + "%");
  $("#video_invert-value").text(Math.round(invert * 100) + "%");
  $("#video_sepia-value").text(Math.round(sepia * 100) + "%");
});
