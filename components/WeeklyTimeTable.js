import React from 'react';
import { Table } from 'antd';
import weekday from '../utilities/constant/weekday';

const WeeklyTimeTable = ({ data }) => {
  if (!data) return <></>;

  const headers = [...weekday];
  const columns = headers.map((day, index) => {
    const courseDay = data.find((c) => c.toLowerCase().includes(day.toLowerCase())) || '';
    const courseTime = courseDay.split(' ')[1];

    return {
      title: day,
      key: index,
      align: 'center',
      render: () => courseTime,
    };
  });

  return (
    <Table
      rowKey="id"
      bordered
      size="small"
      pagination={false}
      columns={columns}
      dataSource={[{ id: 1 }]}
      onRow={() => ({
        onMouseEnter: (event) => {
          const parent = event.target.parentNode;

          Array.prototype.forEach.call(parent.childNodes, (ele) => {
            ele.style.backgroundColor = 'unset';
          });
          parent.style.backgroundColor = 'unset';
        },
      })}
    />
  );
};

export default WeeklyTimeTable;
