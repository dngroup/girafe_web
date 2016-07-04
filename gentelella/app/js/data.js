var urlData = "http://localhost:9000/api/simu/data/";
var startDate;
Chart.defaults.global.legend = {
    enabled: false
};

var timeFormat = 'MM/DD/YYYY HH:mm:ss';

function newDate(days) {
    var a = moment().add(days, 's').toDate();
    return a;
}

function newDateString(days) {
    return moment().add(days, 's').format(timeFormat);
}

var randomScalingFactor = function () {
    return Math.round(Math.random() * 10);
};

function getDatas(){
    var req = new XMLHttpRequest(),
        data = {};


    function onProgress(e) {

    }

    function onError(e) {

    }

    function onLoad(e) {
        if(req.status >= 200 && req.status <= 299) {
            myTimer(req.responseText);
        }
    }
    req.onprogress = onProgress;
    req.onload = onLoad;
    req.onerror = onError;
    req.open('GET', urlData + sessionInfo.sessionId, true);
    req.send(null);
}


// Line chart
var ctx = document.getElementById("lineChart");
var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [],
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    type: "time",
                    time: {
                        format: timeFormat,
                        // round: 'day'
                        tooltipFormat: 'll HH:mm'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }]
            }
        }
    }
};

window.lineChart = new Chart(ctx, config);
config.options.animation.duration = 0;

function svgAppended() {
    startDate = Date.now();
    getDatas();
    timer = setInterval(
        function () {
            getDatas()
        }, 10000);

}

function myTimer(dataText) {
    var datasetTitle;
    var dataParsed = Papa.parse(dataText, {
        header: true
    });
    for (var j = 0; j < dataParsed.data.length; j++) {
        // Add to the dataset
        for(var k in dataParsed.data[j]){
            if(k!== "UNIX") {
                var datasetExist = config.data.datasets.some(function (elem) {
                    return (elem.label === k);
                })
                if (!datasetExist) {
                    var r = Math.floor(Math.random() * 256);
                    var g = Math.floor(Math.random() * 256);
                    var b = Math.floor(Math.random() * 256);
                    config.data.datasets.push({
                        label: k,
                        backgroundColor: "rgba(" + r + ", " + g + ", " + b + ", 0.3)",
                        borderColor: "rgba(" + r + ", " + g + ", " + b + ", 0.7)",
                        pointBorderColor: "rgba(" + r + ", " + g + ", " + b + ", 0.7)",
                        pointBackgroundColor: "rgba(" + r + ", " + g + ", " + b + ", 0.7)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(" + r + ", " + g + ", " + b + ", 1)",
                        pointBorderWidth: 1,
                        data: [{
                            x: newDateString(0),
                            y: 0
                        }]
                    })
                }
            }
        }

        var date = parseInt((dataParsed.data[j].UNIX - startDate) / 1000);
        var label = date;
        config.data.labels.push(label);

        $.each(config.data.datasets, function (i, dataset) {
            dataset.data.push({
                x: newDateString(date),
                y: dataParsed.data[j][dataset.label],
            });
        });


        if (config.data.labels.length > 30) {
            config.data.labels.splice(0, 1); // remove the label first

            config.data.datasets.forEach(function (dataset, datasetIndex) {
                dataset.data.shift();
            });
        }

        window.lineChart.update();
    }
}