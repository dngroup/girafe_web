// var url = ";
var player = dashjs.MediaPlayer().create();

player.initialize();
player.setBufferTimeAtTopQuality(5);
// player.setBufferTimeAtTopQualityLongForm(5);
// player.setBufferToKeep(5);
player.attachView(document.querySelector("#videoPlayer"));
player.setAutoPlay(true);

////////////////HD
var playerHD = dashjs.MediaPlayer().create();

playerHD.initialize();
playerHD.attachView(document.querySelector("#videoPlayerHD"));
playerHD.setAutoPlay(true);

////////////////SD
var playerSD = dashjs.MediaPlayer().create();

playerSD.initialize();
playerSD.attachView(document.querySelector("#videoPlayerSD"));
playerSD.setAutoPlay(true);
