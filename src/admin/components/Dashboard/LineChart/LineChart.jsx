import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";

import { AiOutlineMinus } from "react-icons/ai";
import lineChart from "../../../configs/lineChart.js";

function LineChart() {
  const { Title, Paragraph } = Typography;

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Active Users</Title>
          <Paragraph className="lastweek">
            than last week <span className="bnb2">+30%</span>
          </Paragraph>
        </div>
        <div className="sales">
          <ul>
            <li>{<AiOutlineMinus />} Traffic</li>
            <li>{<AiOutlineMinus />} Sales</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
