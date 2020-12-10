import React from 'react';
import { Modal } from 'antd';

const ModalForm = (props) => {
  const { visible, handleCancel, title, footer, children } = props;

  return (
    <Modal key="modal" visible={visible} title={title} onCancel={handleCancel} footer={footer}>
      {children}
    </Modal>
  );
};

export default ModalForm;
