
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  UserCheck, 
  UserX,
  Check,
  X,
  ArrowUpDown,
  Phone,
  Mail,
  User,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetchCustomers } from '@/services/dataService';
import { Customer } from '@/types';
import CustomerForm from '@/components/forms/CustomerForm';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  
  const { data: customers, isLoading, error, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const filteredCustomers = customers?.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCustomers = customers?.filter(c => c.status === 'active').length || 0;
  const inactiveCustomers = customers?.filter(c => c.status === 'inactive').length || 0;

  const handleAddCustomer = () => {
    setIsAddCustomerOpen(true);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <X className="h-10 w-10 text-destructive mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Failed to load customers</h2>
          <p className="text-muted-foreground mb-4">There was an error loading the customer data.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={handleAddCustomer}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{customers?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{activeCustomers}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserX className="mr-2 h-4 w-4 text-muted-foreground" />
              Inactive Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{inactiveCustomers}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-background w-full md:w-80"
            />
          </div>
        </div>
        
        <div className="data-table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center">
                    Customer
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24 mt-1" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24 mt-1" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredCustomers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers?.map((customer: Customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.contactPerson}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm mt-1">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{customer.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.status === 'active' ? 'outline' : 'secondary'} className="flex w-fit items-center gap-1">
                        {customer.status === 'active' ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-red-500" />
                        )}
                        {customer.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/customers/${customer.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                          <DropdownMenuItem>View Contracts</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm 
            onSuccess={() => {
              setIsAddCustomerOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersPage;
