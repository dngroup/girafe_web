var basetopo = "",
    urlGetListTopo = basetopo + "api/simu/list",
    urlSendSelectedTopo = basetopo + "api/simu/topo",
    urlUploadTopo = basetopo + "api/simu/upload",
    sessionInfo = "",
    cpumin = 0,
    cpumax = 2000,
    cpudeflaut = 1500,
    delaymin = 0,
    delaymax = 200,
    delaydefault = 3;

// //////////////////////////////////////
// Get the list of topo
// //////////////////////////////////////
function getList(url) {

    function addTopo(name, value, selectList, style) {
        var option = document.createElement("option");
        option.value = value;
        option.innerHTML = name;
        option.style = style;
        selectList.appendChild(option);
    }

    var myDiv = document.getElementById("divSelectTopo");

    // Create and append select list
    var selectList = document.createElement("select");
    selectList.setAttribute("onchange",
        "if (this.selectedIndex) configureTopo(this[this.selectedIndex]);");
    selectList.id = "selectTopo";
    //noinspection JSAnnotator
    selectList.classList = "form-control";
    myDiv.appendChild(selectList);
    addTopo("Select one option", "null", selectList, "color: gray");
    addTopo("Grid", "Grid", selectList, "background-color: #FFD9CC");
    addTopo("Geant", "Geant", selectList);// file,Geant2012.graphml
    addTopo("erdos_renyi", "erdos_renyi", selectList); // erdos_renyi,30,0.1,3
    addTopo("powerlaw", "powerlaw", selectList);// powerlaw,100,1,0.5,1
    addTopo("Upload your GraphML file", "upload", selectList);//
    addTopo("Create your Topology", "create", selectList);//
}

