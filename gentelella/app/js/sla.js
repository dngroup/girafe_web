var urlSLA="http://localhost:9000/api/simu/sla",
    slaDelay=10,
    vcdnRatio=10,
    bandwidthTotal=10,
    nbUser=10,
    clients = [],
    cdns = [],
    listToModify = "clients";

function setListToModify(value){
    listToModify = value;
}

function getListToModify() {
    return listToModify;
}

$("#sla_delay").ionRangeSlider({
    type: "single",
    min: 0,
    max: 100,
    from: 10,
    keyboard: true,
    onFinish: function (data) {
        slaDelay = data.from;
    }
});
$("#ucd_ratio").ionRangeSlider({
    type: "single",
    min: 0,
    max: 100,
    from: 10,
    keyboard: true,
    onFinish: function (data) {
        vcdnRatio = data.from;
    }
});
$("#bandwidth").ionRangeSlider({
    type: "single",
    min: 0,
    max: 100,
    from: 10,
    keyboard: true,
    onFinish: function (data) {
        bandwidthTotal = data.from;
    }
});
$("#nbUser").ionRangeSlider({
    type: "single",
    min: 0,
    max: 100,
    from: 10,
    keyboard: true,
    onFinish: function (data) {
        nbUser = data.from;
    }
});

/////////////////////////////////////////////////
// Repeat elements
/////////////////////////////////////////////////
function updateClient() {
    var output = "";
    for(i=0;i<clients.length;i++){
        output += clients[i] + " ";
    }
    document.getElementById('react-content-client').innerHTML = output;
}

function updateCDN() {
    var output = "";
    for(i=0;i<cdns.length;i++){
        output += cdns[i] + " ";
    }
    document.getElementById('react-content-cdn').innerHTML = output;
}

function addClient(number){
    if(clients.indexOf(number) === -1) {
        clients.push(number);
    }
    updateClient();
}

function addCDN(number){
    if(cdns.indexOf(number) === -1) {
        cdns.push(number);
    }
    updateCDN()
}

function delClient(number){
    if(clients.indexOf(number) !== -1 ) {
        clients.splice(clients.indexOf(number), 1);
    }
    updateClient();
}

function delCDN(number){
    if(cdns.indexOf(number) !== -1) {
        cdns.splice(cdns.indexOf(number), 1);
    }
    updateCDN()
}

///////////////////////////////////////////////////
// Submit
///////////////////////////////////////////////////
function submitSLA(){
    var req = new XMLHttpRequest(),
        data = {};

    data.cdns = cdns;
    data.clients = clients;
    data.sladelay = slaDelay;
    data.vcdnratio = vcdnRatio
    data.bandwidth = bandwidthTotal;
    data.nbuser = nbUser;

    function onProgress(e) {

    }

    function onError(e) {

    }

    function onLoad(e) {
        if(req.status >= 200 && req.status <= 299) {

        }
    }
    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('POST', urlSLA, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
}