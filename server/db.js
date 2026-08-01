import bcrypt from 'bcryptjs';

// Pre-hashed passwords for demo users: "admin123", "staff123", "faculty123"
const adminHash = bcrypt.hashSync('admin123', 10);
const staffHash = bcrypt.hashSync('staff123', 10);
const facultyHash = bcrypt.hashSync('faculty123', 10);

export const db = {
  users: [
    {
      id: 'u-1',
      name: 'Dr. Robert Vance',
      email: 'admin@college.edu',
      password: adminHash,
      role: 'admin',
      department: 'Maintenance Management',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'u-2',
      name: 'Alex Turner',
      email: 'staff@college.edu',
      password: staffHash,
      role: 'staff',
      department: 'Technical Support & Repair',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'u-3',
      name: 'Dr. Sarah Jenkins',
      email: 'faculty@college.edu',
      password: facultyHash,
      role: 'faculty',
      department: 'Computer Science & Eng.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-01T00:00:00Z'
    }
  ],

  equipment: [
    {
      id: 'eq-101',
      equipmentCode: 'EQ-CS-001',
      name: 'High-Performance AI Workstation Rig #4',
      category: 'Computers',
      department: 'Computer Science',
      location: 'Advanced AI Lab - Block B Room 304',
      modelNumber: 'Dell Precision 7920 / Dual RTX 4090',
      purchaseDate: '2023-08-15',
      status: 'Operational',
      lastMaintenanceDate: '2026-06-10',
      nextMaintenanceDate: '2026-08-10'
    },
    {
      id: 'eq-102',
      equipmentCode: 'EQ-AV-012',
      name: '4K Ultra-Short Throw Laser Projector',
      category: 'Projectors',
      department: 'Electronics',
      location: 'Main Auditorium - Hall 1',
      modelNumber: 'Epson Pro L1755UNL',
      purchaseDate: '2022-11-20',
      status: 'Reported',
      lastMaintenanceDate: '2026-05-18',
      nextMaintenanceDate: '2026-08-01'
    },
    {
      id: 'eq-103',
      equipmentCode: 'EQ-AC-045',
      name: 'Central VRF Chiller AC Unit 2',
      category: 'AC',
      department: 'Administration',
      location: 'Server Room Main Hub - Basement 1',
      modelNumber: 'Daikin VRV IV-S 12 HP',
      purchaseDate: '2021-04-10',
      status: 'Under Maintenance',
      lastMaintenanceDate: '2026-04-22',
      nextMaintenanceDate: '2026-07-30'
    },
    {
      id: 'eq-104',
      equipmentCode: 'EQ-NET-088',
      name: 'Core 48-Port Fiber Distribution Switch',
      category: 'Network',
      department: 'Computer Science',
      location: 'Network Closet - Block A 2nd Floor',
      modelNumber: 'Cisco Catalyst 9300 48-Port',
      purchaseDate: '2024-01-12',
      status: 'Operational',
      lastMaintenanceDate: '2026-07-01',
      nextMaintenanceDate: '2026-10-01'
    },
    {
      id: 'eq-105',
      equipmentCode: 'EQ-LAB-203',
      name: 'Digital Oscilloscope 100MHz 4-Channel',
      category: 'Laboratory',
      department: 'Electronics',
      location: 'ECE Signals Lab - Room 208',
      modelNumber: 'Tektronix TBS1104',
      purchaseDate: '2022-03-05',
      status: 'Out of Service',
      lastMaintenanceDate: '2026-03-14',
      nextMaintenanceDate: '2026-06-14'
    },
    {
      id: 'eq-106',
      equipmentCode: 'EQ-PRN-009',
      name: 'Industrial Heavy Duty Duplex Network Printer',
      category: 'Printers',
      department: 'Library',
      location: 'Central Library Printing Zone',
      modelNumber: 'HP LaserJet Enterprise M608dn',
      purchaseDate: '2023-02-18',
      status: 'Operational',
      lastMaintenanceDate: '2026-07-15',
      nextMaintenanceDate: '2026-08-15'
    },
    {
      id: 'eq-107',
      equipmentCode: 'EQ-ELE-112',
      name: '3-Phase 100kVA Online UPS Power System',
      category: 'Electrical',
      department: 'Administration',
      location: 'Electrical Control Room B',
      modelNumber: 'APC Smart-UPS VT 100kVA',
      purchaseDate: '2020-09-30',
      status: 'Operational',
      lastMaintenanceDate: '2026-06-25',
      nextMaintenanceDate: '2026-07-31'
    }
  ],

  schedules: [
    {
      id: 'm-301',
      equipmentId: 'eq-103',
      equipmentCode: 'EQ-AC-045',
      equipmentName: 'Central VRF Chiller AC Unit 2',
      assignedTo: 'Alex Turner',
      assignedToId: 'u-2',
      maintenanceType: 'Repair',
      scheduledDate: '2026-07-30',
      priority: 'Critical',
      status: 'In Progress',
      notes: 'Compressor coolant leak diagnosis and pressure seal replacement.',
      completedAt: null
    },
    {
      id: 'm-302',
      equipmentId: 'eq-107',
      equipmentCode: 'EQ-ELE-112',
      equipmentName: '3-Phase 100kVA Online UPS Power System',
      assignedTo: 'Alex Turner',
      assignedToId: 'u-2',
      maintenanceType: 'Routine Check',
      scheduledDate: '2026-07-31',
      priority: 'High',
      status: 'Due Today',
      notes: 'Monthly battery bank voltage calibration and thermal camera audit.',
      completedAt: null
    },
    {
      id: 'm-303',
      equipmentId: 'eq-102',
      equipmentCode: 'EQ-AV-012',
      equipmentName: '4K Ultra-Short Throw Laser Projector',
      assignedTo: 'Alex Turner',
      assignedToId: 'u-2',
      maintenanceType: 'Inspection',
      scheduledDate: '2026-08-01',
      priority: 'High',
      status: 'Upcoming',
      notes: 'Flickering display lens adjustment and optical filter dust cleaning.',
      completedAt: null
    },
    {
      id: 'm-304',
      equipmentId: 'eq-105',
      equipmentCode: 'EQ-LAB-203',
      equipmentName: 'Digital Oscilloscope 100MHz 4-Channel',
      assignedTo: 'Alex Turner',
      assignedToId: 'u-2',
      maintenanceType: 'Preventive Maintenance',
      scheduledDate: '2026-06-14',
      priority: 'Medium',
      status: 'Overdue',
      notes: 'Channel 3 probe calibration failure requiring factory recalibration.',
      completedAt: null
    },
    {
      id: 'm-305',
      equipmentId: 'eq-101',
      equipmentCode: 'EQ-CS-001',
      equipmentName: 'High-Performance AI Workstation Rig #4',
      assignedTo: 'Alex Turner',
      assignedToId: 'u-2',
      maintenanceType: 'Preventive Maintenance',
      scheduledDate: '2026-06-10',
      priority: 'Low',
      status: 'Completed',
      notes: 'Thermal paste replacement, dust blowout, and GPU driver stress testing.',
      completedAt: '2026-06-10T14:30:00Z'
    }
  ],

  issues: [
    {
      id: 'iss-501',
      equipmentId: 'eq-102',
      equipmentCode: 'EQ-AV-012',
      equipmentName: '4K Ultra-Short Throw Laser Projector',
      location: 'Main Auditorium - Hall 1',
      reportedBy: 'Dr. Sarah Jenkins',
      reportedById: 'u-3',
      assignedTo: 'Alex Turner',
      assignedToId: 'u-2',
      title: 'Intermittent Screen Flickering & Overheating Shutdown',
      description: 'During morning computer science guest lectures, the laser projector screen flickered blue repeatedly before shutting down with an amber thermal warning light.',
      priority: 'High',
      status: 'Assigned',
      reportedAt: '2026-07-30T09:15:00Z',
      resolvedAt: null,
      resolutionRemarks: '',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'iss-502',
      equipmentId: 'eq-103',
      equipmentCode: 'EQ-AC-045',
      equipmentName: 'Central VRF Chiller AC Unit 2',
      location: 'Server Room Main Hub - Basement 1',
      reportedBy: 'Dr. Robert Vance',
      reportedById: 'u-1',
      assignedTo: 'Alex Turner',
      assignedToId: 'u-2',
      title: 'Severe Refrigerant Leak & Elevated Server Room Temp',
      description: 'Server room temperature spiked to 28°C due to low cooling capacity on VRF Unit 2. Hissing sound heard near expansion valve.',
      priority: 'Critical',
      status: 'In Progress',
      reportedAt: '2026-07-29T16:45:00Z',
      resolvedAt: null,
      resolutionRemarks: 'Replaced high-pressure seal. Currently purging moisture from refrigerant lines.',
      imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'iss-503',
      equipmentId: 'eq-106',
      equipmentCode: 'EQ-PRN-009',
      equipmentName: 'Industrial Heavy Duty Duplex Network Printer',
      location: 'Central Library Printing Zone',
      reportedBy: 'Dr. Sarah Jenkins',
      reportedById: 'u-3',
      assignedTo: 'Alex Turner',
      assignedToId: 'u-2',
      title: 'Paper Jam Tray 2 & Toner Smudge',
      description: 'Double-sided printing jams continuously on Tray 2. Black toner streaks down right margin of output papers.',
      priority: 'Medium',
      status: 'Resolved',
      reportedAt: '2026-07-25T11:00:00Z',
      resolvedAt: '2026-07-26T15:20:00Z',
      resolutionRemarks: 'Cleaned fuser rollers and replaced paper pickup roller assembly on Tray 2. Test printed 50 pages clean.',
      imageUrl: ''
    }
  ],

  downtime: [
    {
      id: 'dt-801',
      equipmentId: 'eq-103',
      equipmentCode: 'EQ-AC-045',
      equipmentName: 'Central VRF Chiller AC Unit 2',
      issueId: 'iss-502',
      startTime: '2026-07-29T16:45:00Z',
      endTime: null,
      durationHours: 43.5,
      reason: 'Severe Refrigerant Leak & Compressor Overhaul'
    },
    {
      id: 'dt-802',
      equipmentId: 'eq-105',
      equipmentCode: 'EQ-LAB-203',
      equipmentName: 'Digital Oscilloscope 100MHz 4-Channel',
      issueId: null,
      startTime: '2026-06-14T08:00:00Z',
      endTime: null,
      durationHours: 1128,
      reason: 'Internal Channel 3 Motherboard Hardware Failure - Awaiting Spare Parts'
    },
    {
      id: 'dt-803',
      equipmentId: 'eq-106',
      equipmentCode: 'EQ-PRN-009',
      equipmentName: 'Industrial Heavy Duty Duplex Network Printer',
      issueId: 'iss-503',
      startTime: '2026-07-25T11:00:00Z',
      endTime: '2026-07-26T15:20:00Z',
      durationHours: 28.3,
      reason: 'Fuser Roller & Paper Tray Jam Repair'
    }
  ],

  notifications: [
    {
      id: 'notif-1',
      userId: 'u-1',
      role: 'admin',
      title: 'Critical Issue Reported',
      message: 'Dr. Sarah Jenkins reported a High Priority issue on 4K Laser Projector (EQ-AV-012).',
      type: 'urgent',
      isRead: false,
      createdAt: '2026-07-30T09:15:00Z'
    },
    {
      id: 'notif-2',
      userId: 'u-2',
      role: 'staff',
      title: 'New Maintenance Task Assigned',
      message: 'You have been assigned to maintenance task: 3-Phase 100kVA Online UPS Power System (Due Today).',
      type: 'warning',
      isRead: false,
      createdAt: '2026-07-31T08:00:00Z'
    },
    {
      id: 'notif-3',
      userId: 'u-3',
      role: 'faculty',
      title: 'Issue Status Updated',
      message: 'Your report regarding Paper Jam Tray 2 (EQ-PRN-009) has been marked as Resolved.',
      type: 'success',
      isRead: true,
      createdAt: '2026-07-26T15:20:00Z'
    }
  ]
};
