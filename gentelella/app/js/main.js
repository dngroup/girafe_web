
var timeFormat = 'MM/DD/YYYY HH:mm';
var s = Snap("#svg");
var clientColor = "#00ff00";
var cdnColor = "#ff0000";
var neutralColor = "#000000";
var bothColor ="#0000ff";

var filterBlur = s.filter(Snap.filter.blur(4));

function hello(s2) {
    var text = s2.select("text");
    var pol = s2.select("polygon");
    if(getListToModify() === "clients") {
        if(pol.node.attributes.stroke.value !== clientColor && pol.node.attributes.stroke.value !== bothColor) {
            if (pol.node.attributes.stroke.value !== cdnColor) {
                pol.node.attributes.stroke.value = clientColor;
            } else {
                pol.node.attributes.stroke.value = bothColor;
            }

            addClient(text.node.innerHTML);
        } else {
            if(pol.node.attributes.stroke.value === bothColor) {
                pol.node.attributes.stroke.value = cdnColor;
            } else {
                pol.node.attributes.stroke.value = neutralColor;
            }
            delClient(text.node.innerHTML);
        }
    }
    if(getListToModify() === "cdns") {
        if(pol.node.attributes.stroke.value !== cdnColor && pol.node.attributes.stroke.value !== bothColor) {
            if (pol.node.attributes.stroke.value !== clientColor) {
                pol.node.attributes.stroke.value = cdnColor;
            } else {
                pol.node.attributes.stroke.value = bothColor;
            }
            addCDN(text.node.innerHTML);
        } else {
            if(pol.node.attributes.stroke.value === bothColor) {
                pol.node.attributes.stroke.value = clientColor;
            } else {
                pol.node.attributes.stroke.value = neutralColor;
            }
            delCDN(text.node.innerHTML);
        }
    }
/*    text.attr({
        fill: "#900",
        "font-size": "30px"
    });*/
}

///////////////////////////////////////////////
// First svg loaded at start
///////////////////////////////////////////////
var da = Snap.load("./input/res2empty.svg", function (f) {
    s.zpd('destroy')
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
    g.attr({
        filter: filterBlur
    });

    s.append(g);
    s.zpd({zoom: true, drag: false});
});

///////////////////////////////////////////////
// Svg loaded when a grid is submitted
///////////////////////////////////////////////
function ctrlTopo() {
    s.zpd('destroy')
    s.clear();
    var da = Snap.load("http://localhost:9000/api/simu/svg/" + sessionInfo.sessionId, function (f) {
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

}

///////////////////////////////////////////////
// Svg and action when the SLA is sent
///////////////////////////////////////////////
function ctrlSLA(svg) {
    s.zpd('destroy')
    s.clear();
    var da = Snap.load("./input/res2.svg", function (f) {
        var childNode = f.selectAll("g");

        for (var i = 0; i < childNode.length; i++) {
            var c = childNode[i];
            console.log(c.id);

            if (c.node.className.baseVal == "node") {
                console.log(c.node.id);
                childNode[i].click(function () {
                    //hello(this);
                });
            }
        }

        g = f.select("g");
        s.append(g);
        s.zpd({zoom: true, drag: false});
        $("#videoWindow").show();
        $("#graphWindow").show();
    });
}