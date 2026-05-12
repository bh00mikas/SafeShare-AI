const patterns = [
  {
    type: "Email",
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/g
  },
  {
    type: "Phone",
    regex: /\b\d{10}\b/g
  },
  {
    type: "API Key",
    regex: /AIza[0-9A-Za-z\-_]{35}/g
  },
  {
    type: "Password",
    regex: /(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}/g
  }
];

function detectSensitiveData(text) {
  let matches = [];

  patterns.forEach(pattern => {
    const found = text.match(pattern.regex);

    if (found) {
      found.forEach(item => {
        matches.push({
          type: pattern.type,
          value: item
        });
      });
    }
  });

  return matches;
}