function configureTopo(topo) {


    switch (topo.value) {
        case "Grid":
            loadConfigGrid();
            break;
        case "Geant":
            loadConfigGeant();
            break;
        case "erdos_renyi":
            loadConfigErdosRenyi();
            break;
        case "powerlaw":
            loadConfigPowerlaw();
            break;
        case "upload":
            loaduploadfrom();
            break;
        case "create":
            networkload();
            loadCreate();
            break;
        default:
            console.log("error")
    }

    function loadConfigGrid() {
        $.ajax({
            url: "./app/html/grid.html",

            success: function (template) {
                $("#ConfigureTopo").html(template);
                $("#value1").ionRangeSlider({
                    min: 1,
                    max: 10,
                    from: 3,
                    keyboard: true
                });
                $("#value2").ionRangeSlider({
                    min: 1,
                    max: 10,
                    from: 3,
                    keyboard: true
                });

                $("#bw").ionRangeSlider({
                    from: 36,
                    values: ["1 Mbps", "2 Mbps", "3 Mbps", "4 Mbps",
                        "5 Mbps", "6 Mbps", "7 Mbps", "8 Mbps",
                        "9 Mbps", "10 Mbps", "20 Mbps", "30 Mbps",
                        "40 Mbps", "50 Mbps", "60 Mbps", "70 Mbps",
                        "80 Mbps", "90 Mbps", "100 Mbps",
                        "200 Mbps", "300 Mbps", "400 Mbps",
                        "500 Mbps", "600 Mbps", "700 Mbps",
                        "800 Mbps", "900 Mbps", "1 Gbps", "2 Gbps",
                        "3 Gbps", "4 Gbps", "5 Gbps", "6 Gbps",
                        "7 Gbps", "8 Gbps", "9 Gbps", "10 Gbps",
                        "20 Gbps", "30 Gbps", "40 Gbps", "50 Gbps",
                        "60 Gbps", "70 Gbps", "80 Gbps", "90 Gbps",
                        "100 Gbps", "200 Gbps", "300 Gbps",
                        "400 Gbps", "500 Gbps", "600 Gbps",
                        "700 Gbps", "800 Gbps", "900 Gbps",
                        "1 Tbps"],

                    keyboard: true
                });
                $("#delay").ionRangeSlider({
                    min: delaymin,
                    max: delaymax,
                    from: 3,
                    keyboard: true
                });
                $("#cpu").ionRangeSlider({
                    min: cpumin,
                    max: cpumax,
                    from: cpudeflaut,
                    keyboard: true
                });

                $(".glyphicon-info-sign").tooltip();
                $('#collapseTwo').collapse("hide")
            },
            dataType: "text",
            complete: function () {
            }
        });
    }

    function loadConfigErdosRenyi() {
        $.ajax({
            url: "./app/html/erdos_renyi.html",

            success: function (template) {
                $("#ConfigureTopo").html(template);
                $("#value1").ionRangeSlider({
                    min: 1,
                    max: 200,
                    from: 30,
                    keyboard: true
                });
                $("#value2").ionRangeSlider({
                    min: 0,
                    max: 1,
                    from: 0.1,
                    step: 0.05,
                    keyboard: true
                });
                $("#value3").ionRangeSlider({
                    min: 1,
                    max: 10,
                    from: 1,
                    keyboard: true
                });

                $("#bw").ionRangeSlider(
                    {
                        from: 36,
                        values: ["1 Mbps", "2 Mbps", "3 Mbps", "4 Mbps",
                            "5 Mbps", "6 Mbps", "7 Mbps", "8 Mbps",
                            "9 Mbps", "10 Mbps", "20 Mbps", "30 Mbps",
                            "40 Mbps", "50 Mbps", "60 Mbps", "70 Mbps",
                            "80 Mbps", "90 Mbps", "100 Mbps",
                            "200 Mbps", "300 Mbps", "400 Mbps",
                            "500 Mbps", "600 Mbps", "700 Mbps",
                            "800 Mbps", "900 Mbps", "1 Gbps", "2 Gbps",
                            "3 Gbps", "4 Gbps", "5 Gbps", "6 Gbps",
                            "7 Gbps", "8 Gbps", "9 Gbps", "10 Gbps",
                            "20 Gbps", "30 Gbps", "40 Gbps", "50 Gbps",
                            "60 Gbps", "70 Gbps", "80 Gbps", "90 Gbps",
                            "100 Gbps", "200 Gbps", "300 Gbps",
                            "400 Gbps", "500 Gbps", "600 Gbps",
                            "700 Gbps", "800 Gbps", "900 Gbps",
                            "1 Tbps"],

                        keyboard: true
                    });
                $("#delay").ionRangeSlider({
                    min: 0,
                    max: 15,
                    from: 1,
                    step: 0.1,
                    keyboard: true
                });
                $("#cpu").ionRangeSlider({
                    min: cpumin,
                    max: cpumax,
                    from: cpudeflaut,
                    keyboard: true
                });
                $(".glyphicon-info-sign").tooltip();
                $('#collapseTwo').collapse("hide")
            },
            dataType: "text",
            complete: function () {
            }
        });

    }

    function loadConfigPowerlaw() {
        $.ajax({
            url: "./app/html/powerlaw.html",

            success: function (template) {
                $("#ConfigureTopo").html(template);
                $("#value1").ionRangeSlider({
                    min: 1,
                    max: 200,
                    from: 40,
                    keyboard: true
                });
                $("#value2").ionRangeSlider({
                    min: 1,
                    max: 10,
                    from: 1,
                    keyboard: true
                });
                $("#value3").ionRangeSlider({
                    min: 0,
                    max: 1,
                    from: 0.1,
                    step: 0.02,
                    keyboard: true
                });
                $("#value4").ionRangeSlider({
                    min: 1,
                    max: 10,
                    from: 1,
                    keyboard: true
                });
                $("#bw").ionRangeSlider(
                    {
                        from: 36,
                        values: ["1 Mbps", "2 Mbps", "3 Mbps", "4 Mbps",
                            "5 Mbps", "6 Mbps", "7 Mbps", "8 Mbps",
                            "9 Mbps", "10 Mbps", "20 Mbps", "30 Mbps",
                            "40 Mbps", "50 Mbps", "60 Mbps", "70 Mbps",
                            "80 Mbps", "90 Mbps", "100 Mbps",
                            "200 Mbps", "300 Mbps", "400 Mbps",
                            "500 Mbps", "600 Mbps", "700 Mbps",
                            "800 Mbps", "900 Mbps", "1 Gbps", "2 Gbps",
                            "3 Gbps", "4 Gbps", "5 Gbps", "6 Gbps",
                            "7 Gbps", "8 Gbps", "9 Gbps", "10 Gbps",
                            "20 Gbps", "30 Gbps", "40 Gbps", "50 Gbps",
                            "60 Gbps", "70 Gbps", "80 Gbps", "90 Gbps",
                            "100 Gbps", "200 Gbps", "300 Gbps",
                            "400 Gbps", "500 Gbps", "600 Gbps",
                            "700 Gbps", "800 Gbps", "900 Gbps",
                            "1 Tbps"],

                        keyboard: true
                    });
                $("#delay").ionRangeSlider({
                    min: 0,
                    max: 15,
                    from: 1,
                    step: 0.1,
                    keyboard: true
                });
                $("#cpu").ionRangeSlider({
                    min: cpumin,
                    max: cpumax,
                    from: cpudeflaut,
                    keyboard: true
                });
                $(".glyphicon-info-sign").tooltip();
                $('#collapseTwo').collapse("hide")
            },
            dataType: "text",
            complete: function () {
            }
        });
    }

    function loadConfigGeant() {
        $.ajax({
            url: "./app/html/geant.html",

            success: function (template) {
                $("#ConfigureTopo").html(template);
                $("#cpu").ionRangeSlider({
                    min: cpumin,
                    max: cpumax,
                    from: cpudeflaut,
                    keyboard: true
                });
                $(".glyphicon-info-sign").tooltip();
                $('#collapseTwo').collapse("hide")
            },
            dataType: "text",
            complete: function () {
            }
        });
    }

    function loaduploadfrom() {
        $.ajax({
            url: "./app/html/fileuploadform.html",
            success: function (template) {
                $("#ConfigureTopo").html(template);
                $(".glyphicon-info-sign").tooltip();
                $("#cpu").ionRangeSlider({
                    min: cpumin,
                    max: cpumax,
                    from: cpudeflaut,
                    keyboard: true
                });
                $('#collapseTwo').collapse("hide");
                $('#UploadTopo').click(function () {
                    // $("#uploadfrom").submit();
                    var oData = new FormData(document.forms.namedItem("uploadfrom"));
                    var req = new XMLHttpRequest();
                    req.open("POST", urlUploadTopo, true);
                    req.onload = function (oEvent) {
                        if (req.status == 200) {
                            sessionInfo = JSON.parse(req.responseText);
                            sendTopo();
                        } else {
                        }
                    };
                    req.send(oData);
                });
                var form = document.forms.namedItem("uploadfrom");
            },
            dataType: "text",
            complete: function () {
            }
        });
    }


    function loadCreate() {
        $.ajax({
            url: "./app/html/create.html",
            success: function (template) {
                $("#ConfigureTopo").html(template);
                $("#value1").ionRangeSlider({
                    min: 1,
                    max: 10,
                    from: 3,
                    keyboard: true
                });
                $("#value2").ionRangeSlider({
                    min: 1,
                    max: 10,
                    from: 3,
                    keyboard: true
                });

                $("#bw").ionRangeSlider({
                    from: 36,
                    values: ["1 Mbps", "2 Mbps", "3 Mbps", "4 Mbps",
                        "5 Mbps", "6 Mbps", "7 Mbps", "8 Mbps",
                        "9 Mbps", "10 Mbps", "20 Mbps", "30 Mbps",
                        "40 Mbps", "50 Mbps", "60 Mbps", "70 Mbps",
                        "80 Mbps", "90 Mbps", "100 Mbps",
                        "200 Mbps", "300 Mbps", "400 Mbps",
                        "500 Mbps", "600 Mbps", "700 Mbps",
                        "800 Mbps", "900 Mbps", "1 Gbps", "2 Gbps",
                        "3 Gbps", "4 Gbps", "5 Gbps", "6 Gbps",
                        "7 Gbps", "8 Gbps", "9 Gbps", "10 Gbps",
                        "20 Gbps", "30 Gbps", "40 Gbps", "50 Gbps",
                        "60 Gbps", "70 Gbps", "80 Gbps", "90 Gbps",
                        "100 Gbps", "200 Gbps", "300 Gbps",
                        "400 Gbps", "500 Gbps", "600 Gbps",
                        "700 Gbps", "800 Gbps", "900 Gbps",
                        "1 Tbps"],

                    keyboard: true
                });
                $("#delay").ionRangeSlider({
                    min: 1,
                    max: 100,
                    from: 3,
                    keyboard: true
                });
                $("#cpu").ionRangeSlider({
                    min: cpumin,
                    max: cpumax,
                    from: cpudeflaut,
                    keyboard: true
                });

                $(".glyphicon-info-sign").tooltip();
                $('#collapseTwo').collapse("hide")
            },
            dataType: "text",
            complete: function () {
            }
        });
    }

}


