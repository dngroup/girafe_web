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
        $("#userswindow").show();

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
        svgAppended();

    });
    $("#videoWindow").show();
    $("#videoHDWindow").show();
    $("#videoSDWindow").show();

    player.attachSource(urlVideo);
    playerHD.attachSource(urlVideoHD);
    playerSD.attachSource(urlVideoSD);

    $("#sla_delay").data("ionRangeSlider").update({disable: true});
    $("#vcdn_ratio").data("ionRangeSlider").update({disable: true});
    $("#nbUsersSla").data("ionRangeSlider").update({disable: true});


}