import { createClient } from '@supabase/supabase-js';

// Default word list in case Supabase is not available
const DEFAULT_WORDS = [
  'apple', 'banana', 'car', 'dog', 'elephant', 'flower', 'guitar', 'house', 'ice cream',
  'jacket', 'kite', 'lion', 'mountain', 'notebook', 'ocean', 'pizza', 'queen', 'rainbow',
  'sun', 'tree', 'umbrella', 'violin', 'watermelon', 'xylophone', 'yacht', 'zebra',
  'airplane', 'beach', 'castle', 'dinosaur', 'eagle', 'forest', 'giraffe', 'hamburger',
  'igloo', 'jellyfish', 'kangaroo', 'lighthouse', 'monkey', 'night', 'octopus', 'penguin',
  'quilt', 'robot', 'snowman', 'tiger', 'unicorn', 'volcano', 'whale', 'fox',
  'yo-yo', 'zombie', 'bread', 'cheese', 'donut', 'egg', 'fish', 'grapes', 'honey',
  'ice', 'jam', 'kiwi', 'lemon', 'milk', 'nuts', 'olive', 'pear', 'rice',
  'salad', 'tomato', 'water', 'yogurt', 'bell', 'camera', 'door', 'envelope',
  'fan', 'glasses', 'hat', 'key', 'lamp', 'mirror', 'newspaper', 'pencil',
  'ring', 'scissors', 'telephone', 'watch', 'box', 'chair', 'desk', 'fence',
  'gate', 'ladder', 'table', 'window', 'bicycle', 'bus', 'helicopter', 'motorcycle',
  'rocket', 'ship', 'train', 'truck', 'bridge', 'building', 'church', 'hospital',
  'library', 'museum', 'school', 'store', 'airport', 'farm', 'park', 'playground',
  'river', 'road', 'street', 'zoo', 'cloud', 'moon', 'rain', 'snow',
  'star', 'storm', 'wind', 'fire', 'book', 'letter', 'magazine', 'map',
  'ticket', 'bird', 'cat', 'chicken', 'cow', 'duck', 'fish', 'frog',
  'horse', 'mouse', 'pig', 'rabbit', 'sheep', 'snake', 'spider', 'turkey',
  'wolf', 'bear', 'camel', 'crocodile', 'deer', 'dolphin', 'gorilla', 'panda',
  'shark', 'squirrel', 'ant', 'bee', 'butterfly', 'dragonfly', 'mosquito', 'snail',
  'doctor', 'farmer', 'firefighter', 'nurse', 'police', 'teacher', 'artist', 'chef',
  'pilot', 'sailor', 'soldier', 'waiter', 'arm', 'ear', 'eye', 'foot',
  'hand', 'heart', 'leg', 'mouth', 'nose', 'tooth', 'backpack', 'ball',
  'balloon', 'doll', 'game', 'puzzle', 'swing', 'teddy bear', 'brush', 'comb',
  'soap', 'sponge', 'toothbrush', 'towel', 'belt', 'boots', 'coat', 'dress',
  'gloves', 'pants', 'scarf', 'shirt', 'shoes', 'shorts', 'skirt', 'socks',
  'sweater', 'swimsuit', 'tie', 'basketball', 'football', 'golf', 'hockey', 'soccer',
  'tennis', 'volleyball', 'wrestling', 'birthday', 'christmas', 'halloween', 'wedding', 'drum',
  'flute', 'piano', 'trumpet', 'circle', 'rectangle', 'square', 'triangle', 'black',
  'blue', 'green', 'orange', 'pink', 'purple', 'red', 'white', 'yellow'
];

// Function to generate word list
export const generateWordList = async (): Promise<string[]> => {
  // Try to fetch words from Supabase if environment variables are available
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );
      
      const { data, error } = await supabase
        .from('words')
        .select('word')
        .limit(500);
      
      if (error) {
        console.error('Error fetching words from Supabase:', error);
        return DEFAULT_WORDS;
      }
      
      if (data && data.length > 0) {
        return data.map(item => item.word);
      }
      
      // If no words found in Supabase, use default list
      return DEFAULT_WORDS;
    } catch (error) {
      console.error('Error connecting to Supabase:', error);
      return DEFAULT_WORDS;
    }
  }
  
  // If no Supabase credentials, use default list
  return DEFAULT_WORDS;
}; 