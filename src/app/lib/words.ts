// Default word list for the game

export const DEFAULT_WORDS = [
  // Animals
  'cat', 'dog', 'elephant', 'giraffe', 'lion', 'tiger', 'zebra', 'monkey', 'penguin', 'kangaroo',
  'crocodile', 'dolphin', 'shark', 'whale', 'octopus', 'butterfly', 'spider', 'bee', 'ant', 'turtle',
  
  // Food and Drink
  'pizza', 'hamburger', 'spaghetti', 'ice cream', 'chocolate', 'cake', 'cookie', 'sandwich', 'taco',
  'sushi', 'coffee', 'tea', 'milk', 'water', 'juice', 'soda', 'apple', 'banana', 'orange', 'grapes',
  
  // Objects
  'chair', 'table', 'bed', 'door', 'window', 'television', 'computer', 'phone', 'book', 'pen',
  'pencil', 'scissors', 'watch', 'clock', 'umbrella', 'hat', 'glasses', 'car', 'bicycle', 'train',
  
  // Places
  'beach', 'mountain', 'forest', 'city', 'house', 'school', 'hospital', 'airport', 'park', 'zoo',
  'museum', 'library', 'restaurant', 'cinema', 'hotel', 'farm', 'castle', 'church', 'temple', 'island',
  
  // Actions
  'running', 'jumping', 'swimming', 'dancing', 'singing', 'eating', 'sleeping', 'laughing', 'crying',
  'cooking', 'reading', 'writing', 'drawing', 'painting', 'fishing', 'skiing', 'surfing', 'climbing', 'flying',
  
  // Nature
  'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'fire', 'water', 'earth',
  'flower', 'tree', 'grass', 'leaf', 'river', 'lake', 'ocean', 'mountain', 'waterfall', 'rainbow',
  
  // Clothing
  'shirt', 'pants', 'shoes', 'socks', 'hat', 'jacket', 'coat', 'dress', 'skirt', 'suit',
  'gloves', 'scarf', 'sunglasses', 'belt', 'boots', 'sandals', 'swimsuit', 'tie', 'pocket', 'button',
  
  // Sports
  'soccer', 'basketball', 'football', 'baseball', 'tennis', 'golf', 'hockey', 'volleyball', 'bowling',
  'swimming', 'skiing', 'skateboarding', 'surfing', 'boxing', 'wrestling', 'cycling', 'running', 'sailing',
  
  // Jobs
  'doctor', 'nurse', 'teacher', 'student', 'police', 'firefighter', 'chef', 'pilot', 'driver',
  'artist', 'musician', 'actor', 'dancer', 'writer', 'scientist', 'engineer', 'farmer', 'plumber',
  
  // Holidays
  'christmas', 'halloween', 'thanksgiving', 'birthday', 'wedding', 'valentine', 'new year', 'easter', 'carnival',
  
  // Misc
  'money', 'time', 'love', 'family', 'friend', 'music', 'movie', 'game', 'toy', 'party',
  'robot', 'alien', 'ghost', 'zombie', 'pirate', 'cowboy', 'ninja', 'superhero', 'wizard', 'princess'
];

// Function to get random words from the list
export function getRandomWords(count: number, excludeWords: string[] = []): string[] {
  const filteredWords = DEFAULT_WORDS.filter(word => !excludeWords.includes(word));
  const shuffled = [...filteredWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to validate custom words (removing duplicates, empty words, etc)
export function validateCustomWords(customWordsInput: string): string[] {
  if (!customWordsInput.trim()) return [];
  
  return customWordsInput
    .split(',')
    .map(word => word.trim().toLowerCase())
    .filter(word => word.length > 0 && word.length <= 30)
    .filter((word, index, self) => self.indexOf(word) === index); // Remove duplicates
} 