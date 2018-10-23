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

const diaries = [
  {
    userId: '000000000000000000000001',
    yyyymmdd: 20181010,
    entries: [
      { food: {
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
      } },
      { food: {
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
      } },
      { food: {
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
      } },
      { food: {
        name: 'Milk',
        fruits: 0,
        vegetables: 0,
        wholeGrains: 0,
        leanProteins: 0,
        nutsAndSeeds: 0,
        dairy: 1,
        refinedGrains: 0,
        fattyProteins: 0,
        sweets: 0,
        friedFoods: 0
      } },
    ]
  },

  {
    userId: '000000000000000000000002',
    yyyymmdd: 20181011,
    entries: [
      { food: {
        name: 'Pork',
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
      } },
      { food: {
        name: 'Chocolate',
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
      } },
      { food: {
        name: 'Beans',
        fruits: 0,
        vegetables: 1,
        wholeGrains: 0,
        leanProteins: 0,
        nutsAndSeeds: 0,
        dairy: 0,
        refinedGrains: 0,
        fattyProteins: 0,
        sweets: 0,
        friedFoods: 0
      } },
    ]
  }

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

module.exports = { food, diaries, users };