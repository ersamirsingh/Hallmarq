import { Star, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Button } from '../../components/ui';
import StarRating from '../../components/StarRating';

export default function StoreCard({ store, onRate, onViewReviews }) {
  const hasUserRating = Boolean(store.myRating);

  return (
    <Card className="flex flex-col justify-between transition hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{store.name}</CardTitle>
          <Badge variant="secondary" size="sm" className="shrink-0">
            {store.category?.name || 'General'}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {store.address}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Overall rating
          </span>
          <div className="mt-1 flex items-center gap-2">
            <StarRating value={Number(store.rating?.average) || 0} size="sm" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {store.rating?.average || '0.0'}
            </span>
            <span className="text-xs text-slate-400">
              ({store.rating?.count || 0})
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Your rating
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            {hasUserRating ? (
              <>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {store.myRating.value} / 5 stars
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-400 italic">Not rated yet</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewReviews(store)}
          className="text-xs"
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          <span>Reviews</span>
        </Button>
        <Button
          variant={hasUserRating ? 'outline' : 'primary'}
          size="sm"
          onClick={() => onRate(store)}
          className="text-xs"
        >
          <Star className="h-3.5 w-3.5 mr-1" />
          <span>{hasUserRating ? 'Change rating' : 'Rate store'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
