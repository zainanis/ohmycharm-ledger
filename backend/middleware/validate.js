/**
 * Returns middleware that validates req.body against a schema.
 * Schema shape: { fieldName: { required?, type?, enum? } }
 * On failure responds with 400 { errors: [{ field, message }] }
 */
const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];
    const isEmpty = value === undefined || value === null || value === "";

    if (rules.required && isEmpty) {
      errors.push({ field, message: `${field} is required` });
      continue;
    }

    if (!isEmpty) {
      if (rules.type && typeof value !== rules.type) {
        errors.push({ field, message: `${field} must be a ${rules.type}` });
      }
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({ field, message: `${field} must be one of: ${rules.enum.join(", ")}` });
      }
      if (rules.min !== undefined && value < rules.min) {
        errors.push({ field, message: `${field} must be at least ${rules.min}` });
      }
    }
  }

  if (errors.length > 0) return res.status(400).json({ errors });
  next();
};

module.exports = validate;
