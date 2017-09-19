var chart = null;
//chartConfig: to be filled by data loading functions to prepare config for charts.
var chartConfig = {}
var currentChartType = 'scatter';
var currentScope = 0; // 0 for all points, 1 for only visible
var selectedCol = '';
var data_function = null;
var data_name = null;

// to know if currently load chart is special(boxplot or for unified_classif)
var initialise = true;

function initChart() {
	//dummy chart to support transition when changing data or chart type
	var xRandomScattering = currentChartType == 'scatter';
	var yAxis = {};
	if (currentChartType == 'bar' && data_function != ruralUrban)
		yAxis = {
			tick: {
				format: function(d) {
					switch (d) {
						case 1395:
							return "Q1";
						case 2790:
							return "Q2";
						case 4185:
							return "Q3";
						case 5580:
							return "Q4";
						case 6976:
							return "Q5";
					}
				},
				values: [0, 1395, 2790, 4185, 5580, 6976],
			}
		};
	chart = c3.generate({
		bindto: '#chart',
		data: {
			columns: [
                ['data1', ],
            ],
			type: currentChartType,
			xRandomScattering: xRandomScattering,
			colors: {
				'rank': 'blue',
				'emprank': 'orange',
				'incrank': 'green',
				'hlthrank': 'red',
				'edurank': 'purple'
			},
		},
		tooltip: {
			format: {
				name: function(name, ratio, id, index) {
					if (clusters_dict[name])
						return clusters_dict[name];
					return name;
				},
			},
		},
		axis: {
			x: {
				type: 'category', // this needed to load string x value
				tick: {
					format: function(d) {
						return chart.category(d)
						// console.log(this);
						// return d;
					},
					values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				}
			},
			y: yAxis,
		},

	});
	initialise = false;
}

function scopeSelected(selector) {
	currentScope = selector.options.selectedIndex;
	data_function(data_name);
}

function chartLoad() {
	currentChartType = 'line';
	chart.transform(currentChartType);
}

function scatterPlotLoad() {
	currentChartType = 'scatter';
	initialise = true;
	if (initialise) {
		initChart();
		if (data_name == 'unified_classif_value') {
			chart = c3.generate({
				bindto: '#chart',
				data: {
					x: 'group_name',
					json: chartConfig.data.rows,
					keys: {
						x: 'group_name',
						value: chartConfig.columns,
					},
					type: currentChartType,
					xRandomScattering: currentChartType == 'scatter',
					yRandomScattering: currentChartType == 'scatter',
				},
				tooltip: {
					format: {
						value: function(d) {
							if (d >= 4.7)
								return "Large Urban Areas";
							if (d >= 3.7)
								return "Smaller Urban Areas";
							if (d >= 2.7)
								return "Accessible Settlements";
							if (d >= 1.7)
								return "Sparse/Remote Settlements";
							if (d >= 0.7)
								return "Accessible Villages/Dwellings";
							if (d >= -0.3)
								return "Sparse/Remote Villages/Dwellings";
						}
					}
				},
				axis: {
					x: {
						type: 'category', // this needed to load string x value
						tick: {
							format: function(d) {
								return chart.category(d);
							},
							values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
						}
					},
					y: {
						min: 0,
						max: 6,
						// padding: {
						//     bottom: 0,
						//     top: 0
						// },
						tick: {
							format: function(d) {
								switch (d) {
									case 5:
										return "U1";
									case 4:
										return "U2";
									case 3:
										return "R1";
									case 2:
										return "R2";
									case 1:
										return "R3";
									case 0:
										return "R4";
								}
							},
							values: [0, 1, 2, 3, 4, 5],
							//width: 0
						}
					}
				}

			});
			chart.load({
				x: 'group_name',
				json: chartConfig.data.rows,
				keys: {
					x: 'group_name',
					value: chartConfig.columns,
				},
				type: currentChartType,
				xRandomScattering: currentChartType == 'scatter',
				yRandomScattering: currentChartType == 'scatter',
			});

		} else {
			chart.load({
				//x: 'group_name',
				json: chartConfig.data.rows,
				//unload: [selectedCol],
				keys: {
					x: 'group_name',
					value: chartConfig.columns,
				},
			});
			if (data_function == census) {
				var margin = {
						top: 40,
						right: 20,
						bottom: 30,
						left: 40
					},
					width = 960 - margin.left - margin.right,
					height = 500 - margin.top - margin.bottom;

				var tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d) {
						return "<strong>Frequency:</strong> <span style='color:red'>" + 'koko' + "</span>";
					});
				var svg = d3.select("body").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				svg.call(tip);

				d3.selectAll('.c3-legend-item').on('mouseover', function(id) {
						chart.focus(id);
						tip.html("<span>" + clusters_dict[id] + "</span>").show();
					})
					.on('mouseout', function(id) {
						tip.hide();
						chart.revert();
					})
			}
		}

	} else
		chart.transform(currentChartType);
}

