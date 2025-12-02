'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Check, EyeOff, Trash2, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      const params: any = { limit: 50 };
      if (filter === 'pending') {
        params.isApproved = 'false';
      } else if (filter === 'approved') {
        params.isApproved = 'true';
      } else if (filter === 'hidden') {
        params.isVisible = 'false';
      }

      const response = await adminApi.reviews.getAll(params);
      if (response.success && response.data) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminApi.reviews.approve(id);
      toast.success('Review approved');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const handleHide = async (id: string) => {
    try {
      await adminApi.reviews.hide(id);
      toast.success('Review hidden');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to hide review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await adminApi.reviews.delete(id);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold dark:text-gray-100">Review Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Moderate and manage product reviews
        </p>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <Select value={filter || 'all'} onValueChange={(value) => setFilter(value === 'all' ? '' : value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No reviews yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell className="font-medium">
                    {review.product?.name || 'N/A'}
                  </TableCell>
                  <TableCell>{review.user?.name || 'Anonymous'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!review.isApproved && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      {review.isApproved && !review.isVisible && (
                        <Badge variant="outline">Hidden</Badge>
                      )}
                      {review.isApproved && review.isVisible && (
                        <Badge variant="default">Visible</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!review.isApproved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(review._id)}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {review.isApproved && review.isVisible && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleHide(review._id)}
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(review._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


