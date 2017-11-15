/**
 * Created by dbourasseau on 14/11/16.
 */
var values = ["1 Mbps", "2 Mbps", "3 Mbps", "4 Mbps", "5 Mbps", "6 Mbps", "7 Mbps", "8 Mbps", "9 Mbps", "10 Mbps", "20 Mbps", "30 Mbps", "40 Mbps", "50 Mbps", "60 Mbps", "70 Mbps", "80 Mbps", "90 Mbps", "100 Mbps", "200 Mbps", "300 Mbps", "400 Mbps", "500 Mbps", "600 Mbps", "700 Mbps", "800 Mbps", "900 Mbps", "1 Gbps", "2 Gbps", "3 Gbps", "4 Gbps", "5 Gbps", "6 Gbps", "7 Gbps", "8 Gbps", "9 Gbps", "10 Gbps", "20 Gbps", "30 Gbps", "40 Gbps", "50 Gbps", "60 Gbps", "70 Gbps", "80 Gbps", "90 Gbps", "100 Gbps", "200 Gbps", "300 Gbps", "400 Gbps", "500 Gbps", "600 Gbps", "700 Gbps", "800 Gbps", "900 Gbps", "1 Tbps"];
var valmin = 0;
var valmax = 10;
//http://jsfiddle.net/tL7ry023/
// cyan,lime,gold, tomato, red
var colors = ['#00ffff', '#1bfff7', '#28fff0', '#32ffe8', '#39ffe1', '#40feda', '#46fed2', '#4bfecc', '#50fec5', '#54febe', '#58fdb8', '#5cfdb1', '#60fdab', '#64fca5', '#67fc9f', '#6bfc99', '#6ffb93', '#72fb8e', '#76fa88', '#79fa83', '#7df97d', '#80f978', '#84f873', '#87f86e', '#8bf769', '#8ff664', '#92f65f', '#96f55a', '#9af455', '#9ef351', '#a2f34c', '#a6f248', '#aaf143', '#aef03f', '#b2ef3a', '#b7ee36', '#bbed32', '#bfec2d', '#c4ea29', '#c8e925', '#cde820', '#d2e71c', '#d6e518', '#dbe413', '#e0e20f', '#e5e00a', '#eadf06', '#efdd03', '#f4db01', '#fad900', '#ffd700', '#ffd30b', '#ffcf13', '#ffcb18', '#ffc71c', '#ffc320', '#ffbf23', '#ffbb25', '#ffb727', '#ffb329', '#ffaf2a', '#ffab2c', '#ffa72d', '#ffa42e', '#ffa02f', '#ff9c2f', '#ff9930', '#ff9530', '#ff9130', '#ff8e30', '#ff8a30', '#ff8630', '#ff8330', '#ff7f30', '#ff7c2f', '#ff782f', '#ff752e', '#ff712e', '#ff6e2d', '#ff6a2c', '#ff662b', '#ff632a', '#ff5f29', '#ff5c28', '#ff5827', '#ff5426', '#ff5124', '#ff4d23', '#ff4921', '#ff451f', '#ff411e', '#ff3d1c', '#ff391a', '#ff3417', '#ff2f15', '#ff2a12', '#ff250f', '#ff1f0c', '#ff1708', '#ff0e04', '#ff0000']
$(window).scroll(function () {
    if ($("#videoHDWindow").is(":visible")) {
        valuelow = $("#videoHDWindow").position().top
    } else {
        valuelow = $("#publi").position().top;
    }
    console.log(valuelow);
    lawerScroll = $(document).height()
    // - $(window).height()
    if ($(window).scrollTop() > ($('#general_pres').position().top + $('#general_pres').height()) && ($(window).scrollTop() + $('#move').height()) <= (valuelow)) {
        $("#move").stop().animate({
            "marginTop": ($(window).scrollTop()) + "px",
            // "marginLeft": ($(window).scrollLeft()) + "px"
        }, 0);
    } else if ($(window).scrollTop() < ($('#general_pres').position().top + $('#general_pres').height())) {
        $("#move").stop().animate({
            "marginTop": ($('#general_pres').position().top + $('#general_pres').height()) + "px",
            // "marginLeft": ($(window).scrollLeft()) + "px"
        }, 0);
    } else if (($(window).scrollTop() + $('#move').height()) > (valuelow)) {
        $("#move").stop().animate({
            "marginTop": (valuelow - $('#move').height()) + "px",
            // "marginLeft": ($(window).scrollLeft()) + "px"
        }, 0);
    }
});
$(window).resize(function () {
    $("#movesize").height($('#move').height());
});
$(document).ready(function () {
    $("#move").stop().animate({
        "marginTop": ($('#general_pres').position().top + $('#general_pres').height()) + "px",
        // "marginLeft": ($(window).scrollLeft()) + "px"
    }, 0);
    $("#move").show();
    $("#movesize").height($('#move').height());
});


