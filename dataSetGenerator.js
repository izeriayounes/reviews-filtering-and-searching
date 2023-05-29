import { createPool } from 'mysql2/promise';
import faker from 'faker';

// Create a MySQL connection pool
const pool = createPool({
  host: 'localhost',
  user: 'izeria',
  password: '0000',
  database: 'internship',
});

// Generate a random dataset using Faker.js
const generateDataset = async (rowCount) => {
  const dataset = [];

  for (let i = 0; i < rowCount; i++) {
    const review = {
      id: i + 1,
      appID: faker.random.uuid(),
      appStoreName: faker.random.arrayElement(['iOS', 'Android']),
      reviewDate: faker.date.past(),
      rating: faker.random.number({ min: 1, max: 5 }),
      version: `v${faker.random.number({ min: 0, max: 9 })}.${faker.random.number({ min: 0, max: 9 })}`,
      countryName: faker.address.country(),
      reviewHeading: faker.lorem.words(2),
      reviewText: faker.lorem.sentence(),
      reviewUserName: faker.internet.userName(),
    };

    dataset.push(review);
  }

  return dataset;
};

// Insert the dataset into the database
const insertDataset = async (dataset) => {
  const values = dataset.map((review) => [
    review.id,
    review.appID,
    review.appStoreName,
    review.reviewDate,
    review.rating,
    review.version,
    review.countryName,
    review.reviewHeading,
    review.reviewText,
    review.reviewUserName,
  ]);

  try {
    await pool.query('INSERT INTO reviews (id, appID, appStoreName, reviewDate, rating, version, countryName, reviewHeading, reviewText, reviewUserName) VALUES ?', [values]);
    console.log('Dataset inserted successfully');
  } catch (error) {
    console.error('Error inserting dataset:', error);
  }
};

// Generate and insert the dataset
const rowCount = 1000; // Number of rows to generate
generateDataset(rowCount)
  .then(insertDataset)
  .catch((error) => console.error('Error generating dataset:', error));