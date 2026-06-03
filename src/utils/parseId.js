function parseId(idParam) {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

module.exports = parseId;
