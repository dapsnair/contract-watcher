
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchContractById, fetchCustomerById } from '@/services/dataService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Pencil, RefreshCw, Calendar, ArrowLeft, FileText, User } from 'lucide-react';
import { formatDistanceToNow, format, parseISO, isPast } from 'date-fns';
import ContractEditForm from '@/components/forms/ContractEditForm';
import ContractRenewForm from '@/components/forms/ContractRenewForm';
import { Contract } from '@/types';

const ContractDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  
  const { data: contract, isLoading, isError } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => fetchContractById(id!),
    enabled: !!id
  });
  
  const { data: customer } = useQuery({
    queryKey: ['customer', contract?.customerId],
    queryFn: () => fetchCustomerById(contract!.customerId),
    enabled: !!contract?.customerId
  });

  if (isLoading) {
    return <ContractDetailSkeleton />;
  }
  
  if (isError || !contract) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <h2 className="text-2xl font-bold text-destructive">Contract not found</h2>
        <p className="text-muted-foreground">The contract you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/contracts')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contracts
        </Button>
      </div>
    );
  }

  const isExpired = isPast(parseISO(contract.endDate));
  const daysToRenewal = formatDistanceToNow(parseISO(contract.renewalDate), { addSuffix: true });
  
  const getStatusBadge = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return null;
    }
  };
  
  const getTypeBadge = (type: Contract['type']) => {
    switch (type) {
      case 'domain':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Domain</Badge>;
      case 'hosting':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">Hosting</Badge>;
      case 'support':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Support</Badge>;
      case 'other':
        return <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200">Other</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate('/contracts')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contracts
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            size="sm"
            onClick={() => setIsRenewDialogOpen(true)}
            disabled={!isExpired && contract.status === 'active'}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Renew
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {contract.name}
                </CardTitle>
                <CardDescription>Contract #{contract.id}</CardDescription>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(contract.status)}
                {getTypeBadge(contract.type)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                <p>{format(parseISO(contract.startDate), 'PPP')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">End Date</p>
                <p>{format(parseISO(contract.endDate), 'PPP')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Renewal Date</p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(parseISO(contract.renewalDate), 'PPP')} ({daysToRenewal})
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="text-xl font-bold">${contract.amount.toFixed(2)}</p>
              </div>
            </div>
            
            {contract.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                <p className="text-sm whitespace-pre-line">{contract.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer ? (
              <>
                <div className="space-y-1">
                  <p className="text-lg font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-sm font-medium">Contact Person</p>
                  <p className="text-sm">{customer.contactPerson}</p>
                </div>
              </>
            ) : (
              <Skeleton className="h-20 w-full" />
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="sm" onClick={() => navigate(`/customers/${contract.customerId}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Customer
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
            <DialogDescription>Make changes to the contract details.</DialogDescription>
          </DialogHeader>
          <ContractEditForm 
            contract={contract} 
            onSuccess={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Renew Dialog */}
      <Dialog open={isRenewDialogOpen} onOpenChange={setIsRenewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Renew Contract</DialogTitle>
            <DialogDescription>Extend this contract with new end and renewal dates.</DialogDescription>
          </DialogHeader>
          <ContractRenewForm 
            contract={contract} 
            onSuccess={() => setIsRenewDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Skeleton loader for the contract detail page
const ContractDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-10 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
    
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Skeleton className="h-64 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

export default ContractDetailPage;
