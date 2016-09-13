var urlSLA = "/api/simu/sla",
    urlLCSLA = "/api/simu/LCsla",
    urlUsers = "/api/simu/users",
    slaDelay = 50,
    vcdnRatio = 0.70,
    nbUsersSla = 5000,
    bandwidthPerUser = 1.5,
    nbUser = 50,
    clients = [],
    cdns = [],
    table,
    dataSet = [],
    listToModify = "clients";

function setListToModify(value) {
    listToModify = value;
}

function getListToModify() {
    return listToModify;
}

sliderSla_delay = $("#sla_delay").ionRangeSlider({
    type: "single",
    min: 0,
    max: 200,
    from: slaDelay,
    keyboard: true,
    onFinish: function (data) {
        slaDelay = data.from;
    }
});
sliderVcdn_ratio = $("#vcdn_ratio").ionRangeSlider({
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
sliderNbUsersSla = $("#nbUsersSla").ionRangeSlider({
    type: "single",
    min: 0,
    max: 6000,
    from: nbUsersSla,
    step: 100,
    keyboard: true,
    onFinish: function (data) {
        nbUsersSla = data.from;
    }
});
sliderBandwidthPerUser = $("#bandwidthPerUser").ionRangeSlider({
    type: "single",
    min: 0,
    max: 10,
    from: bandwidthPerUser,
    disable: true,
    step: 0.1,
    keyboard: true,
    onFinish: function (data) {
        bandwidthPerUser = data.from;
    }
});
function loadsla(clients) {
    sliderNbUser = $("#nbUser").ionRangeSlider({
        type: "single",
        min: 0,
        max: clients * 2,
        from: clients * 0.75,
        keyboard: true,
        onChange: function (data) {

        },

        onFinish: function (data) {
            nbUser = data.from;
            submitUsers();
        }
    });
}


$(document).ready(function () {
    table = $('#myTable').DataTable({
        data: dataSet,
        columns: [
            {title: "ID"},
            {title: "Number of VMG"},
            {title: "Number of vCDN"},
            {title: "Cost."}
        ],
        // "paging":   false,
        "info": false,
        "searching": false,
        "order": [[3, "desc"]]
    });
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

function delAllClientCDN(number) {
    clients = [];
    cdns = [];
    updateCDN();
    updateClient();
}
var id = 0;
var set = new Set();
function addValueOnTable(vmg, vcdn, cost) {
    id++;
    if (! set.has(JSON.stringify([vmg, vcdn, cost]))){
        set.add(JSON.stringify([vmg, vcdn, cost]))

    table.row.add([id, vmg, vcdn, cost]).draw(false);
    }

}

///////////////////////////////////////////////////
// Submit
///////////////////////////////////////////////////

function submitSLA() {
    var req = new XMLHttpRequest(),
        data = {};

    $('#slainfo').html(" ")

    a = $('#sumbitsla').text()
    $('#sumbitsla').html('Submit <i class="fa fa-spin fa-refresh"></i>')
    data.cdns = cdns;
    data.clients = clients;
    data.sladelay = slaDelay;
    data.vcdnratio = vcdnRatio
    data.bandwidth = bandwidthPerUser * nbUsersSla * 1000 * 1000;
    data.sessionId = sessionInfo.sessionId
    data.vcdn = document.getElementById("vcdn").value;
    data.vmg = document.getElementById("vmg").value;
    function onProgress(e) {

    }

    function onloadstart(e) {
    };

    function onError(e) {

    }

    function onLoad(e) {
        $('#sumbitsla').text(a)
        if (req.status >= 200 && req.status <= 299) {
            //alert("Cost of the service for the ISP : " + (req.response / 1000) + " KEUR ");
            console.log(req.response);
            res = JSON.parse(req.response);
            addValueOnTable(res.vmg, res.vcdn, res.costs);
            ctrlSLA();
            loadsla(nbUsersSla);
            submitUsers();

        }
        else if (req.status >= 400 && req.status <= 599) {
            //alert("Cost of the service for the ISP : " + (req.response / 1000) + " KEUR ");
            console.log(req.response);
            $('#sumbitsla').html(a+' <i class="fa fa-close"></i>')
            $('#slainfo').html('<span class="badge bg-red"> Error: No solution found </span>')

        }
    }

    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('POST', urlSLA, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
}


function optimalSLA() {
    $('#slainfo').html(" ")

    a = $('#sumbitosla').text()
    $('#sumbitosla').html(a+'<i class="fa fa-spin fa-refresh"></i>')
    var req = new XMLHttpRequest(),
        data = {};

    data.cdns = cdns;
    data.clients = clients;
    data.sladelay = slaDelay;
    data.vcdnratio = vcdnRatio;
    data.bandwidth = bandwidthPerUser * nbUsersSla * 1000 * 1000;
    data.sessionId = sessionInfo.sessionId;
    function onProgress(e) {

    }

    function onError(e) {

    }

    function onLoad(e) {
        $('#sumbitosla').text(a)
        if (req.status >= 200 && req.status <= 299) {
            console.log(req.response)
            res = JSON.parse(req.response);
            addValueOnTable(res.vmg, res.vcdn, res.costs);
            ctrlSLA();
            loadsla(nbUsersSla);
        }
        else if (req.status >= 400 && req.status <= 599) {
            //alert("Cost of the service for the ISP : " + (req.response / 1000) + " KEUR ");
            console.log(req.response);
            $('#sumbitosla').html(a+'<i class="fa fa-close"></i>')
            $('#slainfo').html('<span class="badge bg-red"> Error: No solution found </span>')
        }
    }

    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('POST', urlLCSLA, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
}

function submitUsers() {
    var req = new XMLHttpRequest(),
        data = {};

    data.sessionId = sessionInfo.sessionId;
    data.nbusers = nbUser / nbUsersSla * 100;

    function onProgress(e) {

    }

    function onError(e) {

    }

    function onLoad(e) {
        if (req.status >= 200 && req.status <= 299) {

        }
    }
    if (data.nbusers>120){
        player.setQualityFor("video", 0);
    }
    if (data.nbusers<120){
        player.setQualityFor("video", 1);
    }

    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('POST', urlUsers, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
}
