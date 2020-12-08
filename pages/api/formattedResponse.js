import { message } from 'antd';

const isStatusError = (code) => (code >= 200 && code < 300 ? false : true);

const showResponseMessage = (response) => {
  const isResponseError = isStatusError(response.code);

  if (!isResponseError) {
    message.success(response.msg);
  } else {
    message.error(response.msg);
  }
  return response;
};

const formattedError = (err) => {
  return {
    code: err.data.code,
    msg: err.data.msg,
    data: false,
  };
};

export default {
  formattedError,
  showResponseMessage,
};
