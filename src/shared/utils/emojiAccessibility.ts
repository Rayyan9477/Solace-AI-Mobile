export const getEmojiLabel = (emoji) => {
  const map = {
    "😊": "smiling face",
    "😢": "crying face",
    "😡": "angry face",
  };
  return map[emoji] || "emoji";
};

export const EmojiA11y = {
  getEmojiLabel,
};
