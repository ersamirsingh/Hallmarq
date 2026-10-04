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
    <Card className="flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 hover:border-slate-300 dark:hover:border-[#383838]">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-[#FFFFFF] leading-snug">
            {store.name}
          </CardTitle>
          <Badge variant="category" size="sm" className="shrink-0 tracking-tight">
            {store.category?.name || 'Store'}
          </Badge>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#9A9A9A] line-clamp-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-[#9A9A9A]" />
          <span>{store.address}</span>
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3 dark:bg-[#151515] border border-slate-100 dark:border-[#262626]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-[#9A9A9A]">
              Community score
            </span>
            <div className="mt-0.5 flex items-center gap-2">
              <StarRating value={Number(avgRating) || 0} size="sm" />
              <span className="text-base font-bold text-slate-900 dark:text-[#FFFFFF]">
                {avgRating ? Number(avgRating).toFixed(1) : '0.0'}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-500 dark:text-[#9A9A9A] font-medium">
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-2.5 dark:border-[#262626] dark:bg-[#151515]">
          <span className="text-[11px] font-medium text-slate-500 dark:text-[#9A9A9A]">
            Your rating
          </span>
          <div className="flex items-center gap-1.5">
            {hasUserRating ? (
              <Badge variant="rating" size="sm" className="gap-1">
                <Star className="h-3 w-3 fill-[#FF7A3D] text-[#FF7A3D]" />
                <span>{userRatingValue} / 5</span>
              </Badge>
            ) : (
              <span className="text-xs text-slate-400 dark:text-[#9A9A9A] italic">Not rated yet</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t border-slate-100 pt-3 dark:border-[#262626]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewReviews(store)}
          className="text-xs dark:text-[#9A9A9A] dark:hover:text-[#FFFFFF]"
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1 text-slate-400 dark:text-[#9A9A9A]" />
          <span>Reviews ({reviewCount})</span>
        </Button>
        <Button
          variant={hasUserRating ? 'outline' : 'primary'}
          size="sm"
          onClick={() => onRate(store)}
          className="text-xs"
        >
          <Star className={`h-3.5 w-3.5 mr-1 ${hasUserRating ? 'fill-[#FF7A3D] text-[#FF7A3D]' : ''}`} />
          <span>{hasUserRating ? 'Update rating' : 'Rate store'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
