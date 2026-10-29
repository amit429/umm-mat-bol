// Word decks. Deck A ("Kaisa?") holds describing words, deck B ("Kya?") holds things.
// The fun comes from odd combos: "Nervous Samosa", "Haunted Pressure Cooker".
// Words in FAMILY_UNSAFE are dropped when the Family-safe switch is on.

export type PackId = 'classic' | 'desi' | 'bollywood'

export interface Pack {
  id: PackId
  name: string
  blurb: string
  example: string
}

export const PACKS: Pack[] = [
  { id: 'classic', name: 'Classic', blurb: 'Everyday words, weird combos', example: 'Wobbly Hamster' },
  { id: 'desi', name: 'Desi Tadka', blurb: 'Chai, chappals and aunties', example: 'Nervous Samosa' },
  { id: 'bollywood', name: 'Bollywood', blurb: 'Filmy, dramatic, slow-motion', example: 'Overacting Villain' },
]

export const KAISA: Record<PackId, string[]> = {
  classic: [
    'Wobbly', 'Sticky', 'Sleepy', 'Angry', 'Lonely', 'Shy', 'Royal', 'Spicy', 'Haunted', 'Sweaty',
    'Grumpy', 'Fluffy', 'Invisible', 'Confused', 'Jealous', 'Flying', 'Frozen', 'Hairy', 'Crispy', 'Soggy',
    'Tiny', 'Giant', 'Bald', 'Rich', 'Broke', 'Lazy', 'Hyper', 'Sneaky', 'Smelly', 'Shiny',
    'Rusty', 'Muddy', 'Glittery', 'Electric', 'Melting', 'Screaming', 'Whispering', 'Singing', 'Crying', 'Laughing',
    'Burping', 'Sneezing', 'Snoring', 'Famous', 'Fake', 'Viral', 'Retired', 'Teenage', 'Newborn', 'Ancient',
    'Vintage', 'Overconfident', 'Underpaid', 'Unemployed', 'Vegetarian', 'Organic', 'Fried', 'Steamed', 'Sour', 'Bitter',
    'Salty', 'Stale', 'Leaking', 'Exploding', 'Upside-down', 'Backwards', 'Inflatable', 'Magnetic', 'Wooden', 'Plastic',
    'Golden', 'Chocolate', 'Moody', 'Bossy', 'Clingy', 'Savage', 'Cringe', 'Wholesome', 'Sassy', 'Petty',
    'Chill', 'Hangry', 'Ticklish', 'Itchy', 'Bouncy', 'Squeaky', 'Crunchy', 'Slimy', 'Fuzzy', 'Prickly',
    'Polite', 'Rude', 'Sarcastic', 'Romantic', 'Heartbroken', 'Lovesick', 'Homesick', 'Seasick', 'Jet-lagged', 'Sunburnt',
    'Caffeinated', 'Sleepwalking', 'Moonwalking', 'Breakdancing', 'Meditating', 'Gossiping', 'Bargaining', 'Honking', 'Underrated', 'Overpriced',
    'Discounted', 'Second-hand', 'Brand-new', 'Limited-edition', 'Handmade', 'Remote-controlled', 'Solar-powered', 'Battery-operated', 'Wi-Fi', 'Haunted',
    'Pregnant', 'Bearded', 'Tattooed', 'Muscular', 'Skinny', 'Chubby', 'Wrinkly', 'Hairless', 'Toothless', 'One-eyed',
    'Three-legged', 'Two-faced', 'Left-handed', 'Barefoot', 'Naked', 'Sweaty', 'Shivering', 'Panicking', 'Dizzy', 'Hiccuping',
    'Stuttering', 'Yawning', 'Juggling', 'Skating', 'Swimming', 'Parachuting', 'Hitchhiking', 'Lost', 'Stuck', 'Kidnapped',
    'Undercover', 'Secret', 'Illegal', 'Forbidden', 'Cursed', 'Blessed', 'Lucky', 'Unlucky', 'Suspicious', 'Innocent',
    'Guilty', 'Spoilt', 'Pampered', 'Neglected', 'Adopted', 'Robotic', 'Mechanical', 'Digital', 'Ugly', 'Gorgeous',
    'Dusty', 'Greasy', 'Oily', 'Juicy', 'Stinky', 'Fragrant', 'Hot', 'Freezing', 'Wet', 'Soaked',
    'Bulletproof', 'Waterproof', 'Fireproof', 'Expired', 'Imported', 'Duplicate', 'Pirated', 'Haunted', 'Talking', 'Dancing',
    'Nervous', 'Dramatic', 'Emotional', 'Honest', 'Lying', 'Cheating', 'Competitive', 'Clumsy', 'Forgetful', 'Hungry',
  ],
  desi: [
    'Nervous', 'Dancing', 'Filmy', 'Desi', 'Sanskari', 'Jugaadu', 'Kanjoos', 'Bindaas', 'Natkhat', 'Chatpata',
    'Bhukkad', 'Nautanki', 'Chamkila', 'Phataka', 'Masaledaar', 'Gharelu', 'Fattu', 'Jhakaas', 'Pagal', 'Tharki',
    'Overprotective', 'Gossiping', 'NRI', 'Engineering', 'Startup', 'Unpaid-intern', 'Topper', 'Backbencher', 'Monsoon', 'Diwali',
    'Holi-coloured', 'Wedding', 'Mehendi', 'Haldi-covered', 'Tiffin', 'Railway', 'Local-train', 'Jugaad', 'Cricket-crazy', 'Bargaining',
    'Spicy', 'Ghee-soaked', 'Butter-chicken', 'Tandoori', 'Masala', 'Pressure-cooked', 'Deep-fried', 'Overcooked', 'Leftover', 'Homemade',
    'Mumbai', 'Delhi', 'Puneri', 'Bengali', 'Punjabi', 'South-Indian', 'Hostel', 'Canteen', 'Government', 'Sarkari',
    'Rickshaw', 'Horn-OK-Please', 'Overloaded', 'Traffic-jammed', 'Pothole', 'Speed-breaker', 'Late', 'Indian-Standard-Time', 'Power-cut', 'Load-shedding',
    'Joint-family', 'Arranged', 'Love-marriage', 'Rishta', 'Shaadi', 'Sangeet', 'Baraati', 'Dahi-handi', 'Ganpati', 'Navratri',
    'Garba', 'Bhangra', 'Bhajan', 'Aarti', 'Agarbatti', 'Turmeric', 'Coconut', 'Mango', 'Paneer', 'Pickled',
    'Sticky-jaggery', 'Chai-addicted', 'Filter-coffee', 'Maggi-loving', 'WhatsApp-forwarding', 'Good-morning-message', 'Ludo-playing', 'Antakshari', 'Serial-watching', 'Saas-bahu',
  ],
  bollywood: [
    'Overacting', 'Slow-motion', 'Filmy', 'Heroic', 'Villainous', 'Long-lost', 'Background', 'Dubbed', 'Flop', 'Superhit',
    'Blockbuster', 'Typecast', 'Method-acting', 'Award-winning', 'Paparazzi-chased', 'Rain-dancing', 'Mustachioed', 'Twin', 'Double-role', 'Item-song',
    'Dream-sequence', 'Interval', 'Climax', 'Sequel', 'Remake', 'Stunt', 'Lip-syncing', 'Dialogue-baazi', 'Angry-young', 'Tragic',
    'Comedy', 'Romantic', 'Swiss-Alps', 'Chiffon-saree', 'Leather-jacket', 'Sunglasses-at-night', 'Wind-machine', 'Exploding-car', 'Flying-kick', 'Shirtless',
    'Smuggling', 'Gangster', 'Undercover-cop', 'Rich-father', 'Poor-hero', 'Crying-mother', 'Evil-stepmother', 'Lost-at-mela', 'Amnesia', 'Reincarnated',
  ],
}

