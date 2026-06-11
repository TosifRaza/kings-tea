const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message: message
  };

  if (data !== undefined && data !== null) {
    if (typeof data === 'object' && data !== null && data.docs !== undefined) {
      response.data = data.docs;
      response.pagination = {
        total: data.total,
        page: data.page,
        limit: data.limit,
        pages: data.totalPages
      };
    } else {
      response.data = data;
    }
  }

  return res.status(statusCode).json(response);
};

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = {
  successResponse,
  errorResponse
};
