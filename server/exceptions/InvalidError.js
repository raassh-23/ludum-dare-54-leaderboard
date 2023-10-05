const ClientError = require('./ClientError');

class InvalidError extends ClientError {
  constructor(message) {
    super(message, 400);
    this.name = 'InvalidError';
  }
}

module.exports = InvalidError;
