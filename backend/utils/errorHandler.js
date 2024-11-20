export const errorHandler = (res, error) => {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  };
  