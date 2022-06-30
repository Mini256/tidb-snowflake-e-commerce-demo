import EChartsReact, { EChartsOption, EChartsReactProps } from "echarts-for-react";
import { useEffect, useState } from "react";

export interface PieChartProps {
    data: any;
}

export default function PieChart(props: PieChartProps) {
    const { data } = props;
    const [pieChartOption, setPieChartOption] = useState<EChartsOption>({});

    useEffect(() => {
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: '1%',
          left: 'center'
        },
        series: [
          {
            name: 'Item Type',
            type: 'pie',
            radius: ['30%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      };
      setPieChartOption(option);
    }, [data]);

    return <EChartsReact
      option={pieChartOption}
      notMerge={true}
      lazyUpdate={true}
    />
}