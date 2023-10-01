const Joi = require('joi');

const LeaderboardPayloadSchema = Joi.object({
  username: Joi.string().max(100).required(),
  score: Joi.number().integer().min(0).required(),
  timeMs: Joi.number().integer().min(1).required(),
  type: Joi.string().valid('desktop', 'mobile').required(),
});

const LeaderboardQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
  type: Joi.string().valid('desktop', 'mobile').default('desktop'),
});

module.exports = {
  LeaderboardPayloadSchema,
  LeaderboardQuerySchema,
};
