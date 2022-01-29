var enableChart = true;

var chartTimeout;
var chartTimeoutRunner;

$(function() {
    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        colors: ['#ADBAFF'],
        lang: {
        	numericSymbols: ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "Nn", "Dc"]
        }
    });

    var chart;
    $('#chartContainer').highcharts({
        chart: {
            type: 'areaspline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function() {
                    // set up the updating of the chart each ten seconds
                    chartTimeoutRunner = (function(){
                    	var series = Highcharts.charts[0].series[0];
	                    chart = this;
	                    counter = 0;
	                    return function() {
	                    	if(enableChart){
		                        var x = (new Date()).getTime(), //current time
		                            y = player.money;
		                        //shifts if series length is longer than player set length
		                        var shift = series.data.length >= player.chartLength;
		                        series.addPoint([x, y], true, shift, false)  
		                    }
		                    else {
		                    	series.setData([]); //wipes series if chart off
		                    }
		                    chartTimeout = setTimeout(arguments.callee, player.chartDelay);
	                    };
	                })();
	                chartTimeout = setTimeout(chartTimeoutRunner, player.chartDelay);
                }
            }
        },
        title: {
            text: 'Money vs Time'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Money'
            },
            type: 'logarithmic',
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            labels: {
            	formatter: function(){
            		return displayNum(this.value, true);
            	}
            }
        },
        tooltip: {
            formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                    displayNum(this.y, true);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Money',
            data: (function() {
                var data = [[(new Date()).getTime(), player.money]];
                return data;
            })(),
            marker: {
            	enabled: false //toggles visibility of points
            }
        }]
    });
    
    var chart = $("#chartContainer").highcharts(),
	type = 1,
	types = ["logarithmic", "linear"];

	$("#chartAxisToggle").click(function(){
		chart.yAxis[0].update({type: types[type]})
		type++;
		if(type === types.length) type = 0;
	});
	
	$("#submitChartSettings").click(function(){
		var newDelay = parseInt($("#chartPointDelay").val());
		var newLength = parseInt($("#chartNumPoints").val());
		
		if(newDelay >= 500){
			player.chartDelay = newDelay;
			clearTimeout(chartTimeout);
			chartTimeout = setTimeout(chartTimeoutRunner, player.chartDelay);
		}
		else alert("Delay between points must be at least 500 ms.");
		
		if(newLength >= 1 && newLength <= 10000) {
			while(Highcharts.charts[0].series[0].points.length > newLength) Highcharts.charts[0].series[0].points[0].remove(false);
			Highcharts.charts[0].redraw();
			player.chartLength = newLength;
		}
		else alert("Number of points must be between 1 and 10000.")
	});
});
