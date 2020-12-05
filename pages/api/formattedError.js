const formattedError = (err) => {
  return {
    status: err.status,
    message: err.data.msg,
  };
};

export default formattedError;
