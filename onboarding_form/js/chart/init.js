var data = [
    {
        key: "gedanken",
        y: 25,
        color:"#66308F"
    },
    {
        key: "bewusstsein",
        y: 30,
        color:"#E6DCED"
    },
    {
        key: "emotion",
        y: 20,
        color:"#FDF101"
    },
    {
        key: "körper",
        y: 30,
        color:"#D1232A"
    },
    {
        key: "miteinander",
        y: 25,
        color:"#009aff"
    }
];



nv.addGraph(function() {

    var width = 220,
        height = 200;

    var chart = nv.models.pieChart()
        .margin ({top: 10, right: 10, bottom: 20, left: 0})
        .x(function(d) { return d.key })
        .y(function(d) { return d.y })
        .labelThreshold(.0)
        //.showLabels(false)
        .showLegend(false)
        .donutLabelsOutside(true)


        .tooltips(false)
        .color(function(d) { return d.data.color })
        //.width(width)
        //.height(height)
        //.donutRatio(0.5) //Configure how big you want the donut hole size to be.
        .donut(true);

//    chart.pie
//        .startAngle(function(d) { return d.startAngle/2 -Math.PI/2 })
//        .endAngle(function(d) { return d.endAngle/2 -Math.PI/2 });



    console.log(chart);

    console.log(d3.select("#chart"));

    d3.select("#chart")
        .datum(data)
        .transition().duration(1200)
        //.attr('width', width)
        //.attr('height', height)
        .call(chart);

    return chart;
});