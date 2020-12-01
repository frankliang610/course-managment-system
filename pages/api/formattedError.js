const formattedError = (err) => {
  return {
    status: err.status,
    message: err.data.message,
  };
};

export default formattedError;
