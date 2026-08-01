import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_EQUIPMENT, 
  INITIAL_MAINTENANCE_SCHEDULES, 
  INITIAL_ISSUES, 
  INITIAL_DOWNTIME 
} from '../data/initialData';
import { useNotifications } from './NotificationContext';

const EquipmentContext = createContext();

export const EquipmentProvider = ({ children }) => {
  const { addNotification } = useNotifications();

  const [equipment, setEquipment] = useState(() => {
    const saved = localStorage.getItem('college_maint_equipment');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return INITIAL_EQUIPMENT;
  });

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('college_maint_schedules');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return INITIAL_MAINTENANCE_SCHEDULES;
  });

  const [issues, setIssues] = useState(() => {
    const saved = localStorage.getItem('college_maint_issues');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return INITIAL_ISSUES;
  });

  const [downtimeRecords, setDowntimeRecords] = useState(() => {
    const saved = localStorage.getItem('college_maint_downtime');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return INITIAL_DOWNTIME;
  });

  useEffect(() => {
    localStorage.setItem('college_maint_equipment', JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem('college_maint_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('college_maint_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('college_maint_downtime', JSON.stringify(downtimeRecords));
  }, [downtimeRecords]);

  // Add Equipment AND Automatically Schedule Initial Preventive Maintenance!
  const addEquipment = (eqData) => {
    const generatedCode = eqData.equipmentCode || `EQ-${eqData.category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newEqId = `eq-${Date.now()}`;

    const newEq = {
      id: newEqId,
      equipmentCode: generatedCode,
      name: eqData.name,
      category: eqData.category,
      department: eqData.department,
      location: eqData.location,
      modelNumber: eqData.modelNumber || 'N/A',
      purchaseDate: eqData.purchaseDate || new Date().toISOString().split('T')[0],
      status: 'Operational',
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      nextMaintenanceDate: eqData.scheduledDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setEquipment(prev => [newEq, ...prev]);

    // Automatically create initial Preventive Maintenance schedule task upon equipment registration
    const newSched = {
      id: `m-${Date.now()}`,
      equipmentId: newEqId,
      equipmentCode: generatedCode,
      equipmentName: newEq.name,
      assignedTo: eqData.assignedTo || 'Alex Turner',
      assignedToId: 'u-2',
      maintenanceType: eqData.maintenanceType || 'Preventive Maintenance',
      scheduledDate: eqData.scheduledDate || newEq.nextMaintenanceDate,
      priority: eqData.priority || 'Medium',
      status: 'Upcoming',
      notes: eqData.maintenanceNotes || 'Initial preventive checkup configured upon equipment addition.',
      completedAt: null
    };

    setSchedules(prev => [newSched, ...prev]);

    addNotification({
      title: 'Equipment Registered & Maintenance Scheduled',
      message: `${newEq.name} (${generatedCode}) registered. Initial ${newSched.maintenanceType} scheduled for ${newSched.scheduledDate}.`,
      type: 'info'
    });
  };

  const updateEquipment = (id, updatedFields) => {
    setEquipment(prev => prev.map(eq => eq.id === id ? { ...eq, ...updatedFields } : eq));
  };

  const deleteEquipment = (id) => {
    const item = equipment.find(e => e.id === id);
    setEquipment(prev => prev.filter(eq => eq.id !== id));
    if (item) {
      addNotification({
        title: 'Equipment Removed',
        message: `${item.name} (${item.equipmentCode}) was deleted from the register.`,
        type: 'warning'
      });
    }
  };

  const updateScheduleStatus = (id, newStatus, notes = '') => {
    const targetSched = schedules.find(s => s.id === id);
    setSchedules(prev => prev.map(s => {
      if (s.id === id) {
        const isComp = newStatus === 'Completed';
        return {
          ...s,
          status: newStatus,
          notes: notes ? `${s.notes}\n[Update]: ${notes}` : s.notes,
          completedAt: isComp ? new Date().toISOString() : s.completedAt
        };
      }
      return s;
    }));

    if (targetSched && newStatus === 'Completed') {
      updateEquipment(targetSched.equipmentId, {
        status: 'Operational',
        lastMaintenanceDate: new Date().toISOString().split('T')[0]
      });

      addNotification({
        title: 'Maintenance Task Completed',
        message: `${targetSched.equipmentName} maintenance has been marked as Completed.`,
        type: 'success'
      });
    }
  };

  const reportIssue = (issueData) => {
    const targetEq = equipment.find(e => e.id === issueData.equipmentId);
    const newIssue = {
      id: `iss-${Date.now()}`,
      equipmentCode: targetEq ? targetEq.equipmentCode : 'EQ-GEN',
      equipmentName: targetEq ? targetEq.name : 'Unknown Equipment',
      status: 'Reported',
      reportedAt: new Date().toISOString(),
      resolvedAt: null,
      resolutionRemarks: '',
      assignedTo: 'Unassigned',
      assignedToId: null,
      ...issueData
    };

    setIssues(prev => [newIssue, ...prev]);

    if (targetEq) {
      updateEquipment(targetEq.id, { status: 'Reported' });
    }

    setDowntimeRecords(prev => [{
      id: `dt-${Date.now()}`,
      equipmentId: newIssue.equipmentId,
      equipmentCode: newIssue.equipmentCode,
      equipmentName: newIssue.equipmentName,
      issueId: newIssue.id,
      startTime: new Date().toISOString(),
      endTime: null,
      durationHours: 0,
      reason: newIssue.title
    }, ...prev]);

    addNotification({
      title: 'New Issue Reported',
      message: `${newIssue.reportedBy} reported an issue on ${newIssue.equipmentName}: "${newIssue.title}".`,
      type: 'urgent'
    });
  };

  const updateIssueStatus = (issueId, newStatus, assignedToInfo = null, remarks = '') => {
    let affectedEqId = null;

    setIssues(prev => prev.map(iss => {
      if (iss.id === issueId) {
        affectedEqId = iss.equipmentId;
        const isResolved = newStatus === 'Resolved' || newStatus === 'Closed';
        return {
          ...iss,
          status: newStatus,
          assignedTo: assignedToInfo ? assignedToInfo.name : iss.assignedTo,
          assignedToId: assignedToInfo ? assignedToInfo.id : iss.assignedToId,
          resolutionRemarks: remarks || iss.resolutionRemarks,
          resolvedAt: isResolved ? (iss.resolvedAt || new Date().toISOString()) : iss.resolvedAt
        };
      }
      return iss;
    }));

    const targetIssue = issues.find(i => i.id === issueId);
    if (!targetIssue) return;

    if (affectedEqId) {
      if (newStatus === 'In Progress' || newStatus === 'Assigned') {
        updateEquipment(affectedEqId, { status: 'Under Maintenance' });
      } else if (newStatus === 'Resolved' || newStatus === 'Closed') {
        updateEquipment(affectedEqId, { status: 'Operational' });
        
        setDowntimeRecords(prev => prev.map(dt => {
          if (dt.issueId === issueId && !dt.endTime) {
            const end = new Date();
            const start = new Date(dt.startTime);
            const hours = Math.max(0.1, Number(((end - start) / (1000 * 60 * 60)).toFixed(1)));
            return {
              ...dt,
              endTime: end.toISOString(),
              durationHours: hours
            };
          }
          return dt;
        }));
      }
    }

    addNotification({
      title: 'Issue Status Updated',
      message: `Issue "${targetIssue.title}" status changed to ${newStatus}.`,
      type: newStatus === 'Resolved' || newStatus === 'Closed' ? 'success' : 'info'
    });
  };

  const getDashboardStats = () => {
    const totalEquipment = equipment.length;
    const operational = equipment.filter(e => e.status === 'Operational').length;
    const underMaintenance = equipment.filter(e => e.status === 'Under Maintenance').length;
    const outOfService = equipment.filter(e => e.status === 'Out of Service').length;
    const reported = equipment.filter(e => e.status === 'Reported').length;

    const openIssues = issues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
    const dueTodaySchedules = schedules.filter(s => s.status === 'Due Today').length;
    const overdueSchedules = schedules.filter(s => s.status === 'Overdue').length;

    const totalDowntimeHours = downtimeRecords.reduce((sum, dt) => sum + (dt.durationHours || 0), 0);

    return {
      totalEquipment,
      operational,
      underMaintenance,
      outOfService,
      reported,
      openIssues,
      dueTodaySchedules,
      overdueSchedules,
      totalDowntimeHours: totalDowntimeHours.toFixed(1)
    };
  };

  return (
    <EquipmentContext.Provider value={{
      equipment,
      schedules,
      issues,
      downtimeRecords,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      updateScheduleStatus,
      reportIssue,
      updateIssueStatus,
      getDashboardStats
    }}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => useContext(EquipmentContext);
