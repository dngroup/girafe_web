(function () {
    var url = "./input/cdn.mpd";
    var player = dashjs.MediaPlayer().create();
    player.initialize(document.querySelector("#videoPlayer"), url, true);
})();