$("#edge-bw").ionRangeSlider({
    from: 36,
    values: values,
    keyboard: true
});
$("#edge-delay").ionRangeSlider({
    min: 0,
    max: 15,
    from: 1,
    step: 0.1,
    keyboard: true
});
$("#node-cpu").ionRangeSlider({
    min: 1,
    max: 2000,
    from: 200,
    keyboard: true
});
function getcolor(rawval) {
    var adjval;
    if (rawval > valmax) {
        adjval = valmax;
    } else if (rawval < valmin) {
        adjval = valmin;
    } else {
        adjval = rawval;
    }
    var val = (adjval - valmin) / (valmax - valmin) * 100;
    return colors[parseInt(val)];

    // var h = Math.floor((100 - val) * 120 / 100);  // go from green to red
    // var s = 1 // or equal Math.abs(val - 50) / 50;
    // return hsv2rgb(h, s, 1)
}
function clearPopUp() {
    document.getElementById('saveButton').onclick = null;
    document.getElementById('cancelButton').onclick = null;
    $('#node-modal').modal("hide");
    document.getElementById('saveEdgeButton').onclick = null;
    document.getElementById('cancelEdgeButton').onclick = null;
    $('#edge-modal').modal("hide");
}
function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}


function saveNodeData(data, callback) {
    data.typenode = "neutral"
    data.shape= "image";
    data.image = neutralImage;
    data.id = document.getElementById('node-id').value;
    data.label = data.id;
    data.cpu = document.getElementById('node-cpu').value;
    data.title = 'cpu:' + data.cpu;
    // data.value = data.cpu;
    data.style = neutralNode.style;
    data.color = neutralNode.color;
    // data.width = neutralNode.width;
    data.font = neutralNode.font;
    data.shadow = {};
    clearPopUp();
    callback(data);
}
function saveEdgeData(data, callback) {
    data.typeedge = "neutral";
    data.id = document.getElementById('edge-id').value;
    // data.label = data.id;
    var bwrow = $("#edge-bw").data("ionRangeSlider").result.from_value;
    data.bw = humanFormat.parse(bwrow, {
        unit: 'bps'
    });
    data.delay = document.getElementById('edge-delay').value;
    data.title = 'id:"' + data.id + '" bw:' + humanFormat(parseInt(data.bw), {
            unit: 'b'
        }) + '/s delay: ' + data.delay;
    data.penwidth = neutralEdge.penwidth;
    data.font = neutralEdge.font;
    data.len = neutralEdge.len;
    data.color = {"color": getcolor(data.delay)};
    console.log(data.color);
    data.value = Math.log(data.bw);
    clearPopUp();
    callback(data);
}
function init() {
    setDefaultLocale();
    draw();
}
function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}
function networkload() {
    data = {
        nodes: nodes,
        edges: edges
    };
    options = {
        nodes: {
            shape: 'dot',
            size: 16
        },
        layout: {
            randomSeed: 34
        },
        interaction: {
            "keyboard": {
                "enabled": true
            },
            "multiselect": true,
            hover: true
        },
        manipulation: {

            addNode: function (data, callback) {
                $('#Operation').innerHTML = "Create Node";
                document.getElementById('node-id').value = data.id;
                document.getElementById('node-cpu').value = 200;
                document.getElementById('saveButton').onclick = saveNodeData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = clearPopUp.bind();
                $('#node-modal').modal("show");
            },
            editNode: function (data, callback) {
                // filling in the popup DOM elements
                $('#Operation').innerHTML = "Edit Node";
                document.getElementById('node-id').value = data.id;
                // document.getElementById('node-cpu').value = data.cpu;
                $("#node-cpu").data('ionRangeSlider').update({
                    from: data.cpu
                });
                document.getElementById('saveButton').onclick = saveNodeData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = cancelEdit.bind(this, callback);
                $('#node-modal').modal("show");
            },
            addEdge: function (data, callback) {
                if (data.from != data.to) {
                    $('#EdgeOperation').innerHTML = "Add edge";
                    document.getElementById('edge-id').value = data.from + "--" + data.to;
                    document.getElementById('edge-bw').value = 1000000000;
                    document.getElementById('edge-delay').value = 3;
                    document.getElementById('saveEdgeButton').onclick = saveEdgeData.bind(this, data, callback);
                    document.getElementById('cancelEdgeButton').onclick = cancelEdit.bind(this, callback);
                    $('#edge-modal').modal("show");
                }
            },
            // editEdge: false
            editEdge: function (data, callback) {

                if (data.from != data.to) {
                    $('#EdgeOperation').innerHTML = "Add edge";
                    edge = edges.get(data.id)
                    document.getElementById('edge-id').value = data.id;
                    // document.getElementById('edge-bw').value = edge.bw;
                    bwstr = humanFormat(edge.bw, {
                        unit: 'bps'
                    });
                    bwpos = values.indexOf(bwstr)
                    $("#edge-bw").data('ionRangeSlider').update({
                        from: bwpos
                    });
                    $("#edge-delay").data('ionRangeSlider').update({
                        from: edge.delay
                    });
                    document.getElementById('saveEdgeButton').onclick = saveEdgeData.bind(this, data, callback);
                    document.getElementById('cancelEdgeButton').onclick = cancelEdit.bind(this, callback);
                    $('#edge-modal').modal("show");
                    // callback(data);
                }
            }
        }
    };
    container = document.getElementById('mynetwork');
    network = new vis.Network(container, data, options);
}