export const KYA: Record<PackId, string[]> = {
  classic: [
    'Hamster', 'Toaster', 'Pig', 'Whip', 'Elephant', 'Laptop', 'Ghost', 'Dinosaur', 'Penguin', 'Giraffe',
    'Pigeon', 'Peacock', 'Monkey', 'Lizard', 'Cockroach', 'Mosquito', 'Crocodile', 'Camel', 'Donkey', 'Goat',
    'Parrot', 'Owl', 'Octopus', 'Shark', 'Unicorn', 'Dragon', 'Robot', 'Alien', 'Zombie', 'Vampire',
    'Superhero', 'Astronaut', 'Pirate', 'Ninja', 'Wizard', 'Mermaid', 'Yeti', 'Teacher', 'Principal', 'Dentist',
    'Barber', 'Influencer', 'YouTuber', 'Politician', 'Cricketer', 'Umpire', 'Goalkeeper', 'Grandma', 'Grandpa', 'Baby',
    'Toddler', 'Neighbour', 'Landlord', 'Boss', 'Intern', 'Bride', 'Groom', 'Umbrella', 'Toothbrush', 'Pillow',
    'Blanket', 'Mirror', 'Fridge', 'Ceiling fan', 'Remote', 'Selfie stick', 'Suitcase', 'Lunchbox', 'Bucket', 'Mug',
    'Broom', 'Mop', 'Bicycle', 'Scooter', 'Tractor', 'Truck', 'Train', 'Helicopter', 'Submarine', 'Rocket',
    'Boat', 'Bus', 'Ambulance', 'Escalator', 'Lift', 'Traffic light', 'Balloon', 'Trophy', 'Crown', 'Wig',
    'Moustache', 'Beard', 'Sunglasses', 'Sock', 'Sneaker', 'Handbag', 'Wallet', 'Passport', 'Coin', 'ATM',
    'Group chat', 'Password', 'Wi-Fi router', 'Charger', 'Power bank', 'Headphones', 'Exam', 'Report card', 'Homework', 'Meeting',
    'Video call', 'Traffic jam', 'Earthquake', 'Tornado', 'Volcano', 'Rainbow', 'Cloud', 'Moon', 'Football', 'Gym',
    'Treadmill', 'Yoga mat', 'Dumbbell', 'Protein shake', 'Hospital', 'Injection', 'Bandage', 'Thermometer', 'Toothpaste', 'Shampoo',
    'Deodorant', 'Perfume', 'Spoon', 'Chopsticks', 'Straw', 'Pizza', 'Burger', 'Noodles', 'Popcorn', 'Banana',
    'Onion', 'Potato', 'Watermelon', 'Ice cream', 'Cake', 'Sandwich', 'Omelette', 'Sausage', 'Carrot', 'Pineapple',
    'Snowman', 'Scarecrow', 'Clown', 'Magician', 'Mime', 'Lifeguard', 'Firefighter', 'Plumber', 'Electrician', 'Chef',
    'Waiter', 'Pilot', 'Air hostess', 'Detective', 'Spy', 'Thief', 'Judge', 'Lawyer', 'Doctor', 'Nurse',
    'Scientist', 'Professor', 'Librarian', 'Postman', 'Delivery boy', 'Security guard', 'Bodybuilder', 'Ballerina', 'Opera singer', 'Rapper',
    'DJ', 'Drummer', 'Guitar', 'Piano', 'Trumpet', 'Microphone', 'Camera', 'Drone', 'Calculator', 'Printer',
    'Keyboard', 'Mouse', 'Smartphone', 'Smartwatch', 'Alarm clock', 'Calendar', 'Map', 'Compass', 'Telescope', 'Magnifying glass',
    'Ladder', 'Hammer', 'Screwdriver', 'Tape', 'Glue', 'Scissors', 'Stapler', 'Paperclip', 'Envelope', 'Stamp',
    'Sofa', 'Bed', 'Chair', 'Table', 'Door', 'Window', 'Curtain', 'Carpet', 'Bathtub', 'Toilet',
    'Washing machine', 'Vacuum cleaner', 'Microwave', 'Kettle', 'Frying pan', 'Teapot', 'Candle', 'Torch', 'Battery', 'Light bulb',
    'Kangaroo', 'Koala', 'Panda', 'Sloth', 'Snail', 'Turtle', 'Frog', 'Butterfly', 'Bee', 'Spider',
    'Duck', 'Chicken', 'Rooster', 'Horse', 'Zebra', 'Lion', 'Tiger', 'Bear', 'Wolf', 'Fox',
  ],
  desi: [
    'Samosa', 'Rickshaw', 'Pressure cooker', 'Jalebi', 'Mango', 'Chappal', 'Auntie', 'Uncle', 'Chaiwala', 'Watchman',
    'Auto driver', 'Pandit', 'Wedding planner', 'Mother-in-law', 'Dosa', 'Idli', 'Vada pav', 'Pani puri', 'Biryani', 'Paneer',
    'Gulab jamun', 'Ladoo', 'Pakora', 'Maggi', 'Chai', 'Lassi', 'Momos', 'Paratha', 'Pickle', 'Papad',
    'Chutney', 'Rasgulla', 'Kulfi', 'Coconut', 'Brinjal', 'Karela', 'Green chilli', 'Lemon', 'Khichdi', 'Poha',
    'Upma', 'Misal pav', 'Modak', 'Puran poli', 'Bhel', 'Dhokla', 'Thepla', 'Rajma chawal', 'Chole bhature', 'Butter chicken',
    'Cooler', 'Mixer grinder', 'Geyser', 'Tiffin box', 'Steel glass', 'Thali', 'Tawa', 'Kadhai', 'Belan', 'Gas cylinder',
    'Speed breaker', 'Pothole', 'Toll booth', 'Temple bell', 'Diya', 'Rangoli', 'Kite', 'Firecracker', 'Pichkari', 'Saree',
    'Kurta', 'Lungi', 'Dupatta', 'Turban', 'Bindi', 'Mangalsutra', 'Bangles', 'Jhumka', 'Mehendi', 'Aadhaar card',
    'Ration card', 'Local train', 'Dabbawala', 'Cricket bat', 'Carrom board', 'Ludo', 'Antakshari', 'TV serial', 'Saas-bahu serial', 'Wedding',
    'Sangeet', 'Baraat', 'Ghodi', 'Band baaja', 'Tuition', 'Hostel', 'Canteen', 'Hair oil', 'Talcum powder', 'Mosquito coil',
    'Coconut oil', 'Agarbatti', 'Nimbu-mirchi', 'Cow', 'Buffalo', 'Street dog', 'Peacock', 'Langur', 'Elephant', 'Tempo',
    'Bullet bike', 'Matka', 'Charpai', 'Hand pump', 'Water tanker', 'Paan', 'Supari', 'Gutka wrapper', 'Railway platform', 'Ticket checker',
    'Traffic police', 'Sarpanch', 'MLA', 'Babu', 'Peon', 'Sabziwala', 'Kirana store', 'Medical store', 'Xerox shop', 'Chaat stall',
    'Ganpati', 'Dandiya stick', 'Dhol', 'Shehnai', 'Harmonium', 'Tabla', 'Sitar', 'Rakhi', 'Holi colour', 'Diwali sweets',
  ],
  bollywood: [
    'Hero', 'Villain', 'Item song', 'Dream sequence', 'Background dancer', 'Interval', 'Climax', 'Sequel', 'Remake', 'Stunt double',
    'Filmy maa', 'Double role', 'Lost twins', 'Rain song', 'Love triangle', 'Comedian uncle', 'Rich father', 'Superstar', 'Award show', 'Box office',
    'Trailer', 'Cinema hall', 'Fan club', 'Autograph', 'Paparazzi', 'Director', 'Producer', 'Spot boy', 'Makeup artist', 'Choreographer',
    'Wind machine', 'Smoke machine', 'Slow-motion walk', 'Dialogue', 'Punchline', 'Plot twist', 'Flashback', 'Mela', 'Haveli', 'Train scene',
    'Gangster', 'Inspector', 'Smuggler', 'Don', 'Henchman', 'Tawaif', 'Thakur', 'Mausi', 'Best friend', 'Bodyguard',
  ],
}

// A few words that make a combo less family-friendly.
export const FAMILY_UNSAFE = new Set([
  'Naked', 'Pregnant', 'Tharki', 'Illegal', 'Kidnapped', 'Smuggling', 'Tawaif', 'Gutka wrapper', 'Divorced', 'Shirtless', 'Toilet',
])
