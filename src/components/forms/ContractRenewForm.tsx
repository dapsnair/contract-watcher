
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateContract } from '@/services/dataService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { format, addYears, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Contract } from '@/types';

const formSchema = z.object({
  endDate: z.date({
    required_error: 'Please select a new end date.',
  }),
  renewalDate: z.date({
    required_error: 'Please select a new renewal date.',
  }),
  amount: z.coerce.number().positive({
    message: 'Amount must be a positive number.',
  }),
}).refine(data => {
  return data.renewalDate <= data.endDate;
}, {
  message: 'Renewal date must be on or before end date',
  path: ['renewalDate'],
});

type RenewFormValues = z.infer<typeof formSchema>;

interface ContractRenewFormProps {
  contract: Contract;
  onSuccess?: () => void;
}

const ContractRenewForm = ({ contract, onSuccess }: ContractRenewFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Get current end date and add one year for the default new dates
  const currentEndDate = parseISO(contract.endDate);
  const newEndDate = addYears(currentEndDate, 1);
  const newRenewalDate = addYears(parseISO(contract.renewalDate), 1);

  const form = useForm<RenewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endDate: newEndDate,
      renewalDate: newRenewalDate,
      amount: contract.amount,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: RenewFormValues) => {
      // Update the contract with new end date, renewal date, and amount
      const contractData: Partial<Contract> = {
        endDate: values.endDate.toISOString(),
        renewalDate: values.renewalDate.toISOString(),
        amount: values.amount,
        status: 'active', // Set status to active when renewed
      };
      
      return updateContract(contract.id, contractData);
    },
    onSuccess: () => {
      toast.success('Contract renewed successfully');
      queryClient.invalidateQueries({ queryKey: ['contract', contract.id] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Failed to renew contract');
      console.error('Error renewing contract:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: RenewFormValues) {
    setIsSubmitting(true);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-primary">
            <RefreshCw className="h-5 w-5" />
            <h3 className="text-lg font-medium">Renew Contract: {contract.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Current contract ends on {format(parseISO(contract.endDate), "PPP")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>New End Date</FormLabel>
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
                <FormLabel>New Renewal Date</FormLabel>
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Amount</FormLabel>
                <FormControl>
                  <Input placeholder="100.00" type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Renew Contract
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContractRenewForm;
