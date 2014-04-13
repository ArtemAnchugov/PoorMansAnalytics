(function() {
	Graph = {};
	Graph.urlVsTime = function(csvUrl, containerElementName, plotTitle){
		var plotSettings = {
			"Cost": { plotter: Graph.plotters.barChartPlotter },
			axes: { x: { valueFormatter: Graph.formatters.queryNameValueFormatter,
						 axisLabelFormatter: Graph.formatters.queryNameAxisLabelFormatter },
					y: { valueFormatter: Graph.formatters.timeTakenInMinutesValueFormatter,
						 axisLabelFormatter: Graph.formatters.timeTakenInMinutesAxisLabelFormatter } },
			runner : 0,
			xValueParser: function(x, thisGraph) {
				//hack to make CSV files without "first column" work
				thisGraph.user_attrs_.runner += 1;
				return thisGraph.user_attrs_.runner;
			},
			visibility: [true, false, false, false, false],
			animatedZooms: true,
			dateWindow: [0, 16],
			ylabel: 'Cost (min)',
			xlabel: 'Url',
			colors: ['#FF2D55'],
			ticker: Dygraph.numericTicks,
			title: plotTitle			
		};
		fetchDataAndDrawPlot(csvUrl, containerElementName, plotSettings);
	};
	Graph.urlVsHits = function(csvUrl, containerElementName, plotTitle){
		var plotSettings = {
			"Hits": { plotter: Graph.plotters.barChartPlotter},
			axes: { x: { valueFormatter: Graph.formatters.queryNameValueFormatter,
						 axisLabelFormatter: Graph.formatters.queryNameAxisLabelFormatter }},
			runner : 0,
			xValueParser: function(x, thisGraph) {
				//hack to make CSV files without "first column" work
				thisGraph.user_attrs_.runner += 1;
				return thisGraph.user_attrs_.runner;
			},
			visibility: [true, false, false, false, false],
			animatedZooms: true,
			dateWindow: [0, 16],
			ylabel: 'Hits',
			xlabel: 'Url',
			colors: ['#007AFF'],
			ticker: Dygraph.numericTicks,
			title: plotTitle
		};
		fetchDataAndDrawPlot(csvUrl, containerElementName, plotSettings);
	};

	Graph.timeOfTheDayVsTime = function(csvUrl, containerElementName, plotTitle){
		var plotSettings = {
			// options go here. See http://dygraphs.com/options.html
			"Average time-taken": {
				plotter: Graph.plotters.barChartPlotter //custom plotter
			},
			axes: { x: { valueFormatter: Graph.formatters.timeOfTheDayValueFormatter,
						 axisLabelFormatter: Graph.formatters.timeOfTheDayAxisLabelFormatter },
					y: { valueFormatter: Graph.formatters.timeTakenValueFormatter,
						 axisLabelFormatter: Graph.formatters.timeTakenAxisLabelFormatter }
				  },
			visibility: [true, false, false, false],
			/*legend: 'always',*/
			animatedZooms: true,
			dateWindow: [4, 19],
			ylabel: 'Time-taken (s)',
			xlabel: 'Time of the day',
			colors: ['#4CD964'],
			title: plotTitle
		};
		fetchDataAndDrawPlot(csvUrl, containerElementName, plotSettings);
	};
	Graph.timeOfTheDayVsHits = function(csvUrl, containerElementName, plotTitle){
		var plotSettings = {
			// options go here. See http://dygraphs.com/options.html
			"Hits": {
				plotter: Graph.plotters.barChartPlotter //custom plotter
			},
			axes: { x: { valueFormatter: Graph.formatters.timeOfTheDayValueFormatter,
						 axisLabelFormatter: Graph.formatters.timeOfTheDayAxisLabelFormatter } },
			animatedZooms: true,
			dateWindow: [4, 19],
			ylabel: 'Hits',
			xlabel: 'Time of the day',
			colors: ['#FF9500'],
			title: plotTitle
		};
		fetchDataAndDrawPlot(csvUrl, containerElementName, plotSettings);
	};
	
	
	
	Graph.plotters = {};
	Graph.plotters.barChartPlotter = function(e) {
		var ctx = e.drawingContext;
		var points = e.points;
		var y_bottom = e.dygraph.toDomYCoord(0);  // see http://dygraphs.com/jsdoc/symbols/Dygraph.html#toDomYCoord

		// This should really be based on the minimum gap
		var bar_width = 2 / 3 * (points[1].canvasx - points[0].canvasx);
		ctx.fillStyle = e.color;

		// Do the actual plotting.
		for (var i = 0; i < points.length; i++) {
			var p = points[i];
			var center_x = p.canvasx;  // center of the bar

			ctx.fillRect(center_x - bar_width / 2, p.canvasy,
				bar_width, y_bottom - p.canvasy);
			ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
				bar_width, y_bottom - p.canvasy);
		}
	};
	
	Graph.formatters = {};
	Graph.formatters.timeOfTheDayValueFormatter = function(x) {
		var finnishTime = x + 2;
		return finnishTime + ":00-" + (finnishTime + 1) + ":00";
	};
	Graph.formatters.timeOfTheDayAxisLabelFormatter = function(x) {
		var finnishTime = x + 2;
		return finnishTime + ":00";
	};
	Graph.formatters.timeTakenValueFormatter = function(y) { return y/1000 + 's'; };
	Graph.formatters.timeTakenAxisLabelFormatter = function(y) { return y/1000;	};
	Graph.formatters.timeTakenInMinutesValueFormatter = function(y) { return (y/60000).toFixed(1) + ' min'; };
	Graph.formatters.timeTakenInMinutesAxisLabelFormatter = function(y) { return (y/60000).toFixed(1); };
	
	Graph.formatters.queryNameValueFormatter = function(y, opt, seriesName, g) {
		if(y==0)
			return '';
		else
			return g.file_.split('\n')[y].split(',')[0];
	};
	Graph.formatters.queryNameAxisLabelFormatter = function(y, opt, seriesName, g) {
		if(y==0)
			return '';
		else
			return g.file_.split('\n')[y].split(',')[0];
	};
	var fetchDataAndDrawPlot = function(csvUrl, containerElementName, plotSettings) {
		$.get(csvUrl, function(data) {
				new Dygraph(document.getElementById(containerElementName), data, plotSettings);
						// For possible data formats, see http://dygraphs.com/data.html
			// The x-values could also be dates, e.g. "2012/03/15"
		});
	}; 
})();