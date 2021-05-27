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
    status: 400,
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
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const result = await service.update(updatedReview);
  res.json({ result });
}

module.exports = {
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  list: asyncErrorBoundary(list),
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
