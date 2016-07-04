var url = "./input/cdn.mpd";
var player = dashjs.MediaPlayer().create();

player.initialize();
player.attachView(document.querySelector("#videoPlayer"));
player.setAutoPlay(true);