getList(urlGetListTopo);


// function loadEditTopo() {
//     // document.getElementById("selectTopo").
//     sendTopo("edit")
//
// }
//
// function rowtobit(bwrow) {
//     values = bwrow.split(" ")
//     if (values[1] == "Gbps") {
//         return values[0] * 1000 * 1000 * 1000
//     } else if (values[1] == "Mbps") {
//         return value * 1000 * 1000
//     }
//
// }

// //////////////////////////////////////
// send selected topo
// //////////////////////////////////////
function sendTopo(type) {


    var topo = {};
    a = $('#LoadTopo').text();
    $('#LoadTopo').html(a + ' <i class="fa fa-spin fa-refresh"></i>');
    var topoName = "";

    switch (document.getElementById("selectTopo").value) {
        case "Grid":
            var value1 = document.getElementById("value1").value;
            var value2 = document.getElementById("value2").value;
            var bwrow = $("#bw").data("ionRangeSlider").result.from_value;
            var bw = humanFormat.parse(bwrow, {unit: 'bps'});
            var delay = $("#delay").data("ionRangeSlider").result.from;
            var cpu = $("#cpu").data("ionRangeSlider").result.from;

            topoName = ("grid," + value1 + "," + value2 + "," + bw + "," + delay
            + "," + cpu);
            break;
        case "Geant":
            var cpu = $("#cpu").data("ionRangeSlider").result.from;
            var topoName = ("file,Geant2012.graphml," + cpu);
            break;
        case "erdos_renyi":
            var value1 = document.getElementById("value1").value;
            var value2 = document.getElementById("value2").value;
            var value3 = document.getElementById("value3").value;
            var bwrow = $("#bw").data("ionRangeSlider").result.from_value;
            var bw = humanFormat.parse(bwrow, {unit: 'bps'});
            var delay = $("#delay").data("ionRangeSlider").result.from;
            var cpu = $("#cpu").data("ionRangeSlider").result.from;
            var topoName = ("erdos_renyi," + value1 + "," + value2 + "," + value3 + ","
            + bw + "," + delay + "," + cpu);
            break;
        case "powerlaw":
            var value1 = document.getElementById("value1").value;
            var value2 = document.getElementById("value2").value;
            var value3 = document.getElementById("value3").value;
            var value4 = document.getElementById("value4").value;
            var bwrow = $("#bw").data("ionRangeSlider").result.from_value;
            var bw = humanFormat.parse(bwrow, {unit: 'bps'});
            var delay = $("#delay").data("ionRangeSlider").result.from;
            var cpu = $("#cpu").data("ionRangeSlider").result.from;
            var topoName = ("powerlaw," + value1 + "," + value2 + "," + value3 + ","
            + value4 + "," + bw + "," + delay + "," + cpu);
            break;
        case "upload":
            var upload = document.getElementById("uploadinput");
            var cpu = $("#cpu").data("ionRangeSlider").result.from;

            var topoName = ("file," + upload.value.split('\\')[2] + "," + cpu);

            break;

        case "create":
            var topo = {};

            var json64 = networktojson(edges, nodes);
            var topoName = ("jsonfile," + json64 );
            break;
        default:
            console.log("error")
    }


    if (sessionInfo != "") {
        topo.sessionId = sessionInfo.sessionId
    }
    topo.topo = topoName;


    var req = new XMLHttpRequest();

    function onProgress(e) {
    }

    function onError(e) {
        console.log("error")
    }

    function onLoad(e) {
        if (req.status == 202) {

            $('#selectTopo option[value="create"]').prop('selected', true);
            $('#LoadTopo').text(a)
            var toporaw = JSON.parse(req.responseText);
            // toporaw.topo.split("jsonfile,");
            var topob64 = toporaw.topo.split("jsonfile,")[1]
            var topojson = window.atob(topob64);

            nodes.clear();
            edges.clear();
            jsontonetwork(topojson);
            networkload();
            $("#Validate").show();

            if ($("#value1").length != 0) {
                $("#value1").data("ionRangeSlider").update({
                    disable: true
                });
            }
            if ($("#value2").length != 0) {
                $("#value2").data("ionRangeSlider").update({
                    disable: true
                });
            }
            if ($("#value3").length != 0) {
                $("#value3").data("ionRangeSlider").update({
                    disable: true
                });
            }
            if ($("#value4").length != 0) {
                $("#value4").data("ionRangeSlider").update({
                    disable: true
                });
            }
            if ($("#bw").length != 0) {
                $("#bw").data("ionRangeSlider").update({
                    disable: true
                });
            }
            if ($("#delay").length != 0) {
                $("#delay").data("ionRangeSlider").update({
                    disable: true
                });
            }
            if ($("#cpu").length != 0) {
                $("#cpu").data("ionRangeSlider").update({
                    disable: true
                });
            }
            $("#selectTopo").prop('disabled', true);
        }
        else if (req.status >= 400 && req.status <= 599) {
            console.log(req.response);
            $('#LoadTopo').html(a + ' <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>')
        }
    }

    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('POST', urlSendSelectedTopo, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(topo));
}

function validateTopo() {
    $(".vis-edit-mode").hide();
    $(".vis-manipulation").hide();
    $.ajax({
        url: "./app/html/userpool.html",
        success: function (template) {
            network.on("click", cdnSourcemgnt);
            $("#UserPools").html(template);
            $(".glyphicon-info-sign").tooltip();
        },
        dataType: "text",
        complete: function () {
        }
    });

    if (typeof table != 'undefined') {
        table.clear().draw();
    }
    delAllClient();
}