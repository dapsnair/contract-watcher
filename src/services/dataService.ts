
import { Customer, Contract, Notification, DashboardStats } from '../types';
import { format, addDays, subDays, parseISO, isAfter, isBefore } from 'date-fns';

// Mock customers data
const customers: Customer[] = [
  {
    id: '1',
    name: 'ACME Corporation',
    email: 'info@acme.com',
    phone: '(555) 123-4567',
    contactPerson: 'John Doe',
    address: '123 Main St, Anytown, USA',
    createdAt: '2023-01-15T00:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '(555) 987-6543',
    contactPerson: 'Jane Smith',
    address: '456 Tech Blvd, Silicon Valley, USA',
    createdAt: '2023-03-22T00:00:00Z',
    status: 'active',
  },
  {
    id: '3',
    name: 'Global Systems Inc.',
    email: 'support@globalsys.com',
    phone: '(555) 456-7890',
    contactPerson: 'Michael Johnson',
    address: '789 Global Ave, Metropolis, USA',
    createdAt: '2023-05-10T00:00:00Z',
    status: 'active',
  },
  {
    id: '4',
    name: 'Innovative Startups',
    email: 'hello@innovative.co',
    phone: '(555) 234-5678',
    contactPerson: 'Emily Chen',
    address: '321 Innovation Way, Startupville, USA',
    createdAt: '2023-07-05T00:00:00Z',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Enterprise Solutions',
    email: 'sales@enterprise.biz',
    phone: '(555) 876-5432',
    contactPerson: 'Robert Wilson',
    address: '654 Enterprise St, Businesstown, USA',
    createdAt: '2023-09-18T00:00:00Z',
    status: 'active',
  },
];

// Create some dates relative to today
const today = new Date();
const formatDate = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");

// Mock contracts data
const contracts: Contract[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'ACME Corporation',
    type: 'domain',
    name: 'acme.com Domain',
    startDate: formatDate(subDays(today, 330)),
    endDate: formatDate(addDays(today, 35)),
    renewalDate: formatDate(addDays(today, 7)),
    amount: 120,
    status: 'active',
    notes: 'Annual domain renewal',
  },
  {
    id: '2',
    customerId: '1',
    customerName: 'ACME Corporation',
    type: 'hosting',
    name: 'Web Hosting Plan',
    startDate: formatDate(subDays(today, 180)),
    endDate: formatDate(addDays(today, 185)),
    renewalDate: formatDate(addDays(today, 160)),
    amount: 1200,
    status: 'active',
    notes: 'Premium hosting plan with backup',
  },
  {
    id: '3',
    customerId: '2',
    customerName: 'TechCorp Solutions',
    type: 'support',
    name: 'IT Support Contract',
    startDate: formatDate(subDays(today, 25)),
    endDate: formatDate(subDays(today, 5)),
    renewalDate: formatDate(subDays(today, 20)),
    amount: 5000,
    status: 'expired',
    notes: 'Renewal pending client approval',
  },
  {
    id: '4',
    customerId: '3',
    customerName: 'Global Systems Inc.',
    type: 'domain',
    name: 'globalsys.com Domain',
    startDate: formatDate(subDays(today, 270)),
    endDate: formatDate(addDays(today, 95)),
    renewalDate: formatDate(addDays(today, 65)),
    amount: 150,
    status: 'active',
  },
  {
    id: '5',
    customerId: '3',
    customerName: 'Global Systems Inc.',
    type: 'hosting',
    name: 'Cloud Server',
    startDate: formatDate(subDays(today, 58)),
    endDate: formatDate(addDays(today, 2)),
    renewalDate: formatDate(addDays(today, 1)),
    amount: 3600,
    status: 'active',
    notes: 'High-performance cloud server package',
  },
  {
    id: '6',
    customerId: '5',
    customerName: 'Enterprise Solutions',
    type: 'support',
    name: 'Managed IT Services',
    startDate: formatDate(subDays(today, 120)),
    endDate: formatDate(addDays(today, 245)),
    renewalDate: formatDate(addDays(today, 215)),
    amount: 12000,
    status: 'active',
    notes: 'Comprehensive managed IT services',
  },
  {
    id: '7',
    customerId: '4',
    customerName: 'Innovative Startups',
    type: 'domain',
    name: 'innovative.co Domain',
    startDate: formatDate(subDays(today, 340)),
    endDate: formatDate(addDays(today, 25)),
    renewalDate: formatDate(addDays(today, 10)),
    amount: 95,
    status: 'active',
  },
];

