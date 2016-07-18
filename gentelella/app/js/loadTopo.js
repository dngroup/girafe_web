var urlGetListTopo = "api/simu/list",
    urlSendSelectedTopo = "/api/simu/topo",
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

    function addTopo(name, value, selectList) {
        var option = document.createElement("option");
        option.value = value;
        option.text = name;
        selectList.appendChild(option);
    }

    function onLoad(e) {
        if (req.status == 200) {
            listTopo = req.responseText;
            if (listTopo.length > 0) {
                var myDiv = document.getElementById("divSelectTopo");

                //Create and append select list
                var selectList = document.createElement("select");
                selectList.id = "selectTopo";
                selectList.classList = "form-control"
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
        else {
            var myDiv = document.getElementById("divSelectTopo");

            //Create and append select list
            var selectList = document.createElement("select");
            selectList.id = "selectTopo";
            selectList.classList = "form-control"
            myDiv.appendChild(selectList);
            addTopo("Geant", "file,Geant2012.graphml", selectList);
            addTopo("erdos_renyi,30,0.1,3", "erdos_renyi,30,0.1,3", selectList);
            addTopo("powerlaw,100,1,0.5,1", "powerlaw,100,1,0.5,1", selectList);
            addTopo("erdos_renyi random", "erdos_renyi,30,0.1,$(random)", selectList);


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
    var topo = {};
    topo.x=-1;
    topo.y=-1;
    topo.topo = document.getElementById("selectTopo").value;
    if (topo.topo.indexOf("$(random)") >= 0) {
        topo.topo = topo.topo.replace("$(random)", Math.floor(Math.random() * (9999)))
    }

    var req = new XMLHttpRequest();

    function onProgress(e) {

    }

    function onError(e) {

    }

    function onLoad(e) {
        if (req.status >= 200 && req.status <= 299) {
            sessionInfo = JSON.parse(req.responseText);
            ctrlTopo();
        }
    }

    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;


    req.open('POST', urlSendSelectedTopo, true);
    req.setRequestHeader("Content-Type", "application/json");

    req.send(JSON.stringify(topo));
}

////////////////////////////////////////
// send grid
////////////////////////////////////////
function sendGrid() {
    var grid = {};
    grid.x = document.getElementById("grid1").value;
    grid.y = document.getElementById("grid2").value;
    grid.topo = "grid," + grid.x + "," +grid.y;
    var req = new XMLHttpRequest();

    function onProgress(e) {

    }

    function onError(e) {

    }

    function onLoad(e) {
        if (req.status >= 200 && req.status <= 299) {
            sessionInfo = JSON.parse(req.responseText);
            ctrlTopo();
        }
    }

    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('POST', urlSendSelectedTopo, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(grid));
}