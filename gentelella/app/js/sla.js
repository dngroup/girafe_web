var urlSLA = "http://localhost:9000/api/simu/sla",
    urlUsers = "http://localhost:9000/api/simu/users",
    slaDelay = 10,
    vcdnRatio = 0.35,
    bandwidthTotal = 800000000,
    nbUser = 10,
    clients = [],
    cdns = [],
    listToModify = "clients";

function setListToModify(value) {
    listToModify = value;
}

function getListToModify() {
    return listToModify;
}

$("#sla_delay").ionRangeSlider({
    type: "single",
    min: 0,
    max: 100,
    from: slaDelay,
    keyboard: true,
    onFinish: function (data) {
        slaDelay = data.from;
    }
});
$("#vcdn_ratio").ionRangeSlider({
    type: "single",
    min: 0,
    max: 1,
    from: vcdnRatio,
    step: 0.01,
    keyboard: true,
    onFinish: function (data) {
        vcdnRatio = data.from;
    }
});
$("#bandwidth").ionRangeSlider({
    type: "single",
    min: 0,
    max: 1000000000,
    from: bandwidthTotal,
    step: 10000,
    keyboard: true,
    onFinish: function (data) {
        bandwidthTotal = data.from;
    }
});
$("#nbUser").ionRangeSlider({
    type: "single",
    min: 0,
    max: 100,
    from: nbUser,
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
    for (i = 0; i < clients.length; i++) {
        output += '<span class="badge bg-green">' + clients[i] + "</span> ";
    }
    document.getElementById('react-content-client').innerHTML = output;
}

function updateCDN() {
    var output = "";
    for (i = 0; i < cdns.length; i++) {
        output += '<span class="badge bg-red">' + cdns[i] + "</span> ";
    }
    document.getElementById('react-content-cdn').innerHTML = output;
}

function addClient(number) {
    if (clients.indexOf(number) === -1) {
        clients.push(number);
    }
    updateClient();
}

function addCDN(number) {
    if (cdns.indexOf(number) === -1) {
        cdns.push(number);
    }
    updateCDN()
}

function delClient(number) {
    if (clients.indexOf(number) !== -1) {
        clients.splice(clients.indexOf(number), 1);
    }
    updateClient();
}

function delCDN(number) {
    if (cdns.indexOf(number) !== -1) {
        cdns.splice(cdns.indexOf(number), 1);
    }
    updateCDN()
}

///////////////////////////////////////////////////
// Submit
///////////////////////////////////////////////////
function submitSLA() {
    var req = new XMLHttpRequest(),
        data = {};

    data.cdns = cdns;
    data.clients = clients;
    data.sladelay = slaDelay;
    data.vcdnratio = vcdnRatio
    data.bandwidth = bandwidthTotal;
    data.sessionId = sessionInfo.sessionId
    data.vCDN = document.getElementById("vCDN").value;
    data.VMG = document.getElementById("VMG").value;
    function onProgress(e) {

    }

    function onError(e) {

    }

    function onLoad(e) {
        if (req.status >= 200 && req.status <= 299) {
            ctrlSLA();

        }
    }

    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('POST', urlSLA, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
}

function submitUsers() {
    var req = new XMLHttpRequest(),
        data = {};

    data.sessionId = sessionInfo.sessionId;
    data.nbusers = nbUser;

    function onProgress(e) {

    }

    function onError(e) {

    }

    function onLoad(e) {
        if (req.status >= 200 && req.status <= 299) {

        }
    }

    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('POST', urlUsers, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
}