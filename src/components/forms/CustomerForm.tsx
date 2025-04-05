
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
import { useMutation } from '@tanstack/react-query';
import { addCustomer } from '@/services/dataService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Customer } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Company name must be at least 2 characters.',
  }),
  contactPerson: z.string().min(2, {
    message: 'Contact person must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().min(5, {
    message: 'Please enter a valid phone number.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  status: z.enum(['active', 'inactive'], {
    required_error: 'Please select a status',
  }),
});

type CustomerFormValues = z.infer<typeof formSchema>;

interface CustomerFormProps {
  onSuccess?: () => void;
}

const CustomerForm = ({ onSuccess }: CustomerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CustomerFormValues) => {
      // Ensure all required fields are passed as non-optional
      const customerData: Omit<Customer, 'id' | 'createdAt'> = {
        name: values.name,
        contactPerson: values.contactPerson,
        email: values.email,
        phone: values.phone,
        address: values.address,
        status: values.status,
      };
      return addCustomer(customerData);
    },
    onSuccess: () => {
      toast.success('Customer added successfully');
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Failed to add customer');
      console.error('Error adding customer:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: CustomerFormValues) {
    setIsSubmitting(true);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="ACME Corporation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="info@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Main St, Anytown, USA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                      <RadioGroupItem value="inactive" />
                    </FormControl>
                    <FormLabel className="font-normal">Inactive</FormLabel>
                  </FormItem>
                </RadioGroup>
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
            Add Customer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;
