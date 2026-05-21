export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!result.success) {
      return res.status(422).json({
        message: 'Validation failed',
        details: result.error.flatten()
      });
    }
    req.validated = result.data;
    return next();
  };
}
