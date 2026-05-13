const mongoose = require('mongoose');
require('dotenv').config({ path: 'e:/MIS/V/3/interno/backend/.env' });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected');
  const collection = mongoose.connection.collection('internships');
  const valid = ['Frontend Development', 'Backend Development', 'Database Development'];
  const res = await collection.updateMany(
    { category: { $nin: valid } },
    { $set: { category: 'Frontend Development' } }
  );
  console.log('Migrated old categories:', res.modifiedCount);
  process.exit(0);
}).catch(console.error);
