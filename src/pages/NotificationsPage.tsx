
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  BellRing, 
  Clock,
  User,
  FileText,
  BellOff,
  Check,
  Filter,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchNotifications } from '@/services/dataService';
import { Notification } from '@/types';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterType = 'all' | 'unread' | 'read' | 'contract-expiring' | 'contract-expired' | 'customer-added' | 'other';

const NotificationsPage = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  
  const { data: notifications, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'read') return notification.read;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const expiringCount = notifications?.filter(n => n.type === 'contract-expiring').length || 0;
  const expiredCount = notifications?.filter(n => n.type === 'contract-expired').length || 0;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contract-expiring':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'contract-expired':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'customer-added':
        return <User className="h-5 w-5 text-green-500" />;
      default:
        return <BellRing className="h-5 w-5 text-blue-500" />;
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <BellOff className="h-10 w-10 text-destructive mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Failed to load notifications</h2>
          <p className="text-muted-foreground mb-4">There was an error loading the notification data.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={filter === 'all'}
                onCheckedChange={() => setFilter('all')}
              >
                All Notifications
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter === 'unread'}
                onCheckedChange={() => setFilter('unread')}
              >
                Unread Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter === 'read'}
                onCheckedChange={() => setFilter('read')}
              >
                Read Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter === 'contract-expiring'}
                onCheckedChange={() => setFilter('contract-expiring')}
              >
                Expiring Contracts
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter === 'contract-expired'}
                onCheckedChange={() => setFilter('contract-expired')}
              >
                Expired Contracts
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter === 'customer-added'}
                onCheckedChange={() => setFilter('customer-added')}
              >
                New Customers
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <BellRing className="mr-2 h-4 w-4 text-muted-foreground" />
              Unread Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{unreadCount}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              Expiring Contracts
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{expiringCount}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              Expired Contracts
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{expiredCount}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border-b last:border-0">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-full max-w-md" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notifications found</h3>
              <p className="text-muted-foreground">
                {filter !== 'all' ? 'Try changing your filter' : 'You have no notifications at the moment'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications?.map((notification: Notification) => (
                <div key={notification.id} className={`flex items-start gap-4 p-4 ${!notification.read ? 'bg-blue-50' : ''} hover:bg-muted/50 rounded-md transition-colors`}>
                  <div>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{notification.message}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {format(parseISO(notification.date), 'MMMM d, yyyy - h:mma')}
                    </div>
                    {notification.relatedTo && (
                      <div className="mt-2">
                        <Button asChild variant="outline" size="sm">
                          <Link 
                            to={`/${notification.relatedTo.type === 'customer' ? 'customers' : 'contracts'}${notification.relatedTo.type === 'customer' ? `/${notification.relatedTo.id}` : ''}`}
                          >
                            View {notification.relatedTo.type}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                  <div>
                    {!notification.read && (
                      <Button size="sm" variant="ghost">
                        <Check className="h-4 w-4 mr-1" />
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
