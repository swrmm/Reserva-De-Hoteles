const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '10', 10), 1), 50);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const buildPaginatedResponse = (rows, count, { page, limit }) => ({
  data: rows,
  pagination: {
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit),
  },
});

module.exports = {
  parsePagination,
  buildPaginatedResponse,
};