function barChartLoad() {
	currentChartType = 'bar';
	initialise = true;
	if (initialise) {
		initChart();
		if (data_name == 'unified_classif_value') {
			console.log(chartConfig.data.rows);
			var rows = d3.nest()
				.key(function(d) {
					return d.group_name;
				})
				.rollup(function(group) {
					var q = d3.nest()
						.key(function(d) {
							return d.unified_classif
						}).rollup(function(qd) {
							return (qd.length / group.length) * 100
						})
						.entries(group)
					return q;
				})
				.entries(chartConfig.data.rows);
			console.log(rows);

			var data = {
				rows: [],
			}
			for (i in rows) {
				var obj = {
					group_name: rows[i].key
				};
				for (j in rows[i].values) {
					obj[rows[i].values[j].key] = rows[i].values[j].values
				}
				data.rows.push(obj);
			}
			console.log(data);
			// initChart();
			chart = c3.generate({
				bindto: '#chart',
				data: {
					//x: 'group_name',
					json: data.rows,
					//unload: [selectedCol],
					keys: {
						x: 'group_name',
						value: ['R4', 'R3', 'R2', 'R1', 'U2', 'U1'],
					},
					type: currentChartType,
					groups: [
                        ['R4', 'R3', 'R2', 'R1', 'U2', 'U1']
                    ],
					order: function(data1, data2) {
						//debugger;
						return unified_class_dict[data1.id] - unified_class_dict[data2.id];
					}
				},
				tooltip: {
					format: {
						value: d3.format(",.2f")
					},
				},
				axis: {
					x: {
						type: 'category', // this needed to load string x value
					},
					y: {
						tick: {
							format: function(d) {
								return d + "%";
							},
							values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
						},
					},
				},
			});

		} else {
			var groups = [];
			if (data_function == census) {
				var rows = d3.nest()
					.key(function(d) {
						return d.group_name;
					})
					.rollup(function(d) {
						var sum = {};
						var total = 0;
						for (i in clusters[data_name]) {
							sum[clusters[data_name][i]] = d3.mean(d, function(g) {
								return g[clusters[data_name][i]];
							});
							total += sum[clusters[data_name][i]];
						}
						for (i in clusters[data_name]) {
							sum[clusters[data_name][i]] = (sum[clusters[data_name][i]] / total) * 100;
						}
						return sum;
					})
					.entries(chartConfig.data.rows);

				var data = {
					rows: [],
				}
				for (i in rows) {
					data.rows.push(Object.assign({}, {
						group_name: rows[i].key
					}, rows[i].values));
				}
				chart = c3.generate({
					bindto: '#chart',
					data: {
						x: 'group_name',
						json: data.rows,
						keys: {
							x: 'group_name',
							value: chartConfig.columns,
						},
						groups: [
                            chartConfig.columns
                        ],
						type: currentChartType,
						xRandomScattering: currentChartType == 'scatter',
					},
					tooltip: {
						format: {
							value: d3.format(",.2f"),
							name: function(name, ratio, id, index) {
								if (clusters_dict[name])
									return clusters_dict[name];
								return name;
							},
						},
					},
					axis: {
						x: {
							type: 'category', // this needed to load string x value
						},
						y: {
							tick: {
								format: function(d) {
									return d + "%";
								},
								values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
							},
						},
					},

				});
				var margin = {
						top: 40,
						right: 20,
						bottom: 30,
						left: 40
					},
					width = 960 - margin.left - margin.right,
					height = 500 - margin.top - margin.bottom;

				var tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d) {
						return "<strong>Frequency:</strong> <span style='color:red'>" + 'koko' + "</span>";
					});
				var svg = d3.select("body").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				svg.call(tip);

				d3.selectAll('.c3-legend-item').on('mouseover', function(id) {
						chart.focus(id);
						tip.html("<span>" + clusters_dict[id] + "</span>").show();
					})
					.on('mouseout', function(id) {
						tip.hide();
						chart.revert();
					})
			} else {
				var rows = d3.nest()
					.key(function(d) {
						return d.group_name;
					})
					.rollup(function(group) {
						var q = d3.nest()
							.key(function(d) {
								if (d[selectedCol] < 1395)
									return "Q1";
								if (d[selectedCol] < 2790)
									return "Q2";
								if (d[selectedCol] < 4185)
									return "Q3";
								if (d[selectedCol] < 5580)
									return "Q4";
								if (d[selectedCol] >= 5580)
									return "Q5";
							}).rollup(function(qd) {
								return (qd.length / group.length) * 100
							})
							.entries(group)
						return q;
					})
					.entries(chartConfig.data.rows);
				console.log(rows);

				var data = {
					rows: [],
				}
				for (i in rows) {
					var obj = {
						group_name: rows[i].key
					};
					for (j in rows[i].values) {
						obj[rows[i].values[j].key] = rows[i].values[j].values
					}
					data.rows.push(obj);
				}
				console.log(data);
				// initChart();
				chart = c3.generate({
					bindto: '#chart',
					data: {
						//x: 'group_name',
						json: data.rows,
						//unload: [selectedCol],
						keys: {
							x: 'group_name',
							value: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
						},
						type: currentChartType,
						groups: [
                            ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']
                        ],
						order: function(data1, data2) {
							return data1.id.localeCompare(data2.id);
						}
					},
					tooltip: {
						format: {
							value: d3.format(",.2f")
						},
					},
					axis: {
						x: {
							type: 'category', // this needed to load string x value
						},
						y: {
							tick: {
								format: function(d) {
									return d + "%";
								},
								values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
							},
						},
					},
				});
			}
		}
	} else {

	}

}

