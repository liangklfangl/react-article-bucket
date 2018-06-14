### 前言
本部分主要牵涉到前端可视化的相关问题，如果有帮助，记得star，有问题欢迎issue。

#### 1.vue-highchart多条数据线实时刷新
```js
const lineCharts = this.$refs[key][0];
//获取图表
const series = lineCharts.chart.series;
// seriesData表示获取到的数据
const acceptNew = seriesData.acceptData.data.pop();
const clickNew = seriesData.clickData.data.pop();
const cleanNew = seriesData.cleanData.data.pop();
const closeNew = seriesData.closeData.data.pop();
const arriveNew = seriesData.arriveData.data.pop();
const dateNew = seriesData.date.pop();
// 1.轮询获取每条线的最新的一个数据
this.category.push(dateNew);
// 2.x轴坐标添加一个新的元素
const newCategory = JSON.parse(JSON.stringify(this.category));
newCategory.push(dateNew);
// 3.五条折线条每条线都动态更新(addPoint第三个参数为true表示自动移除第一个元素)
// https://api.hcharts.cn/highcharts#Series.removePoint
// 最多10个点，否则移除
if (series[0].points.length >= 10) {
    series[0].addPoint(acceptNew, true, true);
    series[1].addPoint(arriveNew, true, true);
    series[2].addPoint(clickNew, true, true);
    series[3].addPoint(cleanNew, true, true);
    series[4].addPoint(closeNew, true, true);
} else {
    series[0].addPoint(acceptNew, true, false);
    series[1].addPoint(arriveNew, true, false);
    series[2].addPoint(clickNew, true, false);
    series[3].addPoint(cleanNew, true, false);
    series[4].addPoint(closeNew, true, false);
}
// 4.更新坐标轴
const xAxis = lineCharts.chart.xAxis[0];
xAxis.setCategories(newCategory);
```
动态树下:
```js
const optionFig = {};
optionFig["第一个曲线"] = {
    credits: {
        enabled: false
    },
    chart: {
        zoomType: 'x'
    },
    global: {
        useUTC: false
    },
    title: {
        text: null,
        x: -20
    },
    xAxis: {
    },
    yAxis: {
        title: {
            text: '数量'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        formatter: function() {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2);
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    }
};
optionFig['第一个曲线'].series = [series.acceptData, series.arriveData, series.clickData, series.cleanData, series.closeData],
 optionFig["第一个曲线"].xAxis.categories = series.date;
```
其中有几条线是通过series里面的值判断的，其中每一个值都是如下类型(data属性为数组):
```js
acceptData: {
        name: "已受理",
        data: acceptData
    }
```

#### 2.vue-highchart多条数据线实时刷新的结束问题
一般都是使用setInterval来完成，在组件卸载的时候清除(**一定要清除，否则即使组件卸载定时器依然在执行**):
```js
 <el-dialog title="突发全量统计" :key="showStats" :visible.sync="showStats" width="90%">
    <stats-graph :msgId="statsId" />
<\/el-dialog>
//上面是组件使用，在dialog里面用key来控制组件卸载
beforeDestroy: function() {
    clearInterval(this.timeIntervalHandler);
},
```
除了在组件卸载的时候要清除以外，建议在**3+次轮询没有新数据的情况下也要清除**，否则可能对内存占用有影响!

#### 3.vue-highchart更新横坐标问题
上面的例子每次都会把每条线的服务端的最新一条数据获取到并添加到曲线的最后，从而实现实时刷新。但是我遇到一个问题:"每次都需要把新的服务端的数据的横坐标push到一个数组中，**而且还不能移除**已经过时的那条数据的横坐标，于是导致这个数组如果在实时频率很高的情况下会非常大!"
```js
this.category.push(dateNew);
const newCategory = JSON.parse(JSON.stringify(this.category));
newCategory.push(dateNew);
```
上面这句代码会放在setInterval中，虽然能够实现效果，但是内存占用可能存在问题。目前还不知道highchart是如何解决的，后续找到原因再更新!





参考资料:

[highChart官方文档](https://api.hcharts.cn/highcharts#Series.removePoint)
