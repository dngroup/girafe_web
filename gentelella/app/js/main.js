var timeFormat = 'MM/DD/YYYY HH:mm';
// var s = Snap("#svg");
var defaultEdgeColor = "#77aaaa";

var neutralImage = './app/img/node/switch.svg';
var clientImage = './app/img/node/switchclient.svg';
var cdnImage = './app/img/node/switchcdn.svg';
var bothImage = './app/img/node/switchboth.svg';

var urlDOT = "/api/simu/dot/";
var urlVideo = "http://localhost:9002/cdn.mpd";
var urlVideoSD = "http://localhost:9003/cdnld.mpd";
var urlVideoHD = "http://localhost:9003/cdnhd.mpd";
var urlMPD = "/api/simu/mpd/";

var sourceNode = {"shape": "image", "color": {"background": "green"}, "style": "filled", "font": {"size": 12}};
sourceNode.image = './app/img/node/CG.svg';
var cdnNode = {"shape": "image", "color": {"background": "red"}, "style": "filled", "font": {"size": 12}};
cdnNode.image = './app/img/node/cdn.svg';
var vcdnNode = {"shape": "image", "color": {"background": "green"}, "style": "filled", "font": {"size": 12}};
vcdnNode.image = './app/img/node/vcdn.svg';
var VHGNode = {"shape": "image", "color": {"background": "green"}, "style": "filled", "font": {"size": 12}};
VHGNode.image = './app/img/node/vhg.svg';
var neutralNode = {
    "typenode":"neutral",
    "shape": "image",
    "style": "filled",
    "color": {"background": "white"},
    "width": 1,
    "font": {"size": 15}, "scaling": {"min": 8, "max": 15}
};
neutralNode.image = neutralImage;

var edgeExternal = {"color": {"color": "blue"}, "len": 1.5, "scaling": {"min": 5, "max": 10}};
var neutralEdge = {
    "typeedge":"neutral",
    "penwidth": "3",
    "font": {"size": 15, "align": 'middle'},
    "len": 2,
    "color": {"color": defaultEdgeColor}
};
var edgesla = {"font": {"align": 'middle'}, "dashes": [2, 10, 2, 10], "scaling": {"min": 5, "max": 10}};
var sourceNodes = [];
// nodes.on('*', function () {
//
// });
var nodes, edges, network, data, options;
// var filterBlur = s.filter(Snap.filter.blur(4));

nodes = new vis.DataSet();
// nodes.on('*', function () {
//     document.getElementById('nodes').innerHTML = JSON.stringify(nodes.get(), null, 4);
// });
edges = new vis.DataSet();
// edges.on('*', function () {
//     document.getElementById('edges').innerHTML = JSON.stringify(edges.get(), null, 4);
// });

function cdnSourcemgnt(objectselect) {

    /**
     * not use but work
     * @param nodeid
     */
    function addSourceTopo(nodeid) {
        // node = nodes.get(nodeid);
        source = sourceNode;
        source.id = "S" + (sourceNodes.length + 1);
        source.label = source.id;
        sourceNodes.push(source)
        nodes.update(source)
        edge = edgeExternal;
        edge.from = source.id
        edge.to = nodeid
        edge.id = edge.from + "to" + edge.to
        edges.update(edge)
    }

    function addCDNTopo(nodeid) {
        // node = nodes.get(nodeid);
        vcdn = cdnNode;
        vcdn.id = "vCDN" + (vcdnNodes.length + 1);
        vcdn.label = vcdn.id;
        vcdnNodes.push(vcdn)
        nodes.update(vcdn)
        edge = edgeExternal;
        edge.from = vcdn.id
        edge.to = nodeid
        edge.id = edge.from + "to" + edge.to
        edges.update(edge)
    }

    /**
     * can not delete properly the node
     * @param nodeid
     */
    function delSourceTopo(nodeid) {
        node = nodes.get(nodeid);
        edge = edges.get({
            filter: function (item) {
                if (typeof item.from === 'string' || item.from instanceof String) {
                    return (item.to == nodeid && item.from.includes("S"));
                }
                return false;
            }
        });
        sourcenode = nodes.get(edge[0].from);
        edges.remove(edge);
        nodes.remove(sourcenode);

        for (nodeI in sourceNodes) {
            if (sourceNodes[nodeI].id != "S" + nodeI) {
                sourceNodes[nodeI].id = "S" + nodeI;
                sourceNodes[nodeI].label = "S" + nodeI;
            }

        }
        nodes.update(sourceNodes)
    }


    if (objectselect.nodes.length == 0) {
        console.log("edge selected")
        console.log(JSON.stringify(edges.get(objectselect.edges[0])))
    }
    else if (objectselect.nodes.length == 1) {
        nodeid = objectselect.nodes[0];
        node = nodes.get(nodeid);
        console.log(JSON.stringify(nodes.get(objectselect.nodes[0])))

        // var text = node.select("text");
        // var pol = node.select("polygon");
        if (getListToModify() === "clients") {
            if (node.image !== clientImage && node.image !== bothImage) {
                if (node.image !== cdnImage) {
                    node.image = clientImage;
                } else {
                    node.image = bothImage;
                }
                // addSourceTopo(nodeid);
                addClient(nodeid);
            } else {
                if (node.image === bothImage) {
                    node.image = cdnImage;
                } else {
                    node.image = neutralImage;
                }
                // delSourceTopo(nodeid);
                delClient(nodeid);
            }
        }
        if (getListToModify() === "cdns") {
            if (node.image !== cdnImage && node.image !== bothImage) {
                if (node.image !== clientImage) {
                    node.image = cdnImage;

                } else {
                    node.image = bothImage;

                }
                addCDN(nodeid);
            } else {
                if (node.image === bothImage) {
                    node.image = clientImage;
                } else {
                    node.image = neutralImage;
                }
                delCDN(nodeid);
            }
        }
        nodes.update(node);
    }
}