function boxplotLoad() {
	currentChartType = 'boxplot';
	if (chart.destroy) { // any type of charts but boxplot
		chart.destroy();
	} else {
		// to clear all element for chart container befor render new one.
		d3.select('#chart').selectAll('*').remove();
		//////////////////////////////////////////////////////
	}
	chart = makeDistroChart({
		data: chartConfig.data.rows,
		xName: 'group_name',
		yName: chartConfig.columns,
		axisLabels: {
			xAxis: chartConfig.columns,
			yAxis: null
		},
		selector: "#chart",
		// chartSize: {
		//     height: 460,
		//     width: 600
		// },
		// margin:{
		//     top:13,
		//     left:50,
		// },
		constrainExtremes: true
	});
	chart.renderBoxPlot();

	initialise = true;
}

var simd_colors = {
    'simd': 'blue',
    'employment': 'orange',
    'income': 'green',
    'health': 'red',
    'education': 'purple'

}

function SIMD(col) {
    d3.select('#boxplotBtn').style('display', 'unset');
    data_function = SIMD;
    data_name = col;
    var scope = this;
    //var select_statement = 'SELECT ' + col + ', quintile, group_name FROM "ahmednoureldeen".sg_simd_2016_grp';
    var select_statement = 'SELECT ' + col +
        ', group_name\
                            FROM "mapcomm-admin".sg_simd_2016, "mapcomm-admin".all_groups\
                            where ST_Contains( "mapcomm-admin".sg_simd_2016.the_geom, "mapcomm-admin".all_groups.the_geom)'
    if (currentScope == 1) {
        var bounds = map.getBounds();
        var envelope = 'ST_MakeEnvelope(' + bounds.getWest() + ',' + bounds.getSouth() + ',' + bounds.getEast() + ',' + bounds.getNorth() + ', 4326)';
        select_statement += ' AND ST_Contains(' + envelope + ',"mapcomm-admin".all_groups.the_geom)';

    }
    var query3 = $.getJSON(
        'https://carto.mapping.community:9090/user/hilld/api/v2/sql?q=' + select_statement,
        function(data1) {
            chartConfig.data = data1;
            chartConfig.columns = [col];
            if (currentChartType == 'boxplot')
                boxplotLoad();
            else if (currentChartType == 'bar') {
                // console.log(data1.rows);
                var rows = d3.nest()
                    .key(function(d) {
                        return d.group_name;
                    })
                    .rollup(function(group) {
                        var q = d3.nest()
                            .key(function(d) {
                                if (d[col] < 1395)
                                    return "Q1";
                                if (d[col] < 2790)
                                    return "Q2";
                                if (d[col] < 4185)
                                    return "Q3";
                                if (d[col] < 5580)
                                    return "Q4";
                                if (d[col] >= 5580)
                                    return "Q5";
                            }).rollup(function(qd) {
                                return (qd.length / group.length) * 100
                            })
                            .entries(group)
                        return q;
                    })
                    .entries(data1.rows);
                console.log(rows);

                var data = {
                    rows: [],
                }
                for (i in rows) {
                    var obj = {
                        group_name: rows[i].key
                    };
                    for (j in rows[i].values) {
                        obj[rows[i].values[j].key] = rows[i].values[j].values
                    }
                    data.rows.push(obj);
                }
                console.log(data);
                // initChart();
                chart = c3.generate({
                    bindto: '#chart',
                    data: {
                        //x: 'group_name',
                        json: data.rows,
                        //unload: [selectedCol],
                        keys: {
                            x: 'group_name',
                            value: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
                        },
                        type: currentChartType,
                        groups: [
                            ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']
                        ],
                        order: function(data1, data2) {
                            return data1.id.localeCompare(data2.id);
                        }
                    },
                    tooltip: {
                        format: {
                            value: d3.format(",.2f")
                        },
                    },
                    axis: {
                        x: {
                            type: 'category', // this needed to load string x value
                        },
                        y: {
                            tick: {
                                format: function(d) {
                                    return d + "%";
                                },
                                values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                            },
                        },
                    },
                });
                selectedCol = col;
            } else {
                //if (initialise)
                initChart();
                chart.load({
                    //x: 'group_name',
                    json: chartConfig.data.rows,
                    //unload: [selectedCol],
                    keys: {
                        x: 'group_name',
                        value: chartConfig.columns,
                    },
                });
                selectedCol = col;
            }

        });

}
var unified_class_dict = {"R4":0, "R3":1, "R2":2, "R1":3, "U2":4, "U1":5};
function ruralUrban(col) {
    d3.select('#boxplotBtn').style('display', 'unset');
    data_function = ruralUrban;
    data_name = col;
    var scope = this;
    var select_statement =
        'SELECT "mapcomm-admin".ruralurban.* , "mapcomm-admin".all_groups.group_name,\
    CASE \
        WHEN unified_classif =\'U1\' THEN 5\
        WHEN unified_classif =\'U2\' THEN 4\
        WHEN unified_classif =\'R1\' THEN 3\
        WHEN unified_classif =\'R2\' THEN 2\
        WHEN unified_classif =\'R3\' THEN 1\
        WHEN unified_classif =\'R4\' THEN 0\
    END AS  unified_classif_value\
    FROM "mapcomm-admin".ruralurban \
    inner join "mapcomm-admin".table_2011_oac on "mapcomm-admin".ruralurban.oa_sa = "mapcomm-admin".table_2011_oac.oa_sa\
    inner join "mapcomm-admin".all_groups on ST_Contains("mapcomm-admin".table_2011_oac.the_geom, "mapcomm-admin".all_groups.the_geom)';
    if (currentScope == 1) {
        var bounds = map.getBounds();
        var envelope = 'ST_MakeEnvelope(' + bounds.getWest() + ',' + bounds.getSouth() + ',' + bounds.getEast() + ',' + bounds.getNorth() + ', 4326)';
        select_statement += ' AND ST_Contains(' + envelope + ',"mapcomm-admin".all_groups.the_geom)';

    }
    var query3 = $.getJSON(
        'https://carto.mapping.community:9090/user/hilld/api/v2/sql?q=' + select_statement,
        function(data1) {
            //if (initialise)
            initChart();
            chartConfig.data = data1;
            chartConfig.columns = [col];
            if ('density_ppha' == col) {
                if (currentChartType == 'boxplot')
                    boxplotLoad();
                else {
                    if (initialise)
                        initChart();
                    chart.load({
                        x: 'group_name',
                        json: chartConfig.data.rows,
                        unload: [scope.selectedCol],
                        keys: {
                            x: 'group_name',
                            value: chartConfig.columns,
                        },
                    });
                }
            } else {
                //initChart();
                if (currentChartType == 'bar') {

                    console.log(data1.rows);
                    var rows = d3.nest()
                        .key(function(d) {
                            return d.group_name;
                        })
                        .rollup(function(group) {
                            var q = d3.nest()
                                .key(function(d) {
                                    return d.unified_classif
                                }).rollup(function(qd) {
                                    return (qd.length / group.length) * 100
                                })
                                .entries(group)
                            return q;
                        })
                        .entries(data1.rows);
                    console.log(rows);

                    var data = {
                        rows: [],
                    }
                    for (i in rows) {
                        var obj = {
                            group_name: rows[i].key
                        };
                        for (j in rows[i].values) {
                            obj[rows[i].values[j].key] = rows[i].values[j].values
                        }
                        data.rows.push(obj);
                    }
                    console.log(data);
                    // initChart();
                    chart = c3.generate({
                        bindto: '#chart',
                        data: {
                            //x: 'group_name',
                            json: data.rows,
                            //unload: [selectedCol],
                            keys: {
                                x: 'group_name',
                                value: ['R4', 'R3', 'R2', 'R1', 'U2', 'U1'],
                            },
                            type: currentChartType,
                            groups: [
                                ['R4', 'R3', 'R2', 'R1', 'U2', 'U1']
                            ],
                            order: function(data1, data2) {
                                //debugger;
                                return unified_class_dict[data1.id] - unified_class_dict[data2.id];
                            }
                        },
                        tooltip: {
                            format: {
                                value: d3.format(",.2f")
                            },
                        },
                        axis: {
                            x: {
                                type: 'category', // this needed to load string x value
                            },
                            y: {
                                tick: {
                                    format: function(d) {
                                        return d + "%";
                                    },
                                    values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                                },
                            },
                        },
                    });
                    selectedCol = col;

                } else {
                    chart = c3.generate({
                        bindto: '#chart',
                        data: {
                            x: 'group_name',
                            json: chartConfig.data.rows,
                            //unload: [scope.selectedCol],
                            keys: {
                                x: 'group_name',
                                value: chartConfig.columns,
                            },
                            type: currentChartType,
                            yRandomScattering: currentChartType == 'scatter',
                            xRandomScattering: currentChartType == 'scatter',
                        },
                        tooltip: {
                            format: {
                                value: function(d) {
                                    if (d >= 4.7)
                                        return "Large Urban Areas";
                                    if (d >= 3.7)
                                        return "Smaller Urban Areas";
                                    if (d >= 2.7)
                                        return "Accessible Settlements";
                                    if (d >= 1.7)
                                        return "Sparse/Remote Settlements";
                                    if (d >= 0.7)
                                        return "Accessible Villages/Dwellings";
                                    if (d >= -0.3)
                                        return "Sparse/Remote Villages/Dwellings";
                                }
                            }
                        },
                        axis: {
                            x: {
                                type: 'category', // this needed to load string x value
                                tick: {
                                    format: function(d) {
                                        return chart.category(d)
                                        // console.log(this);
                                        // return d;
                                    },
                                    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                                }
                            },
                            y: {
                                min: 0,
                                max: 6,
                                tick: {
                                    format: function(d) {
                                        switch (d) {
                                            case 5:
                                                return "U1";
                                            case 4:
                                                return "U2";
                                            case 3:
                                                return "R1";
                                            case 2:
                                                return "R2";
                                            case 1:
                                                return "R3";
                                            case 0:
                                                return "R4";
                                        }
                                    },
                                    values: [0, 1, 2, 3, 4, 5],
                                }
                            }
                        }
                    });
                    chart.load({
                        x: 'group_name',
                        json: chartConfig.data.rows,
                        unload: [scope.selectedCol],
                        keys: {
                            x: 'group_name',
                            value: chartConfig.columns,
                        },
                    });
                    initialise = true;
                }
            }
            scope.selectedCol = col;
        });
}


