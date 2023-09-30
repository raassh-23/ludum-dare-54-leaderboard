const {LeaderboardPayloadSchema, LeaderboardQuerySchema} = require('./schema');
const InvalidError = require('../../exceptions/InvalidError');

const LeaderboardValidator = {
  validatePayload: (payload) => {
    const validationResult = LeaderboardPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvalidError(validationResult.error.message);
    }

    return validationResult.value;
  },
  validateQuery: (query) => {
    const validationResult = LeaderboardQuerySchema.validate(query);

    if (validationResult.error) {
      throw new InvalidError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = LeaderboardValidator;