// Mock notifications data
const notifications: Notification[] = [
  {
    id: '1',
    type: 'contract-expiring',
    message: 'ACME Corporation domain renewal due in 7 days',
    relatedTo: {
      type: 'contract',
      id: '1',
    },
    date: formatDate(subDays(today, 1)),
    read: false,
  },
  {
    id: '2',
    type: 'contract-expired',
    message: 'TechCorp Solutions IT Support Contract has expired',
    relatedTo: {
      type: 'contract',
      id: '3',
    },
    date: formatDate(subDays(today, 5)),
    read: true,
  },
  {
    id: '3',
    type: 'customer-added',
    message: 'New customer Global Systems Inc. has been added',
    relatedTo: {
      type: 'customer',
      id: '3',
    },
    date: formatDate(subDays(today, 10)),
    read: true,
  },
  {
    id: '4',
    type: 'contract-expiring',
    message: 'Global Systems Inc. Cloud Server renewal due tomorrow',
    relatedTo: {
      type: 'contract',
      id: '5',
    },
    date: formatDate(subDays(today, 1)),
    read: false,
  },
  {
    id: '5',
    type: 'contract-expiring',
    message: 'Innovative Startups domain renewal due in 10 days',
    relatedTo: {
      type: 'contract',
      id: '7',
    },
    date: formatDate(subDays(today, 2)),
    read: false,
  },
];

// Service functions
export const fetchCustomers = async (): Promise<Customer[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return customers;
};

export const fetchCustomerById = async (id: string): Promise<Customer | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return customers.find(customer => customer.id === id);
};

export const fetchContracts = async (): Promise<Contract[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return contracts;
};

export const fetchContractsByCustomerId = async (customerId: string): Promise<Contract[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return contracts.filter(contract => contract.customerId === customerId);
};

export const fetchNotifications = async (): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return notifications;
};

export const fetchUnreadNotificationsCount = async (): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return notifications.filter(notification => !notification.read).length;
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Get upcoming renewals (next 30 days)
  const thirtyDaysFromNow = addDays(today, 30);
  const upcomingRenewals = contracts
    .filter(contract => {
      const renewalDate = parseISO(contract.renewalDate);
      return isAfter(renewalDate, today) && isBefore(renewalDate, thirtyDaysFromNow);
    })
    .sort((a, b) => parseISO(a.renewalDate).getTime() - parseISO(b.renewalDate).getTime());
  
  // Calculate other stats
  const activeCustomers = customers.filter(customer => customer.status === 'active').length;
  const expiringContracts = contracts.filter(contract => {
    const endDate = parseISO(contract.endDate);
    return isAfter(endDate, today) && isBefore(endDate, thirtyDaysFromNow);
  }).length;
  
  const contractsValue = contracts
    .filter(contract => contract.status === 'active')
    .reduce((sum, contract) => sum + contract.amount, 0);
  
  return {
    totalCustomers: customers.length,
    activeCustomers,
    totalContracts: contracts.length,
    expiringContracts,
    contractsValue,
    upcomingRenewals,
    recentNotifications: notifications.slice(0, 3),
  };
};

// Add a customer
export const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
  const newCustomer: Customer = {
    ...customer,
    id: (customers.length + 1).toString(),
    createdAt: new Date().toISOString(),
  };
  
  customers.push(newCustomer);
  return newCustomer;
};

// Add a contract
export const addContract = async (contract: Omit<Contract, 'id'>): Promise<Contract> => {
  const newContract: Contract = {
    ...contract,
    id: (contracts.length + 1).toString(),
  };
  
  contracts.push(newContract);
  return newContract;
};

// Update a customer
export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer | undefined> => {
  const index = customers.findIndex(customer => customer.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...updates };
    return customers[index];
  }
  return undefined;
};

// Update a contract
export const updateContract = async (id: string, updates: Partial<Contract>): Promise<Contract | undefined> => {
  const index = contracts.findIndex(contract => contract.id === id);
  if (index !== -1) {
    contracts[index] = { ...contracts[index], ...updates };
    return contracts[index];
  }
  return undefined;
};

// Mark notification as read
export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  const index = notifications.findIndex(notification => notification.id === id);
  if (index !== -1) {
    notifications[index].read = true;
    return true;
  }
  return false;
};
