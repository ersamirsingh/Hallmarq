import { Star, MessageSquare, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Button } from '../../components/ui';
import StarRating from '../../components/StarRating';

export default function StoreCard({ store, onRate, onViewReviews }) {
  const userRatingValue = typeof store.myRating === 'object' ? store.myRating?.value : store.myRating;
  const hasUserRating = Boolean(userRatingValue && Number(userRatingValue) > 0);
  const avgRating = store.overallRating !== undefined && store.overallRating !== null
    ? store.overallRating
    : (store.rating?.average || 0);
  const reviewCount = store.ratingCount !== undefined && store.ratingCount !== null
    ? store.ratingCount
    : (store.rating?.count || 0);

  return (
    <Card className="flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300 dark:hover:border-slate-700">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
            {store.name}
          </CardTitle>
          <Badge variant="secondary" size="sm" className="shrink-0 tracking-tight">
            {store.category?.name || 'Store'}
          </Badge>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>{store.address}</span>
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Community score
            </span>
            <div className="mt-0.5 flex items-center gap-2">
              <StarRating value={Number(avgRating) || 0} size="sm" />
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {avgRating ? Number(avgRating).toFixed(1) : '0.0'}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Your rating
          </span>
          <div className="flex items-center gap-1.5">
            {hasUserRating ? (
              <Badge variant="rating" size="sm" className="gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{userRatingValue} / 5</span>
              </Badge>
            ) : (
              <span className="text-xs text-slate-400 italic">Not rated yet</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewReviews(store)}
          className="text-xs"
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1 text-slate-400" />
          <span>Reviews ({reviewCount})</span>
        </Button>
        <Button
          variant={hasUserRating ? 'outline' : 'primary'}
          size="sm"
          onClick={() => onRate(store)}
          className="text-xs"
        >
          <Star className={`h-3.5 w-3.5 mr-1 ${hasUserRating ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{hasUserRating ? 'Update rating' : 'Rate store'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
