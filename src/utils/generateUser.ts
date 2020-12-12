export default function generateUser() {
  return { color: getRandomColor(), name: getRandomUsername() }
}

const usernames = [
  'Apple',
  'Apricot',
  'Avocado',
  'Banana',
  'Berry',
  'Cantaloupe',
  'Cherry',
  'Clementine',
  'Durian',
  'Grape',
  'Guava',
  'Melon',
  'Kiwi',
  'Lemon',
  'Lime',
  'Lychee',
  'Mandarin',
  'Mango',
  'Olives',
  'Orange',
  'Papaya',
  'Peach',
  'Pear',
  'Pineapple',
  'Plantain',
  'Plum',
  'Pomegranate',
  'Tangerine',
  'Watermelon',
]

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function getRandomUsername() {
  return usernames[Math.floor(Math.random() * usernames.length)]
}
