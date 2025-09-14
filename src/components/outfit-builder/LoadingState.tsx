import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Progress skeleton */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto animate-pulse">
          <span className="text-2xl">✨</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Generating outfit suggestions...</h3>
          <p className="text-muted-foreground text-sm">
            Our AI is creating perfect combinations with your selected item
          </p>
        </div>
      </div>

      {/* Variant skeletons */}
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} className="aspect-square rounded-md" />
              ))}
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}