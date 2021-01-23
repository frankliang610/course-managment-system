import React, { useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highmaps';
import overviewApiCall from '../../../api-service/generalOverview';

const Distribution = ({ data, title }) => {
  const [options, setOptions] = useState({
    colorAxis: {
      min: 0,
      stops: [
        [0, '#fff'],
        [0.5, Highcharts.getOptions().colors[0]],
        [1, '#1890ff'],
      ],
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'bottom',
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  });
  const [world, setWorld] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await overviewApiCall.getWorld();

      setWorld(res?.data);
      setOptions({
        series: [{ mapData: res?.data }],
      });
    })();
  }, []);

  useEffect(() => {
    if (!data || !world) {
      return;
    }

    const mapSource = data.map((item) => {
      const target = world.features?.find(
        (feature) => item.name.toLowerCase() === feature.properties.name.toLowerCase()
      );

      return !!target
        ? {
            'hc-key': target.properties['hc-key'],
            value: item.amount,
          }
        : {};
    });
    const options = {
      title: {
        text: `<span style="text-transform: capitalize">${title
          .split(/(?=[A-Z])/)
          .join(' ')}</span>`,
      },
      series: [
        {
          data: mapSource,
          mapData: world,
          name: 'Total',
          states: {
            hover: {
              color: '#a4edba',
            },
          },
        },
      ],
    };

    setOptions(options);
  }, [data, world]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'mapChart'}
      options={options}
    ></HighchartsReact>
  );
};

export default Distribution;
