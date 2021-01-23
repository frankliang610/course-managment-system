import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { uniq } from 'lodash';
import { skillsLevel } from '../../../utilities/constant/skillsLevel';

const BarChart = ({ data }) => {
  const [options, setOptions] = useState({
    chart: {
      type: 'column',
    },
    title: {
      text: 'Student VS Teacher',
    },
    subtitle: {
      text: 'Comparing what students are interested in and teachers’ skills',
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Interested VS Skills',
      },
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        return this.series.name === 'Interest'
          ? `${this.series.name}: ${this.y}`
          : `<b>${this.x}</b><br/>${this.series.name}: ${this.y}<br/>total: ${this.point.stackTotal}`;
      },
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
        },
      },
    },
    exporting: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data || Object.values(data).some((item) => !item)) {
      return;
    }

    const { interest, teacher } = data;
    const xCategories = uniq([...interest.map(({ name }) => name), ...Object.keys(teacher)]);
    const interestItem = xCategories.reduce(
      (acc, language) => {
        const target = interest.find((item) => item.name === language);

        acc.data.push(target ? target.amount : 0);
        return acc;
      },
      { name: 'Interest', stack: 'interest', data: [] }
    );
    const levels = uniq(
      Object.values(teacher)
        .flat()
        .map((item) => item.level)
    ).sort();
    const teacherBar = levels.map((level) => ({
      name: skillsLevel[level],
      data: xCategories.map(
        (lan) => teacher[lan]?.find((item) => item.level === level)?.amount || 0
      ),
      stack: 'teacher',
    }));

    setOptions({
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
        categories: xCategories,
      },
      series: [...teacherBar, interestItem],
    });
  }, [data]);

  return <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>;
};

export default BarChart;
