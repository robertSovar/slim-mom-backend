function handleError(error, context = "") {
  const errorMessage = context ? `${context}: ${error}` : error;
  throw new Error(errorMessage);
}

export default handleError;
