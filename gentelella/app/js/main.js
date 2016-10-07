var timeFormat = 'MM/DD/YYYY HH:mm';
var s = Snap("#svg");
var clientColor = "#00ff00";
var cdnColor = "#ff0000";
var bothColor = "#0000ff";
var neutralColor = "#000000";
var clientColorbg = "#bbffbb";
var cdnColorbg = "#ffbbbb";
var bothColorbg = "#bbbbff";
var neutralColorbg = "#ffffff";
var urlSVG = "/api/simu/svg/";
var urlVideo = "http://localhost:9002/cdn.mpd";
var urlVideoSD = "http://localhost:9003/cdnld.mpd";
var urlVideoHD = "http://localhost:9003/cdnhd.mpd";
var urlMPD = "/api/simu/mpd/";

// var filterBlur = s.filter(Snap.filter.blur(4));

function hello(s2) {
    var text = s2.select("text");
    var pol = s2.select("polygon");
    if (getListToModify() === "clients") {
        if (pol.node.attributes.stroke.value !== clientColor && pol.node.attributes.stroke.value !== bothColor) {
            if (pol.node.attributes.stroke.value !== cdnColor) {
                pol.node.attributes.stroke.value = clientColor;
                pol.node.attributes.fill.value = clientColorbg
            } else {
                pol.node.attributes.stroke.value = bothColor;
                pol.node.attributes.fill.value = bothColorbg;
            }

            addClient(text.node.innerHTML);
        } else {
            if (pol.node.attributes.stroke.value === bothColor) {
                pol.node.attributes.stroke.value = cdnColor;
                pol.node.attributes.fill.value = cdnColorbg
            } else {
                pol.node.attributes.stroke.value = neutralColor;
                pol.node.attributes.fill.value = neutralColorbg
            }
            delClient(text.node.innerHTML);
        }
    }
    if (getListToModify() === "cdns") {
        if (pol.node.attributes.stroke.value !== cdnColor && pol.node.attributes.stroke.value !== bothColor) {
            if (pol.node.attributes.stroke.value !== clientColor) {
                pol.node.attributes.stroke.value = cdnColor;
                pol.node.attributes.fill.value = cdnColorbg;

            } else {
                pol.node.attributes.stroke.value = bothColor;
                pol.node.attributes.fill.value = bothColorbg;

            }
            addCDN(text.node.innerHTML);
        } else {
            if (pol.node.attributes.stroke.value === bothColor) {
                pol.node.attributes.stroke.value = clientColor;
                pol.node.attributes.fill.value = clientColorbg;

            } else {
                pol.node.attributes.stroke.value = neutralColor;
                pol.node.attributes.fill.value = neutralColorbg;

            }
            delCDN(text.node.innerHTML);
        }
    }
    /*    text.attr({
     fill: "#900",
     "font-size": "30px"
     });*/
}

function video(s2) {
    var text = s2.select("text");
    var pol = s2.select("polygon");
    if (text.startsWith("S")) {


    }

    /*    text.attr({
     fill: "#900",
     "font-size": "30px"
     });*/
}


///////////////////////////////////////////////
// First svg loaded at start
///////////////////////////////////////////////
// var da = Snap.load("./input/res2empty.svg", function (f) {
//     s.zpd('destroy')
//     var childNode = f.selectAll("g");
//
//     for (var i = 0; i < childNode.length; i++) {
//         var c = childNode[i];
//         console.log(c.id);
//
//         if (c.node.className.baseVal == "node") {
//             console.log(c.node.id);
//             childNode[i].click(function () {
//                 hello(this);
//             });
//         }
//     }
//
//     g = f.select("g");
//     g.attr({
//         filter: filterBlur
//     });
//
//     s.append(g);
//     s.zpd({zoom: true, drag: false});
// });

///////////////////////////////////////////////
// Svg loaded when a grid is submitted
///////////////////////////////////////////////
function ctrlTopo() {
    table.clear().draw();
    delAllClientCDN();
    s.zpd('destroy')
    s.clear();

    $.ajax({
        url: "./app/html/userpool.html",
        async: false,
        success: function (template) {
            $("#UserPools").html(template);
            $(".glyphicon-info-sign").tooltip();
        },
        dataType: "text",
        complete: function () {
        }
    });

    var da = Snap.load(urlSVG + sessionInfo.sessionId, function (f) {
        var childNode = f.selectAll("g");

        for (var i = 0; i < childNode.length; i++) {
            var c = childNode[i];
            console.log(c.id);

            if (c.node.className.baseVal == "node") {
                console.log(c.node.id);
                childNode[i].click(function () {
                    hello(this);
                });
            }
        }
        $("#SLAwindow").show();

        g = f.select("g");
        s.append(g);
        s.zpd({zoom: true, drag: false});
    });

    $("#sla_delay").data("ionRangeSlider").update({disable: false});
    $("#vcdn_ratio").data("ionRangeSlider").update({disable: false});
    $("#nbUsersSla").data("ionRangeSlider").update({disable: false});

}

///////////////////////////////////////////////
// Svg and action when the SLA is sent
///////////////////////////////////////////////
function ctrlSLA() {
    s.zpd('destroy')
    s.clear();
    var da = Snap.load(urlSVG + sessionInfo.sessionId, function (f) {
        // d = f.node.childNodes[6].childNodes[1].childNodes.sort(function(a,b){return a.id-b.id});
        var childNode = f.selectAll("text");

        for (var i = 0; i < childNode.length; i++) {
            var c = childNode[i];
            console.log(c.id);
            if (c.node.textContent.indexOf("VHG") >= 0) {
                c.node.textContent = c.node.textContent.replace("VHG", "VMG");

            }
            if (c.node.textContent.indexOf("S") >= 0) {
                c.node.textContent = c.node.textContent.replace("S", "CG");

            }
        }

        var childNode = f.selectAll("g");

        for (var i = 0; i < childNode.length; i++) {
            var c = childNode[i];
            console.log(c.id);


            if (c.node.className.baseVal == "node") {
                console.log(c.node.id);
                childNode[i].click(function () {
                    hello(s2);
                });
            }
        }

        g = f.select("g");
        s.append(g);
        s.zpd({zoom: true, drag: false});

        // $("#graphWindow").show();
        // svgAppended();

    });
    $("#videoWindow").show();
    $("#videoHDWindow").show();
    $("#videoSDWindow").show();

    $("#userswindow").show();


    getMPD();

    $("#sla_delay").data("ionRangeSlider").update({disable: true});
    $("#vcdn_ratio").data("ionRangeSlider").update({disable: true});
    $("#nbUsersSla").data("ionRangeSlider").update({disable: true});


}

function getMPD() {
    var req = new XMLHttpRequest(),
        data = {};


    function onProgress(e) {

    }

    function onError(e) {

    }

    function onLoad(e) {
        if (req.status >= 200 && req.status <= 299) {
            res = JSON.parse(req.response);
            urlVideo = res.str[1];
            urlVideoHD = res.str[0];
            urlVideoSD = res.str[2];

        }

        player.attachSource(urlVideo);
        playerHD.attachSource(urlVideoHD);
        playerSD.attachSource(urlVideoSD);


    }

    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('GET', urlMPD, true);
    req.setRequestHeader('Accept', 'application/json');
    req.send(null);
}