import { getIsConnected } from '../config/dbConnect.js';
import { db as memoryDb } from '../db.js';
import { User } from '../models/User.js';
import { Equipment } from '../models/Equipment.js';
import { Schedule } from '../models/Schedule.js';
import { Issue } from '../models/Issue.js';
import { Downtime } from '../models/Downtime.js';
import { Notification } from '../models/Notification.js';

export const dbService = {
  // --- USERS ---
  async findUserByEmail(email) {
    if (getIsConnected()) {
      const doc = await User.findOne({ email: email.toLowerCase() }).lean();
      if (doc) return { ...doc, id: doc.customId || doc._id.toString() };
      return null;
    }
    return memoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async createUser(userData) {
    if (getIsConnected()) {
      const created = await User.create({ ...userData, customId: userData.id });
      const obj = created.toObject();
      return { ...obj, id: obj.customId };
    }
    memoryDb.users.push(userData);
    return userData;
  },

  // --- EQUIPMENT ---
  async getAllEquipment() {
    if (getIsConnected()) {
      const docs = await Equipment.find().sort({ createdAt: -1 }).lean();
      return docs.map(d => ({ ...d, id: d.customId || d._id.toString() }));
    }
    return memoryDb.equipment;
  },

  async getEquipmentById(id) {
    if (getIsConnected()) {
      const doc = await Equipment.findOne({ customId: id }).lean();
      if (doc) return { ...doc, id: doc.customId };
      return null;
    }
    return memoryDb.equipment.find(e => e.id === id) || null;
  },

  async createEquipment(eqData) {
    if (getIsConnected()) {
      const created = await Equipment.create({ ...eqData, customId: eqData.id });
      const obj = created.toObject();
      return { ...obj, id: obj.customId };
    }
    memoryDb.equipment.unshift(eqData);
    return eqData;
  },

  async updateEquipment(id, updateData) {
    if (getIsConnected()) {
      const updated = await Equipment.findOneAndUpdate(
        { customId: id },
        { $set: updateData },
        { new: true }
      ).lean();
      if (updated) return { ...updated, id: updated.customId };
      return null;
    }
    const idx = memoryDb.equipment.findIndex(e => e.id === id);
    if (idx !== -1) {
      memoryDb.equipment[idx] = { ...memoryDb.equipment[idx], ...updateData };
      return memoryDb.equipment[idx];
    }
    return null;
  },

  async deleteEquipment(id) {
    if (getIsConnected()) {
      const deleted = await Equipment.findOneAndDelete({ customId: id }).lean();
      if (deleted) return { ...deleted, id: deleted.customId };
      return null;
    }
    const idx = memoryDb.equipment.findIndex(e => e.id === id);
    if (idx !== -1) {
      return memoryDb.equipment.splice(idx, 1)[0];
    }
    return null;
  },

  // --- SCHEDULES ---
  async getAllSchedules() {
    if (getIsConnected()) {
      const docs = await Schedule.find().sort({ createdAt: -1 }).lean();
      return docs.map(d => ({ ...d, id: d.customId || d._id.toString() }));
    }
    return memoryDb.schedules;
  },

  async createSchedule(schedData) {
    if (getIsConnected()) {
      const created = await Schedule.create({ ...schedData, customId: schedData.id });
      const obj = created.toObject();
      return { ...obj, id: obj.customId };
    }
    memoryDb.schedules.unshift(schedData);
    return schedData;
  },

  async updateSchedule(id, updateData) {
    if (getIsConnected()) {
      const updated = await Schedule.findOneAndUpdate(
        { customId: id },
        { $set: updateData },
        { new: true }
      ).lean();
      if (updated) return { ...updated, id: updated.customId };
      return null;
    }
    const sched = memoryDb.schedules.find(s => s.id === id);
    if (sched) {
      Object.assign(sched, updateData);
      return sched;
    }
    return null;
  },

  // --- ISSUES ---
  async getAllIssues() {
    if (getIsConnected()) {
      const docs = await Issue.find().sort({ createdAt: -1 }).lean();
      return docs.map(d => ({ ...d, id: d.customId || d._id.toString() }));
    }
    return memoryDb.issues;
  },

  async createIssue(issueData) {
    if (getIsConnected()) {
      const created = await Issue.create({ ...issueData, customId: issueData.id });
      const obj = created.toObject();
      return { ...obj, id: obj.customId };
    }
    memoryDb.issues.unshift(issueData);
    return issueData;
  },

  async updateIssue(id, updateData) {
    if (getIsConnected()) {
      const updated = await Issue.findOneAndUpdate(
        { customId: id },
        { $set: updateData },
        { new: true }
      ).lean();
      if (updated) return { ...updated, id: updated.customId };
      return null;
    }
    const issue = memoryDb.issues.find(i => i.id === id);
    if (issue) {
      Object.assign(issue, updateData);
      return issue;
    }
    return null;
  },

  // --- DOWNTIME ---
  async getAllDowntime() {
    if (getIsConnected()) {
      const docs = await Downtime.find().lean();
      return docs.map(d => ({ ...d, id: d.customId || d._id.toString() }));
    }
    return memoryDb.downtime;
  },

  async createDowntime(dtData) {
    if (getIsConnected()) {
      const created = await Downtime.create({ ...dtData, customId: dtData.id });
      const obj = created.toObject();
      return { ...obj, id: obj.customId };
    }
    memoryDb.downtime.unshift(dtData);
    return dtData;
  },

  async updateDowntime(issueId, updateData) {
    if (getIsConnected()) {
      const updated = await Downtime.findOneAndUpdate(
        { issueId, endTime: null },
        { $set: updateData },
        { new: true }
      ).lean();
      if (updated) return { ...updated, id: updated.customId };
      return null;
    }
    const dt = memoryDb.downtime.find(d => d.issueId === issueId && !d.endTime);
    if (dt) {
      Object.assign(dt, updateData);
      return dt;
    }
    return null;
  },

  // --- NOTIFICATIONS ---
  async getAllNotifications() {
    if (getIsConnected()) {
      const docs = await Notification.find().sort({ createdAt: -1 }).lean();
      return docs.map(d => ({ ...d, id: d.customId || d._id.toString() }));
    }
    return memoryDb.notifications;
  },

  async createNotification(notifData) {
    if (getIsConnected()) {
      const created = await Notification.create({ ...notifData, customId: notifData.id });
      const obj = created.toObject();
      return { ...obj, id: obj.customId };
    }
    memoryDb.notifications.unshift(notifData);
    return notifData;
  },

  async markNotificationRead(id) {
    if (getIsConnected()) {
      const updated = await Notification.findOneAndUpdate(
        { customId: id },
        { $set: { isRead: true } },
        { new: true }
      ).lean();
      if (updated) return { ...updated, id: updated.customId };
      return null;
    }
    const notif = memoryDb.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      return notif;
    }
    return null;
  }
};