function jsontonetwork(topojson) {
    var topo = JSON.parse(topojson);
    for (var node in topo.nodes) savenode(topo.nodes[node]);
    for (var edge in topo.links) saveedge(topo.links[edge]);

    function saveedge(data) {
        if (typeof data !== "object") return;
        edge = neutralEdge;
        edge.from = topo.nodes[data.source].id;
        edge.to = topo.nodes[data.target].id;
        edge.id = edge.from + "--" + edge.to;
        edge.bw = data.bandwidth;
        edge.delay = data.delay;

        edge.title = 'id:"' + edge.id + '" bw:' + humanFormat(parseInt(edge.bw), {unit: 'b'}) + '/s delay: ' + edge.delay;
        edge.color = {"color": getcolor(edge.delay)};
        edge.value = Math.log(edge.bw);

        // edge.penwidth = neutralEdge.penwidth;
        // edge.font = neutralEdge.font;
        // edge.len = neutralEdge.len;
        // edge.shadow = {};
        edges.update(edge);
    }

    function savenode(data) {
        if (typeof data !== "object") return;
        node = neutralNode;
        node.id = data.id;
        node.label = node.id;
        node.cpu = data.cpu == null ? $("#cpu").data("ionRangeSlider").result.from : data.cpu;
        node.title = 'cpu:' + node.cpu;
        // node.value = node.cpu;

        // node.shape = neutralNode.shape;
        // node.style = neutralNode.style;
        // node.color = neutralNode.color;
        // node.width = neutralNode.width;
        // node.font = neutralNode.font;

        node.shadow = {};
        nodes.update(node);
    }
}

