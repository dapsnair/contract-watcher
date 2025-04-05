
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  Plus,
  FileCheck,
  Clock,
  Ban,
  Edit,
  RefreshCcw,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  fetchCustomerById, 
  fetchContractsByCustomerId 
} from '@/services/dataService';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Contract } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ContractForm from '@/components/forms/ContractForm';

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [isAddContractOpen, setIsAddContractOpen] = useState(false);
  
  const { data: customer, isLoading: customerLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => fetchCustomerById(id || ''),
    enabled: !!id,
  });
  
  const { data: contracts, isLoading: contractsLoading } = useQuery({
    queryKey: ['customerContracts', id],
    queryFn: () => fetchContractsByCustomerId(id || ''),
    enabled: !!id,
  });
  
  const activeContracts = contracts?.filter(c => c.status === 'active').length || 0;
  const expiringContracts = contracts?.filter(c => {
    if (c.status !== 'active') return false;
    const endDate = parseISO(c.endDate);
    const daysRemaining = differenceInDays(endDate, new Date());
    return daysRemaining <= 30;
  }).length || 0;
  const expiredContracts = contracts?.filter(c => c.status === 'expired').length || 0;

  const handleAddContract = () => {
    setIsAddContractOpen(true);
  };

  const getStatusBadge = (status: string, endDate: string) => {
    const today = new Date();
    const contractEndDate = parseISO(endDate);
    const daysRemaining = differenceInDays(contractEndDate, today);
    
    if (status === 'expired') {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (status === 'pending') {
      return <Badge variant="secondary">Pending</Badge>;
    } else if (daysRemaining <= 7) {
      return <Badge variant="destructive">Expiring Soon</Badge>;
    } else if (daysRemaining <= 30) {
      return <Badge variant="secondary">Expiring Soon</Badge>;
    } else {
      return <Badge variant="outline">Active</Badge>;
    }
  };

  const getContractTypeIcon = (type: string) => {
    switch (type) {
      case 'domain':
        return <span className="text-blue-500">Domain</span>;
      case 'hosting':
        return <span className="text-purple-500">Hosting</span>;
      case 'support':
        return <span className="text-green-500">Support</span>;
      default:
        return <span className="text-gray-500">Other</span>;
    }
  };

  if (customerLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/customers">
              <ArrowLeft className="h-4 w-4" />
              <span className="ml-1">Back</span>
            </Link>
          </Button>
        </div>
        
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-8 w-64 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Customer Not Found</h2>
          <p className="text-muted-foreground mb-4">The customer you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/customers">Back to Customers</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/customers">
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1">Back</span>
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <div className="flex items-center mt-1">
            <Badge variant={customer.status === 'active' ? 'outline' : 'secondary'}>
              {customer.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
            <span className="text-sm text-muted-foreground ml-3">
              Customer since {format(parseISO(customer.createdAt), 'MMMM yyyy')}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileCheck className="mr-2 h-4 w-4 text-muted-foreground" />
              Active Contracts
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            {contractsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{activeContracts}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            {contractsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{expiringContracts}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Ban className="mr-2 h-4 w-4 text-muted-foreground" />
              Expired Contracts
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            {contractsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{expiredContracts}</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-3">
            <div className="bg-muted rounded-full p-2 h-10 w-10 flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Contact Person</div>
              <div className="font-medium">{customer.contactPerson}</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-muted rounded-full p-2 h-10 w-10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{customer.email}</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-muted rounded-full p-2 h-10 w-10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Phone</div>
              <div className="font-medium">{customer.phone}</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-muted rounded-full p-2 h-10 w-10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Address</div>
              <div className="font-medium">{customer.address}</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-muted rounded-full p-2 h-10 w-10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Customer Since</div>
              <div className="font-medium">{format(parseISO(customer.createdAt), 'MMMM d, yyyy')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="contracts">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <Button onClick={handleAddContract}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contract
          </Button>
        </div>
        
        <TabsContent value="contracts" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="data-table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractsLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : contracts?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No contracts found for this customer
                        </TableCell>
                      </TableRow>
                    ) : (
                      contracts?.map((contract: Contract) => (
                        <TableRow key={contract.id}>
                          <TableCell>
                            <div className="font-medium">{contract.name}</div>
                          </TableCell>
                          <TableCell>{getContractTypeIcon(contract.type)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              Ends: {format(parseISO(contract.endDate), 'MMM d, yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Renewal: {format(parseISO(contract.renewalDate), 'MMM d, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell>${contract.amount.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(contract.status, contract.endDate)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" className="h-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8">
                                <RefreshCcw className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground py-12">
                No notes have been added yet
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground py-12">
                No history records found
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddContractOpen} onOpenChange={setIsAddContractOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Contract for {customer.name}</DialogTitle>
          </DialogHeader>
          <ContractForm 
            customerId={customer.id}
            onSuccess={() => setIsAddContractOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDetailPage;
