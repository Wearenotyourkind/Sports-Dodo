import { notification } from 'antd';
import React from 'react';

const Notification = (e) => {
  notification.open({
    message: 'Notification Title',
    description: e,
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
  return <></>;
};

export default Notification;