function jsonobjectToNetworkSla(topo) {
    for (var node in topo.nodes) savenode(topo.nodes[node]);
    for (var edge in topo.links) saveedge(topo.links[edge]);

    function saveedge(data) {
        if (typeof data !== "object") return;
        var edge = edgesla;
        edge.bw = data.bandwith;
        edge.delay = data.delay;
        edge.fromsla = topo.nodes[data.source].id;
        edge.tosla = topo.nodes[data.target].id;

        edge.penwidth = neutralEdge.penwidth;
        edge.font = neutralEdge.font;
        edge.len = neutralEdge.len;
        // edge.color = {"color": getcolor(edge.delay)};
        edge.value = Math.log(edge.bw);
        edge.shadow = {};
        edge.label = edge.fromsla + "-->" + edge.tosla
        for (var fromto in data.mapping) {

            edge.from = data.mapping[fromto][0];

            edge.to = typeof data.mapping[fromto][1] === "String" ? data.mapping[fromto][1].replace("S", "CG").replace("VHG", "VMG").replace("VCDN", "VStr") : data.mapping[fromto][1];
            edge.id = edge.label + "(" + edge.from + "--" + edge.to + ")";

            edge.title = 'id:"' + edge.id + '" bw:' + humanFormat(parseInt(edge.bw), {unit: 'b'}) + '/s delay: ' + edge.delay;

            edges.update(edge);
        }


    }

    function savenode(data) {
        if (typeof data !== "object") return;
        if (data.id.startsWith("CDN")) {
            node = cdnNode;
        }
        else if (data.id.startsWith("S")) {
            node = sourceNode;
            data.id= data.id.replace ("S","CG");
        } else if (data.id.startsWith("VCDN")) {
            node = vcdnNode;
            data.id= data.id.replace ("VCDN","VStr");

        } else if (data.id.startsWith("VHG")) {
            node = VHGNode;
            data.id= data.id.replace ("VHG","VMG");

        }
        else {
            node = {};
        }


        node.id = data.id;
        node.label = node.id;
        node.cpu = data.cpu;
        node.bw = data.bandwidth;
        node.title = 'cpu:' + node.cpu;
        // node.value = node.cpu;

        node.shape = neutralNode.shape;
        node.style = neutralNode.style;
        node.color = neutralNode.color;
        node.width = neutralNode.width;
        node.font = neutralNode.font;

        node.shadow = {};
        nodes.update(node);
        edge = edgeExternal;
        edge.from = data.mapping
        edge.to = node.id
        edge.bw = data.bandwidth;
        edge.id = edge.from + "--" + edge.to;
        edge.title = 'id:"' + edge.id + '" bw:' + humanFormat(parseInt(edge.bw), {unit: 'b'}) + '/s';
        edges.update(edge);
    }
}

function networktojson(edges, nodes) {

    if (!Array.prototype.indexOfid) {
        Array.prototype.indexOfid = function (elt /*, from*/) {
            var len = this.length;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);

            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
                    this[from].id === elt)
                    return from;
            }
            return -1;
        };
    }

    var jsonnode = [];
    var jsonedge = [];
    nodes.forEach(function (node) {
        if (node.typenode == "neutral") jsonnode.push({"id": node.id, "cpu": node.cpu})
    });
    edges.forEach(function (edge) {
        if (edge.typeedge == "neutral") {
            jsonedge.push({
                "source": jsonnode.indexOfid(edge.from),
                "target": jsonnode.indexOfid(edge.to),
                "bw": edge.bw,
                "delay": edge.delay
            })
        }
    });
    var json = {
        "directed": false,
        "graph": {
            "name": "Personal Graph"
        },
        "nodes": jsonnode,
        "links": jsonedge,
        "multigraph": false
    };
    var json64 = window.btoa(JSON.stringify(json));
    return json64;
}

/**
 * clear topo but not remove entry point cdn or user
 */
function clearTopo() {
    resetTopo("clean")
}
/**
 * clear topo and remove entry point cdn or user if type!="clean"
 * @param type
 */
function resetTopo(type) {
    nodes.forEach(function (node) {
        if (node.typenode != "neutral") {
            nodes.remove(node.id)
        }
        else if (type != "clean") {
            node.image = neutralImage;
            nodes.update(node)
        }
    });
    edges.forEach(function (edge) {
        if (edge.typeedge != "neutral") {
            edges.remove(edge.id)
        }
    });
}