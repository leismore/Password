type Password = {
  hashed:     string,        // Hashed password
  generated:  number,        // Unix timestamp (milliseconds)
  expiry:     (number|null)  // Unix timestamp (milliseconds)
};

export { Password };
