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
  showResponseMessage(err.data);

  return {
    code: err.code,
    msg: err.data.msg,
  };
};

export default {
  formattedError,
  showResponseMessage,
};
