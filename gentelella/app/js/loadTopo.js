var urlGetListTopo = "",
    urlSendSelectedTopo = "",
    urlSendGrid = "/api/simu/grid",
    sessionInfo = "";

////////////////////////////////////////
// Get the list of topo from the server
////////////////////////////////////////
var listTopo = [];
function getList(url) {
    var req = new XMLHttpRequest();

    function onProgress(e) {

    }

    function onError(e) {

    }

    function onLoad(e) {
        if(req.status == 200) {
            listTopo = req.responseText;
            if (listTopo.length > 0) {
                var myDiv = document.getElementById("divSelectTopo");

                //Create and append select list
                var selectList = document.createElement("select");
                selectList.id = "selectTopo";
                selectList.classList="form-control"
                myDiv.appendChild(selectList);

                //Create and append the options
                for (var i = 0; i < listTopo.length; i++) {
                    var option = document.createElement("option");
                    option.value = listTopo[i];
                    option.text = i;
                    selectList.appendChild(option);
                }
            }
        }
    }
    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('GET', url, true);
    req.send(null);

}

getList(urlGetListTopo);


////////////////////////////////////////
//  send selected topo
////////////////////////////////////////
function sendTopo() {
    var topo = document.getElementById("selectTopo").value;

    var req = new XMLHttpRequest();
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
    req.open('POST', urlSendSelectedTopo, true);
    req.send(topo);
}

////////////////////////////////////////
// send grid
////////////////////////////////////////
function sendGrid() {
    var grid = {};
    grid.x = document.getElementById("grid1").value;
    grid.y = document.getElementById("grid2").value;

    var req = new XMLHttpRequest();
    function onProgress(e) {

    }

    function onError(e) {

    }

    function onLoad(e) {
        if(req.status >= 200 && req.status <= 299) {
            sessionInfo = JSON.parse(req.responseText);
            ctrlTopo();
        }
    }
    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('POST', urlSendGrid, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(grid));
}