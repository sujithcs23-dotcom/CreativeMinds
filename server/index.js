import app from './app.js';
import { connectDB } from './config/dbConnect.js';
import { seedDatabase } from './seed/seedDb.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbSuccess = await connectDB();
  if (dbSuccess) {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
};

startServer();
