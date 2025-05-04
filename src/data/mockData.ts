
// Mock data for software licenses and usage
export interface Document {
  id: string;
  name: string;
  description: string;
  type: string;
  size: number;
  uploadDate: string;
  dataUrl?: string;
}

export interface License {
  id: string;
  name: string;
  vendor: string;
  type: 'Subscription' | 'Perpetual' | 'User-based' | 'Device-based';
  seats: number;
  usedSeats: number;
  cost: number;
  startDate: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired';
  lastUsed?: string;
  department: string;
  tags: string[];
  documents?: Document[];
}

export interface UsageData {
  date: string;
  users: number;
}

// Generate mock license data
export const licenses: License[] = [
  {
    id: '1',
    name: 'Adobe Creative Cloud',
    vendor: 'Adobe',
    type: 'Subscription',
    seats: 50,
    usedSeats: 42,
    cost: 29999,
    startDate: '2023-06-15',
    expiryDate: '2024-06-15',
    status: 'active',
    lastUsed: '2024-04-22',
    department: 'Design',
    tags: ['design', 'creative', 'essential'],
  },
  {
    id: '2',
    name: 'Microsoft 365',
    vendor: 'Microsoft',
    type: 'User-based',
    seats: 200,
    usedSeats: 187,
    cost: 35000,
    startDate: '2023-05-10',
    expiryDate: '2024-05-10',
    status: 'expiring',
    lastUsed: '2024-04-22',
    department: 'All',
    tags: ['office', 'essential', 'productivity'],
  },
  {
    id: '3',
    name: 'Slack Enterprise',
    vendor: 'Salesforce',
    type: 'User-based',
    seats: 150,
    usedSeats: 124,
    cost: 22000,
    startDate: '2023-02-21',
    expiryDate: '2024-02-21',
    status: 'expired',
    lastUsed: '2024-02-20',
    department: 'All',
    tags: ['communication', 'essential'],
  },
  {
    id: '4',
    name: 'Atlassian Jira',
    vendor: 'Atlassian',
    type: 'User-based',
    seats: 100,
    usedSeats: 78,
    cost: 14500,
    startDate: '2023-10-05',
    expiryDate: '2024-10-05',
    status: 'active',
    lastUsed: '2024-04-21',
    department: 'Engineering',
    tags: ['project-management', 'essential'],
  },
  {
    id: '5',
    name: 'Figma Enterprise',
    vendor: 'Figma',
    type: 'User-based',
    seats: 25,
    usedSeats: 22,
    cost: 6500,
    startDate: '2023-11-17',
    expiryDate: '2024-05-17',
    status: 'expiring',
    lastUsed: '2024-04-20',
    department: 'Design',
    tags: ['design', 'ui-ux'],
  },
  {
    id: '6',
    name: 'AWS Enterprise Support',
    vendor: 'Amazon',
    type: 'Subscription',
    seats: 1,
    usedSeats: 1,
    cost: 40000,
    startDate: '2023-08-01',
    expiryDate: '2024-08-01',
    status: 'active',
    lastUsed: '2024-04-22',
    department: 'Engineering',
    tags: ['cloud', 'infrastructure', 'essential'],
  },
  {
    id: '7',
    name: 'Salesforce Sales Cloud',
    vendor: 'Salesforce',
    type: 'User-based',
    seats: 35,
    usedSeats: 28,
    cost: 18000,
    startDate: '2023-07-10',
    expiryDate: '2024-07-10',
    status: 'active',
    lastUsed: '2024-04-19',
    department: 'Sales',
    tags: ['crm', 'sales'],
  },
  {
    id: '8',
    name: 'Zoom Enterprise',
    vendor: 'Zoom',
    type: 'User-based',
    seats: 80,
    usedSeats: 65,
    cost: 9500,
    startDate: '2023-09-15',
    expiryDate: '2024-09-15',
    status: 'active',
    lastUsed: '2024-04-22',
    department: 'All',
    tags: ['communication', 'video'],
  },
  {
    id: '9',
    name: 'AutoCAD',
    vendor: 'Autodesk',
    type: 'Subscription',
    seats: 15,
    usedSeats: 12,
    cost: 12500,
    startDate: '2023-03-01',
    expiryDate: '2024-03-01',
    status: 'expired',
    lastUsed: '2024-02-29',
    department: 'Engineering',
    tags: ['design', 'cad'],
  },
  {
    id: '10',
    name: 'GitHub Enterprise',
    vendor: 'Microsoft',
    type: 'User-based',
    seats: 90,
    usedSeats: 84,
    cost: 11000,
    startDate: '2023-12-10',
    expiryDate: '2024-12-10',
    status: 'active',
    lastUsed: '2024-04-21',
    department: 'Engineering',
    tags: ['code', 'essential', 'development'],
  }
];

// Generate mock usage data (last 30 days)
export const generateUsageData = (): UsageData[] => {
  const usageData: UsageData[] = [];
  const today = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // Generate a somewhat realistic usage pattern with weekday/weekend differences
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Base number of users (higher on weekdays, lower on weekends)
    let baseUsers = isWeekend ? 320 : 680;

    // Add some randomness
    const randomFactor = Math.random() * 50 - 25;
    const users = Math.max(0, Math.round(baseUsers + randomFactor));

    usageData.push({
      date: date.toISOString().split('T')[0],
      users,
    });
  }

  return usageData;
};

export const usageData = generateUsageData();

// License cost by department
export const departmentCosts = [
  { department: 'Engineering', cost: 78000 },
  { department: 'Design', cost: 36499 },
  { department: 'Sales', cost: 18000 },
  { department: 'Marketing', cost: 5500 },
  { department: 'All', cost: 66500 },
];

// License status summary
export const licenseSummary = {
  total: licenses.length,
  active: licenses.filter(license => license.status === 'active').length,
  expiring: licenses.filter(license => license.status === 'expiring').length,
  expired: licenses.filter(license => license.status === 'expired').length,
  totalCost: licenses.reduce((acc, license) => acc + license.cost, 0),
  totalSeats: licenses.reduce((acc, license) => acc + license.seats, 0),
  usedSeats: licenses.reduce((acc, license) => acc + license.usedSeats, 0),
};
