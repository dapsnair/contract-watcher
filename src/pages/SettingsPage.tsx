
import React, { useState } from "react";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  const generalForm = useForm({
    defaultValues: {
      companyName: "Contract Watcher Inc.",
      email: "admin@example.com",
      notifications: true,
    }
  });

  const securityForm = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
      twoFactor: false,
    }
  });

  const onGeneralSubmit = (data: any) => {
    toast.success("General settings updated successfully");
    console.log("General settings data:", data);
  };

  const onSecuritySubmit = (data: any) => {
    toast.success("Security settings updated successfully");
    console.log("Security settings data:", data);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Update your basic account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-4">
                  <FormField
                    control={generalForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Your company name as it appears throughout the application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your primary contact email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Enable email notifications
                          </FormLabel>
                          <FormDescription>
                            Receive email notifications about contract updates and renewals
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded">
                    Save Changes
                  </button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                  <FormField
                    control={securityForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a new password if you wish to change it
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Confirm your new password
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="twoFactor"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Enable Two-Factor Authentication
                          </FormLabel>
                          <FormDescription>
                            Add an extra layer of security to your account
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded">
                    Update Security Settings
                  </button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure what notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-6">
                  <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                    <Checkbox id="contract-expiry" />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="contract-expiry" className="font-medium">
                        Contract Expiry Alerts
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts when contracts are about to expire
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                    <Checkbox id="new-customers" />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="new-customers" className="font-medium">
                        New Customer Notifications
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new customers are added to the system
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                    <Checkbox id="contract-updates" />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="contract-updates" className="font-medium">
                        Contract Updates
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Be informed when contracts are modified or updated
                      </p>
                    </div>
                  </div>
                </div>
                
                <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded">
                  Save Notification Settings
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
