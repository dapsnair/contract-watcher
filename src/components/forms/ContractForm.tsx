
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addContract, fetchCustomers } from '@/services/dataService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Contract } from '@/types';

const formSchema = z.object({
  customerId: z.string().min(1, {
    message: 'Please select a customer.',
  }),
  type: z.enum(['domain', 'hosting', 'support', 'other'], {
    required_error: 'Please select a contract type',
  }),
  name: z.string().min(2, {
    message: 'Contract name must be at least 2 characters.',
  }),
  startDate: z.date({
    required_error: 'Please select a start date.',
  }),
  endDate: z.date({
    required_error: 'Please select an end date.',
  }),
  renewalDate: z.date({
    required_error: 'Please select a renewal date.',
  }),
  amount: z.coerce.number().positive({
    message: 'Amount must be a positive number.',
  }),
  status: z.enum(['active', 'expired', 'pending'], {
    required_error: 'Please select a status',
  }),
  notes: z.string().optional(),
}).refine(data => {
  return data.endDate > data.startDate;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine(data => {
  return data.renewalDate <= data.endDate;
}, {
  message: 'Renewal date must be on or before end date',
  path: ['renewalDate'],
});

type ContractFormValues = z.infer<typeof formSchema>;

interface ContractFormProps {
  onSuccess?: () => void;
  customerId?: string;
}

const ContractForm = ({ onSuccess, customerId }: ContractFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: customerId || '',
      type: 'domain',
      name: '',
      status: 'active',
      notes: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ContractFormValues) => {
      const customer = customers?.find(c => c.id === values.customerId);
      
      // Ensure all required fields are passed as non-optional
      const contractData: Omit<Contract, 'id'> = {
        customerId: values.customerId,
        customerName: customer?.name || '',
        type: values.type,
        name: values.name,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        renewalDate: values.renewalDate.toISOString(),
        amount: values.amount,
        status: values.status,
        notes: values.notes,
      };
      
      return addContract(contractData);
    },
    onSuccess: () => {
      toast.success('Contract added successfully');
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Failed to add contract');
      console.error('Error adding contract:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: ContractFormValues) {
    setIsSubmitting(true);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!!customerId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers?.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="domain">Domain Registration</SelectItem>
                    <SelectItem value="hosting">Hosting/Server</SelectItem>
                    <SelectItem value="support">Support/Maintenance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. example.com Domain" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="100.00" type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="renewalDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Renewal Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="active" />
                    </FormControl>
                    <FormLabel className="font-normal">Active</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="pending" />
                    </FormControl>
                    <FormLabel className="font-normal">Pending</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expired" />
                    </FormControl>
                    <FormLabel className="font-normal">Expired</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes about this contract" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Contract
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContractForm;
