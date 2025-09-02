const parseAnswers = (answerRaw: unknown): string[] => {
  let answers: string[] = [];

  if (!answerRaw) {
    return answers;
  }

  if (Array.isArray(answerRaw)) {
    answers = answerRaw.map(String);
  } else if (typeof answerRaw === "string") {
    try {
      const parsed = JSON.parse(answerRaw);
      if (Array.isArray(parsed)) {
        answers = parsed.map(String);
      } else {
        throw new Error("Parsed value is not an array");
      }
    } catch {
      throw new Error("Invalid answer format, must be JSON array or string[]");
    }
  } else {
    throw new Error("Invalid answer type, must be array or string");
  }

  return answers;
};
export default parseAnswers;
