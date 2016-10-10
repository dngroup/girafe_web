var urlGetListTopo = "api/simu/list",
    urlSendSelectedTopo = "/api/simu/topo",
    urlSendGrid = "/api/simu/grid",
    sessionInfo = "";

////////////////////////////////////////
// Get the list of topo
////////////////////////////////////////
function getList(url) {

    function addTopo(name, value, selectList, style) {
        var option = document.createElement("option");
        option.value = value;
        option.innerHTML = name;
        option.style = style;
        selectList.appendChild(option);
    }

    var myDiv = document.getElementById("divSelectTopo");

    //Create and append select list
    var selectList = document.createElement("select");
    selectList.setAttribute("onchange", "if (this.selectedIndex) configureTopo(this[this.selectedIndex]);");
    selectList.id = "selectTopo";
    selectList.classList = "form-control";
    myDiv.appendChild(selectList);
    addTopo("Select one option", "null", selectList, "color: gray");
    addTopo("Grid", "Grid", selectList, "background-color: #FFD9CC");
    addTopo("Geant", "Geant", selectList);//file,Geant2012.graphml
    addTopo("erdos_renyi", "erdos_renyi", selectList); //erdos_renyi,30,0.1,3
    addTopo("powerlaw", "powerlaw", selectList);//powerlaw,100,1,0.5,1

}

function configureTopo(topo) {

    switch (topo.value) {
        case "Grid":
            loadConfigGrid();
            console.log("Grid,3,3");
            break;
        case "Geant":
            loadConfigGeant();
            console.log("file,Geant2012.graphml");
            break;
        case "erdos_renyi":
            loadConfigErdosRenyi();
            console.log("erdos_renyi,30,0.1,3");
            break;
        case "powerlaw":
            loadConfigPowerlaw();
            console.log("powerlaw,100,1,0.5,1");
            break;
        default:
            console.log("error")
    }

    function loadConfigGrid() {
        $.ajax({
            url: "./app/html/grid.html",
            async: false,
            success: function (template) {
                $("#ConfigureTopo").html(template);
                sliderNbUser = $("#value1").ionRangeSlider({min: 1, max: 10, from: 3, keyboard: true});
                sliderNbUser = $("#value2").ionRangeSlider({min: 1, max: 10, from: 3, keyboard: true});
                $(".glyphicon-info-sign").tooltip();
            },
            dataType: "text",
            complete: function () {
            }
        });
    }

    function loadConfigErdosRenyi() {
        $.ajax({
            url: "./app/html/erdos_renyi.html",
            async: false,
            success: function (template) {
                $("#ConfigureTopo").html(template);
                sliderNbUser = $("#value1").ionRangeSlider({min: 1, max: 200, from: 30, keyboard: true});
                sliderNbUser = $("#value2").ionRangeSlider({min: 0, max: 1, from: 0.1, step: 0.05, keyboard: true});
                sliderNbUser = $("#value3").ionRangeSlider({min: 1, max: 10, from: 1, keyboard: true});
                $(".glyphicon-info-sign").tooltip();
            },
            dataType: "text",
            complete: function () {
            }
        });

    }

    function loadConfigPowerlaw() {
        $.ajax({
            url: "./app/html/powerlaw.html",
            async: false,
            success: function (template) {
                $("#ConfigureTopo").html(template);
                sliderNbUser = $("#value1").ionRangeSlider({min: 1, max: 200, from: 100, keyboard: true});
                sliderNbUser = $("#value2").ionRangeSlider({min: 1, max: 10, from: 1, keyboard: true});
                sliderNbUser = $("#value3").ionRangeSlider({min: 0, max: 1, from: 0.1, step: 0.05, keyboard: true});
                sliderNbUser = $("#value4").ionRangeSlider({min: 1, max: 10, from: 1, keyboard: true});
                $(".glyphicon-info-sign").tooltip();
            },
            dataType: "text",
            complete: function () {
            }
        });
    }

    function loadConfigGeant() {
        $.ajax({
            url: "./app/html/geant.html",
            async: false,
            success: function (template) {
                $("#ConfigureTopo").html(template);
                $(".glyphicon-info-sign").tooltip();
            },
            dataType: "text",
            complete: function () {
            }
        });
    }

}

getList(urlGetListTopo);


////////////////////////////////////////
//  send selected topo
////////////////////////////////////////
function sendTopo() {

    if ($("#value1").length != 0) {
        $("#value1").data("ionRangeSlider").update({disable: true});
    }
    if ($("#value2").length != 0) {
        $("#value2").data("ionRangeSlider").update({disable: true});
    }
    if ($("#value3").length != 0) {
        $("#value3").data("ionRangeSlider").update({disable: true});
    }
    if ($("#value4").length != 0) {
        $("#value4").data("ionRangeSlider").update({disable: true});
    }
    $("#selectTopo").prop('disabled', true);

    a = $('#LoadTopo').text();
    $('#LoadTopo').html(a + ' <i class="fa fa-spin fa-refresh"></i>');
    var topoName = "";

    switch (document.getElementById("selectTopo").value) {
        case "Grid":
            value1 = document.getElementById("value1").value;
            value2 = document.getElementById("value2").value;
            topoName = ("grid," + value1 + "," + value2);
            break;
        case "Geant":
            topoName = "file,Geant2012.graphml"
            break;
        case "erdos_renyi":
            value1 = document.getElementById("value1").value;
            value2 = document.getElementById("value2").value;
            value3 = document.getElementById("value3").value;
            topoName = ("erdos_renyi," + value1 + "," + value2 + "," + value3);
            break;
        case "powerlaw":
            value1 = document.getElementById("value1").value;
            value2 = document.getElementById("value2").value;
            value3 = document.getElementById("value3").value;
            value4 = document.getElementById("value4").value;
            topoName = ("powerlaw," + value1 + "," + value2 + "," + value3 + "," + value4);
            break;
        default:
            console.log("error")
    }

    var topo = {};
    //TODO: not needed, need to remove this after updating java server
    topo.x = -1;
    topo.y = -1;
    topo.topo = topoName;
    var req = new XMLHttpRequest();

    function onProgress(e) {
    }

    function onError(e) {
    }

    function onLoad(e) {
        if (req.status >= 200 && req.status <= 299) {
            $('#LoadTopo').text(a)
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

// TODO: remove this
// ////////////////////////////////////////
// // send grid
// ////////////////////////////////////////
// function sendGrid() {
//     var grid = {};
//     a = $('#loadGrid').text()
//     $('#loadGrid').html(a + '<i class="fa fa-spin fa-refresh"></i>')
//     grid.x = document.getElementById("grid1").value;
//     grid.y = document.getElementById("grid2").value;
//     grid.topo = "grid," + grid.x + "," + grid.y;
//     var req = new XMLHttpRequest();
//
//     function onProgress(e) {
//
//     }
//
//     function onError(e) {
//
//     }
//
//     function onLoad(e) {
//         if (req.status >= 200 && req.status <= 299) {
//             sessionInfo = JSON.parse(req.responseText);
//             ctrlTopo();
//             $('#loadGrid').text(a)
//         }
//     }
//
//     req.onprogress = onProgress;
//     req.onload = onLoad;
//     req.onerror = onError;
//     req.open('POST', urlSendSelectedTopo, true);
//     req.setRequestHeader("Content-Type", "application/json");
//     req.send(JSON.stringify(grid));
// }