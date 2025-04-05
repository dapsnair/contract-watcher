
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  address: string;
  createdAt: string;
  status: 'active' | 'inactive';
};

export type Contract = {
  id: string;
  customerId: string;
  customerName: string;
  type: 'domain' | 'hosting' | 'support' | 'other';
  name: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  amount: number;
  status: 'active' | 'expired' | 'pending';
  notes?: string;
};

export type Notification = {
  id: string;
  type: 'contract-expiring' | 'contract-expired' | 'customer-added' | 'other';
  message: string;
  relatedTo?: {
    type: 'customer' | 'contract';
    id: string;
  };
  date: string;
  read: boolean;
};

export type DashboardStats = {
  totalCustomers: number;
  activeCustomers: number;
  totalContracts: number;
  expiringContracts: number;
  contractsValue: number;
  upcomingRenewals: Contract[];
  recentNotifications: Notification[];
};
