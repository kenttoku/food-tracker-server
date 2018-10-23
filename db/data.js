const food = [
  {
    userId: '000000000000000000000001',
    name: 'Banana',
    fruits: 1,
    vegetables: 0,
    wholeGrains: 0,
    leanProteins: 0,
    nutsAndSeeds: 0,
    dairy: 0,
    refinedGrains: 0,
    fattyProteins: 0,
    sweets: 0,
    friedFoods: 0
  },
  {
    userId: '000000000000000000000002',
    name: 'Banana',
    fruits: 1,
    vegetables: 0,
    wholeGrains: 0,
    leanProteins: 0,
    nutsAndSeeds: 0,
    dairy: 0,
    refinedGrains: 0,
    fattyProteins: 0,
    sweets: 0,
    friedFoods: 0
  }, {
    userId: '000000000000000000000001',
    name: 'Chicken',
    fruits: 0,
    vegetables: 0,
    wholeGrains: 0,
    leanProteins: 1,
    nutsAndSeeds: 0,
    dairy: 0,
    refinedGrains: 0,
    fattyProteins: 0,
    sweets: 0,
    friedFoods: 0
  },
  {
    userId: '000000000000000000000002',
    name: 'Chicken',
    fruits: 0,
    vegetables: 0,
    wholeGrains: 0,
    leanProteins: 1,
    nutsAndSeeds: 0,
    dairy: 0,
    refinedGrains: 0,
    fattyProteins: 0,
    sweets: 0,
    friedFoods: 0
  }, {
    userId: '000000000000000000000001',
    name: 'Candy',
    fruits: 0,
    vegetables: 0,
    wholeGrains: 0,
    leanProteins: 0,
    nutsAndSeeds: 0,
    dairy: 0,
    refinedGrains: 0,
    fattyProteins: 0,
    sweets: 1,
    friedFoods: 0
  },
  {
    userId: '000000000000000000000002',
    name: 'Milk',
    fruits: 1,
    vegetables: 0,
    wholeGrains: 0,
    leanProteins: 0,
    nutsAndSeeds: 0,
    dairy: 1,
    refinedGrains: 0,
    fattyProteins: 0,
    sweets: 0,
    friedFoods: 0
  },
];


const users = [
  {
    _id: '000000000000000000000001',
    username: 'testuser1',
    // hash for "password"
    password: '$2a$10$QJCIX42iD5QMxLRgHHBJre2rH6c6nI24UysmSYtkmeFv6X8uS1kgi'
  },
  {
    _id: '000000000000000000000002',
    username: 'testuser2',
    // hash for "password"
    password: '$2a$10$QJCIX42iD5QMxLRgHHBJre2rH6c6nI24UysmSYtkmeFv6X8uS1kgi'
  }
];

module.exports = { food, users };