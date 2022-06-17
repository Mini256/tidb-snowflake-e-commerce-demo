import EChartsReact, {
  EChartsOption,
  EChartsReactProps,
} from "echarts-for-react";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

import { useHttpClient } from "../../lib";

export default function LineChart(props: any) {
  const [pieChartOption, setPieChartOption] = useState<EChartsOption>({});

  const [lastTs, setLastTs] = useState<number>(0);
  const [check, setCheck] = useState(0);
  const [data, setData] = useState<any[]>([]);

  const [httpClient, endpoint] = useHttpClient();

  const loadTodayOrderHistory = async function () {
    const url = `/api/statistic/orders/total-and-amount/history`;
    const res = await httpClient.get(url);
    const n = res.data.length;
    const history = res.data.map((item: any, index: number) => {
      const ts = new Date(item.ts);
      if (index === n - 1) {
        console.log("setLastTs", Number(ts));
        setLastTs(Number(ts) / 1000);
      }
      return {
        name: ts.toString(),
        value: [ts, item.total],
      };
    });
    setData(history);
  };

  useEffect(() => {
    loadTodayOrderHistory();
  }, [endpoint]);

  useEffect(() => {
    const id = setInterval(() => {
      loadTodayOrderHistory();
      setCheck(check + 1);
    }, 10 * 1000);
    return () => clearInterval(id);
  }, [check, endpoint]);

  useEffect(() => {
    const option: EChartsOption = {
      title: {
        text: "Today Orders",
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params: any) {
          params = params[0];
          var date = new Date(params.name);
          return (
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear() +
            " : " +
            params.value[1]
          );
        },
        axisPointer: {
          animation: false,
        },
      },
      xAxis: {
        type: "time",
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: "orders",
          type: "line",
          showSymbol: false,
          data: data,
        },
      ],
    };
    setPieChartOption(option);
  }, [data, endpoint]);

  return (
    <EChartsReact
      style={{
        height: "500px",
      }}
      option={pieChartOption}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
