import { getIsConnected } from '../config/dbConnect.js';
import { db as memoryDb } from '../db.js';
import { User } from '../models/User.js';
import { Equipment } from '../models/Equipment.js';
import { Schedule } from '../models/Schedule.js';
import { Issue } from '../models/Issue.js';
import { Downtime } from '../models/Downtime.js';
import { Notification } from '../models/Notification.js';

export const seedDatabase = async () => {
  if (!getIsConnected()) return;

  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seed] Seeding Users into MongoDB...');
      await User.insertMany(memoryDb.users.map(u => ({ ...u, customId: u.id })));
    }

    const eqCount = await Equipment.countDocuments();
    if (eqCount === 0) {
      console.log('[Seed] Seeding Equipment into MongoDB...');
      await Equipment.insertMany(memoryDb.equipment.map(e => ({ ...e, customId: e.id })));
    }

    const schedCount = await Schedule.countDocuments();
    if (schedCount === 0) {
      console.log('[Seed] Seeding Schedules into MongoDB...');
      await Schedule.insertMany(memoryDb.schedules.map(s => ({ ...s, customId: s.id })));
    }

    const issueCount = await Issue.countDocuments();
    if (issueCount === 0) {
      console.log('[Seed] Seeding Issues into MongoDB...');
      await Issue.insertMany(memoryDb.issues.map(i => ({ ...i, customId: i.id })));
    }

    const dtCount = await Downtime.countDocuments();
    if (dtCount === 0) {
      console.log('[Seed] Seeding Downtime records into MongoDB...');
      await Downtime.insertMany(memoryDb.downtime.map(d => ({ ...d, customId: d.id })));
    }

    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      console.log('[Seed] Seeding Notifications into MongoDB...');
      await Notification.insertMany(memoryDb.notifications.map(n => ({ ...n, customId: n.id })));
    }

    console.log('[Seed] MongoDB initial seeding complete.');
  } catch (error) {
    console.error('[Seed Error] Failed to seed MongoDB:', error.message);
  }
};
