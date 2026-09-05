import mongoose from 'mongoose';

export function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid ObjectId format: ${id}` }
      });
    }
    next();
  };
}

export function validateRequiredFields(fields = []) {
  return (req, res, next) => {
    const missing = fields.filter(f => req.body[f] === undefined || req.body[f] === null || req.body[f] === '');
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: `Missing required body fields: ${missing.join(', ')}` }
      });
    }
    next();
  };
}
