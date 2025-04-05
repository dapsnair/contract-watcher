import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  FileCheck, 
  Clock,
  Ban,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Server,
  Globe,
  HeadphonesIcon,
  FileIcon,
  Loader2,
  Filter,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchContracts } from '@/services/dataService';
import { Contract } from '@/types';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ContractForm from '@/components/forms/ContractForm';
import ContractEditForm from '@/components/forms/ContractEditForm';
import ContractRenewForm from '@/components/forms/ContractRenewForm';

const getContractIcon = (type: string) => {
  switch (type) {
    case 'domain':
      return <Globe className="h-4 w-4" />;
    case 'hosting':
      return <Server className="h-4 w-4" />;
    case 'support':
      return <HeadphonesIcon className="h-4 w-4" />;
    default:
      return <FileIcon className="h-4 w-4" />;
  }
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

const ContractsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddContractOpen, setIsAddContractOpen] = useState(false);
  const [isEditContractOpen, setIsEditContractOpen] = useState(false);
  const [isRenewContractOpen, setIsRenewContractOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const navigate = useNavigate();
  
  const { data: contracts, isLoading, error, refetch } = useQuery({
    queryKey: ['contracts'],
    queryFn: fetchContracts,
  });

  const filteredContracts = contracts?.filter(contract => {
    const matchesSearch = 
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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

  const handleViewDetails = (contractId: string) => {
    navigate(`/contracts/${contractId}`);
  };

  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsEditContractOpen(true);
  };

  const handleRenewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsRenewContractOpen(true);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <Ban className="h-10 w-10 text-destructive mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Failed to load contracts</h2>
          <p className="text-muted-foreground mb-4">There was an error loading the contract data.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contracts</h1>
        <Button onClick={handleAddContract}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contract
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileCheck className="mr-2 h-4 w-4 text-muted-foreground" />
              Active Contracts
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            {isLoading ? (
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
            {isLoading ? (
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
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{expiredContracts}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-background w-full"
            />
          </div>
          <div className="flex-shrink-0 w-full sm:w-48">
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="data-table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center">
                    Contract
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Amount</TableHead>
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
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24 mt-1" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredContracts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No contracts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredContracts?.map((contract: Contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <div className="font-medium flex items-center">
                        {getContractIcon(contract.type)}
                        <span className="ml-2">{contract.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 capitalize">
                        {contract.type} Contract
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/customers/${contract.customerId}`} className="text-primary hover:underline">
                        {contract.customerName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Ends: {format(parseISO(contract.endDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs mt-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Renewal: {format(parseISO(contract.renewalDate), 'MMM d, yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{contract.amount.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(contract.status, contract.endDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(contract.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditContract(contract)}>
                            Edit Contract
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRenewContract(contract)}>
                            Renew Contract
                          </DropdownMenuItem>
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

      <Dialog open={isAddContractOpen} onOpenChange={setIsAddContractOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Contract</DialogTitle>
            <DialogDescription>
              Enter the details for the new contract.
            </DialogDescription>
          </DialogHeader>
          <ContractForm 
            onSuccess={() => {
              setIsAddContractOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {selectedContract && (
        <>
          <Dialog open={isEditContractOpen} onOpenChange={setIsEditContractOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Contract</DialogTitle>
                <DialogDescription>
                  Make changes to the contract details.
                </DialogDescription>
              </DialogHeader>
              <ContractEditForm 
                contract={selectedContract}
                onSuccess={() => {
                  setIsEditContractOpen(false);
                  refetch();
                  setSelectedContract(null);
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isRenewContractOpen} onOpenChange={setIsRenewContractOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Renew Contract</DialogTitle>
                <DialogDescription>
                  Update the contract with new dates and terms.
                </DialogDescription>
              </DialogHeader>
              <ContractRenewForm 
                contract={selectedContract}
                onSuccess={() => {
                  setIsRenewContractOpen(false);
                  refetch();
                  setSelectedContract(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ContractsPage;
