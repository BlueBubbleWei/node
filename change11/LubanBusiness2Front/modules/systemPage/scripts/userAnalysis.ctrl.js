//主页面
app.controller('userAnalysisController', function ($scope,$compile,$location) {
    /*画图1*/
    var waveChart = echarts.init(document.getElementById('userChart'));
    var base = +new Date(2011, 9, 3);
    var oneDay = 24 * 3600 * 1000;
    var date = [];
    var data = [Math.random() * 1000];
    var data1 = [Math.random() * 1500];
    var data2 = [Math.random() * 1400];
    var data3 = [Math.random() * 1200];
    var data4 = [Math.random() * 1000];
    for (var i = 1; i < 1800; i++) {
        var now = new Date(base += oneDay);
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
        data1.push(Math.round((Math.random() - 0.5) * 20 + data1[i - 1]));
        data2.push(Math.round((Math.random() - 0.5) * 20 + data2[i - 1]));
        data3.push(Math.round((Math.random() - 0.5) * 20 + data3[i - 1]));
        data4.push(Math.round((Math.random() - 0.5) * 20 + data4[i - 1]));
    }
    /* console.log(date)
     console.log(data)*/
    option= {
        tooltip: {
            trigger: 'axis',
            axisPointer:{
                type: 'line',
                lineStyle: {
                    color: '#aa1019',
                    width: 2,
                    type: 'solid'
                }
            },
            position: function (pt) {
                return [pt[0], '5%'];
            }
        },
        grid: {
            left: '0%',
            right: '4%',
            bottom: '20%',
            containLabel: true,
            textStyle: {
                color: '#333',
                fontSize: '14'
            }
        },
        toolbox: {
            feature: {
                dataZoom : {
                    databackgroundColor:'rgba(0,0,0,0)',
                    backgroundColor:'rgba(0,0,0,0)',
                    yAxisIndex: 'none',
                    // show: false,
                    title: {
                        dataZoom: '区域缩放',
                        dataZoomReset: '区域缩放后退'
                    }
                },
                restore : {
                    // show : false,
                    title : '还原'
                },
                saveAsImage : {
                    // show : false,
                    title : '保存为图片',
                    type : 'png',
                    lang : ['点击保存']
                },
                dataView : {
                    // show : false
                },
            }
        },
        calculable : true,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value',
            scale: true,
            // boundaryGap: [0.01, 0.01],
            splitArea: { show: false },
            min:450,
            max:1600
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 16
        }, {
            start: 0,
            end: 16,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 1,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [
            {//PDS
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:10,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(255, 70, 131)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255,255,255)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 255, 255)'
                        }])
                    }
                },
                data: data
            },
            {
                name:'模拟数据',
                type:'line',
                symbol: 'circle',
                symbolSize:10,
                smooth:true,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(0, 0, 0)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255,255,255)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 255, 255)'
                        }])
                    }
                },
                data: data1
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:10,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#989898'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255,255,255)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 255, 255)'
                        }])
                    }
                },
                data: data2
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:10,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#c03f18'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255,255,255)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 255, 255)'
                        }])
                    }
                },
                data: data3
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:10,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#88929a'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255,255,255)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 255, 255)'
                        }])
                    }
                },
                data: data4
            },
        ],
    };
    waveChart.setOption(option);
    /*画图2*/
    var checkuser = echarts.init(document.getElementById('checkuser'));
    var base1 = +new Date(2011, 9, 3);
    var oneDay1 = 24 * 3600 * 1000;
    var date1 = [];
    var data7 = [Math.random() * 1000];
    var data8 = [Math.random() * 1500];
    var data9 = [Math.random() * 1400];
    var data10 = [Math.random() * 1200];
    var data11= [Math.random() * 1000];
    for (var i = 1; i < 1800; i++) {
        var now = new Date(base += oneDay);
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        data7.push(Math.round((Math.random() - 0.5) * 20 + data7[i - 1]));
        data8.push(Math.round((Math.random() - 0.5) * 20 + data8[i - 1]));
        data9.push(Math.round((Math.random() - 0.5) * 20 + data9[i - 1]));
        data10.push(Math.round((Math.random() - 0.5) * 20 + data10[i - 1]));
        data11.push(Math.round((Math.random() - 0.5) * 20 + data11[i - 1]));
    }
    /* console.log(date)
     console.log(data)*/
    option= {
        tooltip: {
            trigger: 'axis',
            axisPointer:{
                type: 'line',
                lineStyle: {
                    color: '#aa1019',
                    width: 2,
                    type: 'solid'
                }
            },
            position: function (pt) {
                return [pt[0], '5%'];
            }
        },
        grid: {
            left: '0%',
            right: '4%',
            bottom: '20%',
            containLabel: true,
            textStyle: {
                color: '#333',
                fontSize: '14'
            }
        },
        toolbox: {
            feature: {
                dataZoom : {
                    databackgroundColor:'rgba(0,0,0,0)',
                    backgroundColor:'rgba(0,0,0,0)',
                    yAxisIndex: 'none',
                    // show: false,
                    title: {
                        dataZoom: '区域缩放',
                        dataZoomReset: '区域缩放后退'
                    }
                },
                restore : {
                    // show : false,
                    title : '还原'
                },
                saveAsImage : {
                    // show : false,
                    title : '保存为图片',
                    type : 'png',
                    lang : ['点击保存']
                },
                dataView : {
                    // show : false
                },
            }
        },
        calculable : true,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value',
            scale: true,
            // boundaryGap: [0.01, 0.01],
            splitArea: { show: false },
            min:450,
            max:1600
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 16
        }, {
            start: 0,
            end: 16,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 1,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [
            {//PDS
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:10,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(255, 70, 131)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255,255,255)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 255, 255)'
                        }])
                    }
                },
                data: data7
            },
            {
                name:'模拟数据',
                type:'line',
                symbol: 'circle',
                symbolSize:10,
                smooth:true,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(0, 0, 0)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255,255,255)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 255, 255)'
                        }])
                    }
                },
                data: data8
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:10,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#989898'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255,255,255)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 255, 255)'
                        }])
                    }
                },
                data: data9
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:10,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#c03f18'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255,255,255)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 255, 255)'
                        }])
                    }
                },
                data: data10
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:10,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#88929a'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255,255,255)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 255, 255)'
                        }])
                    }
                },
                data: data11
            },
        ],
    };
    checkuser.setOption(option);
});