var clusters_dict = {
    // "health": {
    "vghealth": "Very good health",
    "ghealth": "Good health",
    "fairhealth": "Fair health",
    "badhealth": "Bad health",
    "vbadhealth": "Very bad health",
    // },
    // "economic" :{
    "eaemppt": "Economically active: Employee: Part-time",
    "eaempft": "Economically active: Employee: Full-time",
    "easelfemp": "Economically active: Self-employed",
    "eaunemp": "Economically active: Unemployed",
    "eafutist": "Economically inactive: Full time student",
    "eiretired": "Economically inactive: Retired",
    "eifutist": "Economically inactive: Student (including full-time students)",
    "eihome": "Economically inactive: Looking after home or family",
    "eisickdis": "Economically inactive: Long-term sick or disabled",
    "eiother": "Economically inactive: Other",
    // },
    // "industry": {
    "agricult": "A Agriculture, forestry and fishing",
    "extractive": "B Mining and quarrying",
    "manufact": "C Manufacturing",
    "energysup": "D Electricity, gas, steam and air conditioning supply",
    "watersup": "E Water supply; sewerage, waste management and remediation activities",
    "construct": "F Construction",
    "retail": "G Wholesale and retail trade; repair of motor vehicles and motor cycles",
    "transport": "H Transport and storage",
    "accommfood": "I Accommodation and food service activities",
    "infocomms": "J Information and communication",
    "finserv": "K Financial and insurance activities",
    "propserv": "L Real estate activities",
    "proftech": "M Professional, scientific and technical activities",
    "administ": "N Administrative and support service activities",
    "pubaddef": "O Public administration and defence; compulsory social security",
    "education": "P Education",
    "health": "Q Human health and social work activities",
    "otherind": "R S T and U Other",
    // },
    // "work travel": {
    "ttwhome": "Work mainly at or from home",
    "ttwtrain": "Train",
    "ttwtube": "Underground metro light rail tram",
    "ttwbus": "Bus minibus or coach",
    "ttwmbike": "Motorcycle, scooter or moped",
    "ttwcar": "Driving a car or van",
    "ttwcarpass": "Passenger in a car or van including car share",
    "ttwtaxi": "Taxi",
    "ttwbike": "Bicycle",
    "ttwfoot": "On foot",
    "ttwother": "Other method of travel to work",
    // }
};

