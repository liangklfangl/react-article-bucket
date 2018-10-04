#### 1.折线图横坐标是日期的情况
出现了一种特殊的情况，tooltip和横坐标的日期对不上，[采用下面的方式即可](https://antv.alipay.com/zh-cn/g2/3.x/tutorial/data-type-and-scale.html#_time)。
```js
 const Line = createG2(chart => {
      //   调整坐标轴位置,不显示alias
      chart.tooltip({
        crosshairs: {
          type: 'cross'
        }
      });
      chart.source(data, {
        category: {
          type: 'time',
          alias: ' '
          // 去掉横坐标，同时设置类型为time
        }
      });
      chart.legend({
        position: 'bottom',
        itemGap: 10,
        itemMarginBottom: 140
      });
      chart.axis('category', {
        label: {
          formatter: function formatter(val) {
            return val;
          }
        }
      });
      const colors = this.generateRandomColor(this.state.linechartIndicator.length);
      for (let t = 0, len = this.state.linechartIndicator.length; t < len; t++) {
        const key = this.state.linechartIndicator[t];
        chart
          .line()
          .position(`category*${key}`)
          .color(colors[t]);
        chart.col(key, {
          alias: statTotalLabelMap[key]
        });
        chart.axis(key, {
          formatter: val => {
            const formatted = val.replace(REGEX, ',');
            return formatted;
          }
        });
      }
      chart.render();
    });
```
