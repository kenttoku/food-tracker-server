const pointsTable = {
  fruits: [0, 2, 4, 6, 7, 7, 7, 0],
  vegetables: [0, 2, 4, 6, 7, 7, 7, 0],
  wholeGrains: [0, 2, 4, 5, 5, 5, 4, -1],
  leanProteins: [0, 2, 4, 5, 5, 5, 4, -1],
  nutsAndSeeds: [0, 2, 4, 5, 5, 5, 4, -1],
  dairy: [0, 1, 2, 3, 3, 2, 0, -2],
  refinedGrains: [0, -1, -2, -4, -6, -8, -10, -2],
  fattyProteins: [0, -1, -2, -4, -6, -8, -10, -2],
  sweets: [0, -2, -4, -6, -8, -10, -12, -2],
  friedFoods: [0, -2, -4, -6, -8, -10, -12, -2]
};

const combineFood = (entries) => {
  console.log(entries);
  const combinedFood = {
    fruits: 0,
    vegetables: 0,
    wholeGrains: 0,
    leanProteins: 0,
    nutsAndSeeds: 0,
    dairy: 0,
    refinedGrains: 0,
    fattyProteins: 0,
    sweets: 0,
    friedFoods: 0,
  };
  entries.forEach(entry => {
    combinedFood.fruits += entry.food.fruits;
    combinedFood.vegetables += entry.food.vegetables;
    combinedFood.wholeGrains += entry.food.wholeGrains;
    combinedFood.leanProteins += entry.food.leanProteins;
    combinedFood.nutsAndSeeds += entry.food.nutsAndSeeds;
    combinedFood.dairy += entry.food.dairy;
    combinedFood.refinedGrains += entry.food.refinedGrains;
    combinedFood.fattyProteins += entry.food.fattyProteins;
    combinedFood.sweets += entry.food.sweets;
    combinedFood.friedFoods += entry.food.friedFoods;
  });

  return combinedFood;
};

const calculatePoints = (entries) => {
  const combined = combineFood(entries);
  let points = 0;
  const categories = ['fruits', 'vegetables', 'wholeGrains', 'leanProteins', 'nutsAndSeeds', 'dairy', 'refinedGrains', 'fattyProteins', 'sweets', 'friedFoods'];
  categories.forEach(category => {
    const servings = Math.trunc(combined[category]);
    if (servings <= 6) {
      points += pointsTable[category][servings];
    } else {
      points += pointsTable[category][6] + pointsTable[category][7] * (servings - 6);
    }
  });

  return points;
};

module.exports = { combineFood, calculatePoints };