const clusters = {
    health: ['vghealth', 'ghealth', 'fairhealth', 'badhealth', 'vbadhealth'],
    economic: ['eaemppt', 'eaempft', 'easelfemp', 'eaunemp', 'eafutist', 'eiretired', 'eifutist', 'eihome', 'eisickdis', 'eiother'],
    industry: ['agricult', 'extractive', 'manufact', 'energysup',
        'watersup', 'construct', 'retail', 'transport', 'accommfood',
        'infocomms', 'finserv', 'propserv', 'proftech', 'administ', 'pubaddef', 'education', 'health', 'otherind'
    ],
    workTravel: ['ttwhome', 'ttwtrain', 'ttwtube', 'ttwbus', 'ttwmbike', 'ttwcar', 'ttwcarpass', 'ttwtaxi', 'ttwbike', 'ttwfoot', 'ttwother']
}

function census(clusterName) {
    d3.select('#boxplotBtn').style('display', 'none');
    data_function = census;
    data_name = clusterName;
    var scope = this;

    var select_statement = 'SELECT ' + clusters[clusterName].join(',') +
        ', "mapcomm-admin".all_groups.group_name\
        FROM "mapcomm-admin".censusuk11data \
        inner join "mapcomm-admin".table_2011_oac on "mapcomm-admin".censusuk11data.oacode = "mapcomm-admin".table_2011_oac.oa_sa\
        inner join "mapcomm-admin".all_groups on ST_Contains("mapcomm-admin".table_2011_oac.the_geom, "mapcomm-admin".all_groups.the_geom)';

    if (currentScope == 1) {
        var bounds = map.getBounds();
        var envelope = 'ST_MakeEnvelope(' + bounds.getWest() + ',' + bounds.getSouth() + ',' + bounds.getEast() + ',' + bounds.getNorth() + ', 4326)';
        select_statement += ' AND ST_Contains(' + envelope + ',"mapcomm-admin".all_groups.the_geom)';
    }

    var query3 = $.getJSON(
        'https://carto.mapping.community:9090/user/hilld/api/v2/sql?q=' + select_statement,
        function(data1) {
            // if (initialise)
            initChart();
            chartConfig.data = data1;
            chartConfig.columns = clusters[clusterName];
            if (currentChartType == 'bar') {
                var rows = d3.nest()
                    .key(function(d) {
                        return d.group_name;
                    })
                    .rollup(function(d) {
                        var sum = {};
                        var total = 0;
                        for (i in clusters[clusterName]) {
                            sum[clusters[clusterName][i]] = d3.mean(d, function(g) {
                                return g[clusters[clusterName][i]];
                            });
                            total += sum[clusters[clusterName][i]];
                        }
                        for (i in clusters[clusterName]) {
                            sum[clusters[clusterName][i]] = (sum[clusters[clusterName][i]] / total) * 100;
                        }
                        return sum;
                    })
                    .entries(data1.rows);

                var data = {
                    rows: [],
                }
                for (i in rows) {
                    data.rows.push(Object.assign({}, {
                        group_name: rows[i].key
                    }, rows[i].values));
                }
                console.log(data);
                initChart();
                chart = c3.generate({
                    bindto: '#chart',
                    data: {
                        x: 'x',
                        json: data.rows,
                        keys: {
                            x: 'group_name',
                            value: chartConfig.columns,
                        },
                        groups: [clusters[clusterName]],
                        type: currentChartType,
                    },
                    tooltip: {
                        format: {
                            value: d3.format(",.2f"),
                            name: function(name, ratio, id, index) {
                                if (clusters_dict[name])
                                    return clusters_dict[name];
                                return name;
                            },
                        },
                    },
                    axis: {
                        x: {
                            type: 'category', // this needed to load string x value
                        },
                        y: {
                            tick: {
                                format: function(d) {
                                    return d + "%";
                                },
                                values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                            },
                        },
                    },

                });
            } else {
                chart.load({
                    //x: 'group_name',
                    json: chartConfig.data.rows,
                    //unload: [selectedCol],
                    keys: {
                        x: 'group_name',
                        value: chartConfig.columns,
                    },
                });
            }
            initialise = true;
            scope.selectedCol = clusters[clusterName];

            var margin = {
                    top: 40,
                    right: 20,
                    bottom: 30,
                    left: 40
                },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Frequency:</strong> <span style='color:red'>" + 'koko' + "</span>";
                });
            var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.call(tip);

            d3.selectAll('.c3-legend-item').on('mouseover', function(id) {
                    chart.focus(id);
                    tip.html("<span>" + clusters_dict[id] + "</span>").show();
                })
                .on('mouseout', function(id) {
                    tip.hide();
                    chart.revert();
                })

        });
}
