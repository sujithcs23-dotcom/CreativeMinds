import app from '../server/app.js';
import { connectDB } from '../server/config/dbConnect.js';
import { seedDatabase } from '../server/seed/seedDb.js';

let isDbInitialized = false;

export default async function handler(req, res) {
  if (!isDbInitialized) {
    const dbSuccess = await connectDB();
    if (dbSuccess) {
      await seedDatabase();
    }
    isDbInitialized = true;
  }
  return app(req, res);
}