// /**
//  * Svg loaded when a grid is submitted
//  * @param type
//  */
// function ctrlTopo(type, topo) {
//
//     // $.ajax({
//     //     url: urlDOT + sessionInfo.sessionId,
//     //     async: false,
//     //     success: function (value) {
//     //         value = value.replace(/color=black,/g, "")
//     //         value = value.replace(/color=green1,/g, "color=green,")
//     //         value = value.replace(/color=red1,/g, "color=red,")
//     //         value = value.replace(/color=azure1,/g, "color=azure,")
//     //         value = value.replace(/color=azure3,/g, "color=azure,")
//     //         value = value.replace(/&#8594;/g, "→")
//     //         value = value.replace(/style=dashed/g, "dashes=true")
//     //         // value = value.replace(/,label=/g, ",title=\"lala\" ,label=")
//     //         dot = value.split(/subgraph{|}/);
//     //         console.log(dot);
//     //
//     //         var dot1 = "subgraph{" + dot[1] + "}";
//     //         var dot2 = "subgraph{" + dot[3] + "}";
//     //
//     // var data1 = vis.network.convertDot(dot1);
//     // var data2 = vis.network.convertDot(dot2);
//
//     // valmin = 100;
//     // valmax = 0;
//     // for (edge in data1.edges) {
//     //
//     //     if (data1.edges[edge].delay > valmax) {
//     //         valmax = data1.edges[edge].delay;
//     //     }
//     //     else if (data1.edges[edge].delay < valmin) {
//     //         valmin = data1.edges[edge].delay;
//     //     }
//     // }
//     // if (valmax == valmin) {
//     //     valmin = 0;
//     //     valmax = valmax * 3
//     // }
//     //
//     // for (edge in data1.edges) {
//     //     // if (data1.edges[edge].color == null) {
//     //     //     data1.edges[edge].color = {}
//     //     //     data1.edges[edge].color.color = defaultedgecolor
//     //     // }
//     //     data1.edges[edge].length = data1.edges[edge].delay;
//     //     data1.edges[edge].title = '' +
//     //         'id:"' + data1.edges[edge].id + '" ' +
//     //         'bw:' + humanFormat(parseInt(data1.edges[edge].bw), {unit: 'bps'}) + ' ' +
//     //         'delay: ' + data1.edges[edge].delay;
//     //     data1.edges[edge].value = Math.log(data1.edges[edge].bw);
//     //     data1.edges[edge].color = {"color": getcolor(data1.edges[edge].delay)};
//     // }
//     // for (node in data1.nodes) {
//     //     data1.nodes[node].value = data1.nodes[node].cpu;
//     // }
//
//     // nodes.update(data1.nodes);
//     // edges.update(data1.edges);
//     // networkload();
//
//     //     },
//     //     dataType: "text",
//     //     complete: function () {
//     //     }
//     // });
//
//
//
//
//     // s.zpd('destroy')
//     // s.clear();
//     //
//     // var da = Snap.load(urlSVG + sessionInfo.sessionId, function (f) {
//     //     var childNode = f.selectAll("g");
//     //
//     //     for (var i = 0; i < childNode.length; i++) {
//     //         var c = childNode[i];
//     //         console.log(c.id);
//     //
//     //         if (c.node.className.baseVal == "node") {
//     //             // console.log(c.node.id);
//     //             // childNode[i].mouseover("this.style.cursor='pointer'")
//     //             childNode[i].click(function () {
//     //                 hello(this);
//     //             });
//     //         }
//     //     }
//     //
//     //
//     //     g = f.select("g");
//     //     s.append(g);
//     //     s.zpd({zoom: true, drag: false});
//     // });
//
//
// }

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
                min: delaymin,
                max: delaymax,
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
                min: 100,
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
                    {title: "Number of VMGs"},
                    {title: "Number of VStr"},
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
            if ($("#bw").length != 0) {
                $("#bw").data("ionRangeSlider").update({disable: false});
            }
            if ($("#delay").length != 0) {
                $("#delay").data("ionRangeSlider").update({disable: false});
            }
            if ($("#cpu").length != 0) {
                $("#cpu").data("ionRangeSlider").update({disable: false});
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
            clearTopo();
            network.on("click", cdnSourcemgnt);

            $("#videoWindow").hide();
            $("#videoHDWindow").hide();
            $("#videoSDWindow").hide();
            $("#userswindow").hide();
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

    // $.ajax({
    //     url: urlDOT + sessionInfo.sessionId,
    //     async: false,
    //     success: function (value) {
    //         value = value.replace(/color=black,/g, "")
    //         value = value.replace(/color=green1,/g, "color=green,")
    //         value = value.replace(/color=red1,/g, "color=red,")
    //         value = value.replace(/color=azure1,/g, "color=azure,")
    //         value = value.replace(/color=azure3,/g, "color=azure,")
    //         value = value.replace(/&#8594;/g, "-->")
    //         value = value.replace(/style=dashed/g, "dashes=true")
    //         // value = value.replace(/,label=/g, ",title=\"lala\" ,label=")
    //         dot = value.split(/subgraph{|}/);
    //         console.log(dot)
    //
    //         var dot1 = "subgraph{" + dot[1] + "}";
    //         var dot2 = "subgraph{" + dot[3] + "}";
    //
    //         var data1 = vis.network.convertDot(dot1);
    //         var data2 = vis.network.convertDot(dot2);
    //
    //         for (edge in data1.edges) {
    //
    //             if (data1.edges[edge].delay > valmax) {
    //                 valmax = data1.edges[edge].delay;
    //             }
    //             else if (data1.edges[edge].delay < valmin) {
    //                 valmin = data1.edges[edge].delay;
    //             }
    //         }
    //         if (valmax == valmin) {
    //             valmin = 0;
    //             valmax = valmax * 3
    //         }
    //
    //
    //         for (edge in data1.edges) {
    //             data1.edges[edge].font = {"align": 'middle'};
    //
    //             data1.edges[edge].length = data1.edges[edge].delay;
    //             if (data1.edges[edge].bw != null) {
    //                 data1.edges[edge].title = '' +
    //                     'id:"' + data1.edges[edge].id + '" ' +
    //                     'bw:' + humanFormat(parseInt(data1.edges[edge].bw), {unit: 'bps'}) + ' ' +
    //                     'delay: ' + data1.edges[edge].delay;
    //                 data1.edges[edge].value = Math.log(data1.edges[edge].bw);
    //                 data1.edges[edge].color = {"color": getcolor(data1.edges[edge].delay)};
    //             }
    //         }
    //         for (edge in data2.edges) {
    //             data2.edges[edge].font = {"align": 'middle'};
    //             if (data2.edges[edge].bw != null) {
    //                 data2.edges[edge].length = data2.edges[edge].delay;
    //                 data2.edges[edge].title = '' + 'id:"' + data2.edges[edge].id + '" ' +
    //                     'bw:' + humanFormat(parseInt(data2.edges[edge].bw), {unit: 'bps'}) + ' ' +
    //                     'delay: ' + data2.edges[edge].delay;
    //                 data2.edges[edge].value = Math.log(data2.edges[edge].bw);
    //                 data2.edges[edge].color = {"color": getcolor(data2.edges[edge].delay)};
    //             }
    //         }
    //
    //         nodetodelete = nodes.get({
    //             filter: function (item) {
    //                 if (item.id.includes("S") || item.id.includes("CDN") || item.id.includes("VHG")) {
    //                     return true;
    //                 }
    //                 return false;
    //             }
    //         });
    //
    //         edgetodelete = edges.get({
    //             filter: function (item) {
    //                 if (item.from.includes("S") || item.from.includes("CDN") || item.from.includes("VHG")
    //                     || item.to.includes("S") || item.to.includes("CDN") || item.to.includes("VHG")
    //                     || item.label.includes("S") || item.label.includes("CDN") || item.label.includes("VHG")) {
    //                     return true;
    //                 }
    //                 return false;
    //             }
    //         });
    //         nodes.remove(nodetodelete);
    //         edges.remove(edgetodelete);
    //
    //         nodes.update(data1.nodes);
    //         edges.update(data1.edges);
    //
    //         nodes.update(data2.nodes);
    //         edges.update(data2.edges);
    //
    //
    //     },
    //     dataType: "text",
    //     complete: function () {
    //     }
    // });
    network.off("click", cdnSourcemgnt);
    $(".vis-edit-mode").hide();
    $(".vis-manipulation").hide();

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
            urlVideo = "/s1/cdn.mpd"||res.str[1];
            urlVideoHD = "/s2/cdnhd.mpd"||res.str[0];
            urlVideoSD = "/s2/cdnld.mpd"||res.str[2];

            player.attachSource(urlVideo);
            playerHD.attachSource(urlVideoHD);
            playerSD.attachSource(urlVideoSD);
        }
    }

    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('GET', urlMPD, true);
    req.setRequestHeader('Accept', 'application/json');
    req.send(null);
}
