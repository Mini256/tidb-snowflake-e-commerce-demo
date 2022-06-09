import EChartsReact, { EChartsOption, EChartsReactProps } from "echarts-for-react";
import { useEffect, useState } from "react";

export interface LineChartProps {
    data: any;
}

export default function LineChart(props: LineChartProps) {
    const { data } = props;
    const [pieChartOption, setPieChartOption] = useState<EChartsOption>({});

    useEffect(() => {
      const option:EChartsOption = {
        title: {
          text: 'Today Orders'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params: any) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getDate() +
              '/' +
              (date.getMonth() + 1) +
              '/' +
              date.getFullYear() +
              ' : ' +
              params.value[1]
            );
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: 'orders',
            type: 'line',
            showSymbol: false,
            data: data
          }
        ]
      };
      setPieChartOption(option);
    }, [data]);

    return <EChartsReact
      style={{
        height: '500px'
      }}
      option={pieChartOption}
      notMerge={true}
      lazyUpdate={true}
    />
}