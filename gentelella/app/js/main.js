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

$(window).scroll(function () {

    var valuelow = $("footer").height();
    if ($(videoWindow).is(":visible")) {
        valuelow += $(videoWindow).height()+60
    }
    lawerScroll = $(document).height() // - $(window).height()
    console.log($(window).scrollTop() + "," + lawerScroll + "," + valuelow +","+($(window).scrollTop()+ $('#move').height())+","+$('#move').height());
    if ($(window).scrollTop() > $('#title').height() && ($(window).scrollTop()+ $('#move').height()) <= ($(document).height() - valuelow )) {


        $("#move").stop().animate({

            "marginTop": ($(window).scrollTop()) + "px",
            // "marginLeft": ($(window).scrollLeft()) + "px"
        }, "slow");
    }

});

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

    if (typeof table != 'undefined') {
        table.clear().draw();
    }
    delAllClient();
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


        g = f.select("g");
        s.append(g);
        s.zpd({zoom: true, drag: false});
    });


}

//load cdn peering point
function nextCDN() {
    setListToModify('cdns')
    // $("#SLAwindow").hide();
    $.ajax({
        url: "./app/html/cdnPeeringPoints.html",
        async: false,
        success: function (template) {
            $("#cdnPeeringPoints").html(template);
            $(".glyphicon-info-sign").tooltip();
        },
        dataType: "text",
        complete: function () {
        }
    });
    delAllCDN();
    // $("#SLAwindow").show();

}


//load service topology
function nextVCDN() {
    $.ajax({
        url: "./app/html/vcdn.html",
        async: false,
        success: function (template) {
            $("#confvcdn").html(template);
            $(".glyphicon-info-sign").tooltip();
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
            $("#sla_delay").data("ionRangeSlider").update({disable: false});
            $("#vcdn_ratio").data("ionRangeSlider").update({disable: false});
            $("#nbUsersSla").data("ionRangeSlider").update({disable: false});
        },
        dataType: "text",
        complete: function () {


        }
    });

}


//load service topology
function nextServiceTopo() {
    $.ajax({
        url: "./app/html/ServiceTopology.html",
        async: false,
        success: function (template) {
            $("#serviceTopo").html(template);
            $(".glyphicon-info-sign").tooltip();
        },
        dataType: "text",
        complete: function () {
        }
    });

    $("#result").hide();
    $.ajax({
        url: "./app/html/result.html",
        async: false,
        success: function (template) {
            $("#result").html(template);
            $(".glyphicon-info-sign").tooltip();
            table = $('#myTable').DataTable({
                data: dataSet,
                responsive: true,
                columns: [
                    {title: "ID"},
                    {title: "Number of VMG"},
                    {title: "Number of vCDN"},
                    {title: "Cost."}
                ],
                // "columnDefs": [
                //     {
                //         "targets": [0],
                //         "visible": false,
                //         "searchable": false
                //     }
                // ],
                // "paging":   false,
                "info": false,
                "searching": false,
                "order": [[3, "desc"]]
            });
        },
        dataType: "text",
        complete: function () {
        }
    });

}


//load result
function nextResult() {
    $("#result").show()
}

function cancelBtn(value) {
    switch (value) {
        case 1:
            $("#ConfigureTopo").html("");
        case 2:
            $("#UserPools").html("");
            if ($("#value1").length != 0) {
                $("#value1").data("ionRangeSlider").update({disable: false});
            }
            if ($("#value2").length != 0) {
                $("#value2").data("ionRangeSlider").update({disable: false});
            }
            if ($("#value3").length != 0) {
                $("#value3").data("ionRangeSlider").update({disable: false});
            }
            if ($("#value4").length != 0) {
                $("#value4").data("ionRangeSlider").update({disable: false});
            }
            if ($("#selectTopo").length != 0) {
                $("#selectTopo").prop('disabled', false);
            }
        case 3:
            $("#cdnPeeringPoints").html("");
        case 4:
            $("#confvcdn").html("");
        case 5:
            $("#serviceTopo").html("");
            $("#result").html("");
        case 6:
            if ($("#btnclients").length != 0) {
                $("#btnclients").prop('disabled', false);
            }
            if ($("#btncdns").length != 0) {
                $("#btncdns").prop('disabled', false);
            }
            if ($("#sla_delay").length != 0) {

                $("#sla_delay").data("ionRangeSlider").update({disable: false});
            }
            if ($("#vcdn_ratio").length != 0) {
                $("#vcdn_ratio").data("ionRangeSlider").update({disable: false});
            }
            if ($("#nbUsersSla").length != 0) {
                $("#nbUsersSla").data("ionRangeSlider").update({disable: false});
            }
            if ($("#result").length != 0) {
                $("#result").hide()
            }
            resetTable();
            break;
        default:
            console.log("error")
    }
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
            // console.log(c.id);
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
            // console.log(c.id);


            if (c.node.className.baseVal == "node") {
                // console.log(c.node.id);
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

    $("#btnclients").prop('disabled', true)
    $("#btncdns").prop('disabled', true)
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