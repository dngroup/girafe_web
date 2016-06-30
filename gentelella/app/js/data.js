
Chart.defaults.global.legend = {
    enabled: false
};

var timeFormat = 'MM/DD/YYYY HH:mm';

function newDate(days) {
    var a = moment().add(days, 'd').toDate();
    return a;
}

function newDateString(days) {
    return moment().add(days, 'd').format(timeFormat);
}

var randomScalingFactor = function () {
    return Math.round(Math.random() * 10);
};

// Line chart
var ctx = document.getElementById("lineChart");
var config = {
    type: 'line',
    data: {
        labels: [newDate(0)],
        datasets: [{
            label: "My First dataset",
            backgroundColor: "rgba(38, 185, 154, 0.31)",
            borderColor: "rgba(38, 185, 154, 0.7)",
            pointBorderColor: "rgba(38, 185, 154, 0.7)",
            pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointBorderWidth: 1,
            data: [{
                x: newDateString(0),
                y: 0
            }]
        }, {
            label: "My Second dataset",
            backgroundColor: "rgba(3, 88, 106, 0.3)",
            borderColor: "rgba(3, 88, 106, 0.70)",
            pointBorderColor: "rgba(3, 88, 106, 0.70)",
            pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(151,187,205,1)",
            pointBorderWidth: 1,
            data: [{
                x: newDateString(0),
                y: 0
            }]
        }]
    },
};

window.lineChart = new Chart(ctx, config);
config.options.animation.duration = 0;
timer = setInterval(
    function () {
        myTimer(config)
    }, 1000);

var startDate = Date.now();
function myTimer(lineChart) {
    var date = parseInt((Date.now() - startDate) / 1000);
    var label = date;
    config.data.labels.push(label);

    $.each(config.data.datasets, function (i, dataset) {

        dataset.data.push({
            x: newDate(date),
            y: randomScalingFactor(),
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