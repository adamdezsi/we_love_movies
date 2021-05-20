const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  const data = await service.list(req.query.is_showing);
  res.json({ data });
}

async function read(req, res, next) {
  const { movieId } = req.params;
  const response = await service.read(movieId);
  if (response.length === 0) {
    next({ status: 404, message: "Movie cannot be found." });
  } else {
    const reply = "yes";
    res.json({ data: response[0] });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: asyncErrorBoundary(read),
};