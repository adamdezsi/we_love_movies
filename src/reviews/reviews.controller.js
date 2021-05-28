const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { as } = require("../db/connection");

async function reviewExists(req, res, next) {
  const foundReview = await service.read(req.params.reviewId);
  if (foundReview) {
    res.locals.review = foundReview;
    return next();
  }
  return next({
    status: 404,
    message: `Review cannot be found.`,
  });
}

async function destroy(req, res, next) {
  await service.delete(res.locals.review.review_id);
  res.sendStatus(204).json("?");
}

async function list(req, res, next) {
  const result = await service.list(req.params.movieId);
  res.json({ result });
}

async function update(req, res, next) {
  const { reviewId } = req.params;
  res.json({ data: await service.update(reviewId) });
}

module.exports = {
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  list: asyncErrorBoundary(list),
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
