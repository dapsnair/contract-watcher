
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  AlertCircle, 
  DollarSign,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchDashboardStats } from '@/services/dataService';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Contract } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend = 0,
  trendLabel = '',
  href = '' 
}: { 
  title: string; 
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  href?: string;
}) => {
  const TrendIcon = trend > 0 ? ArrowUp : trend < 0 ? ArrowDown : undefined;
  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== 0 && (
          <div className="flex items-center mt-1">
            <span className={`text-xs flex items-center gap-0.5 ${trendColor}`}>
              {TrendIcon && <TrendIcon className="h-3 w-3" />}
              {Math.abs(trend)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">{trendLabel}</span>
          </div>
        )}
      </CardContent>
      {href && (
        <CardFooter className="p-2">
          <Link to={href} className="text-xs text-primary flex items-center hover:underline">
            View all <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

const RenewalItem = ({ contract }: { contract: Contract }) => {
  const renewalDate = parseISO(contract.renewalDate);
  const daysUntilRenewal = differenceInDays(renewalDate, new Date());
  let badgeVariant: 'default' | 'secondary' | 'destructive' = 'default';
  
  if (daysUntilRenewal <= 7) {
    badgeVariant = 'destructive';
  } else if (daysUntilRenewal <= 15) {
    badgeVariant = 'secondary';
  }

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <div className="font-medium">{contract.name}</div>
        <div className="text-sm text-muted-foreground">{contract.customerName}</div>
      </div>
      <div className="flex flex-col items-end">
        <Badge variant={badgeVariant} className="mb-1">
          {daysUntilRenewal} {daysUntilRenewal === 1 ? 'day' : 'days'}
        </Badge>
        <div className="text-xs text-muted-foreground">
          ${contract.amount} • {format(renewalDate, 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Failed to load dashboard</h2>
          <p className="text-muted-foreground mb-4">There was an error loading the dashboard data.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <Button variant="outline" className="mr-2">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(), 'MMMM d, yyyy')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-16 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="py-3 border-b last:border-0">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="py-3 border-b last:border-0">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Customers" 
              value={stats?.totalCustomers || 0} 
              icon={Users}
              trend={8}
              trendLabel="from last month"
              href="/customers"
            />
            <StatCard 
              title="Active Contracts" 
              value={stats?.totalContracts || 0} 
              icon={FileText}
              trend={3}
              trendLabel="from last month"
              href="/contracts"
            />
            <StatCard 
              title="Contracts Expiring Soon" 
              value={stats?.expiringContracts || 0} 
              icon={Clock}
              trend={15}
              trendLabel="increase"
              href="/contracts"
            />
            <StatCard 
              title="Total Contract Value" 
              value={`$${stats?.contractsValue.toLocaleString() || 0}`} 
              icon={DollarSign}
              trend={5}
              trendLabel="from last quarter"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Renewals
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {stats?.upcomingRenewals.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No upcoming renewals in the next 30 days
                  </div>
                ) : (
                  stats?.upcomingRenewals.map(contract => (
                    <RenewalItem key={contract.id} contract={contract} />
                  ))
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contracts">View All Contracts</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {stats?.recentNotifications.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No recent notifications
                  </div>
                ) : (
                  stats?.recentNotifications.map(notification => (
                    <div key={notification.id} className="py-3 border-b last:border-0">
                      <div className="flex items-start">
                        <div className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${notification.read ? 'bg-gray-300' : 'bg-primary'}`} />
                        <div>
                          <div className="font-medium">{notification.message}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(parseISO(notification.date), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/notifications">View All Notifications</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
