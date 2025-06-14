
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, Loader2 } from 'lucide-react';

const GenerationSkeleton = () => {
  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader className="border-b">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Brain className="h-6 w-6 text-pink-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-pink-400 animate-spin" />
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center space-x-2 pt-4">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerationSkeleton;
