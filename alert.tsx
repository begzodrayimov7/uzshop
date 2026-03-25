import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Star, MessageSquare, ArrowUpDown, Send } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

type SortMode = "newest" | "highest" | "lowest";

const StarRating = ({
  rating,
  onRate,
  interactive = false,
  size = "h-5 w-5",
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
  size?: string;
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive ? star <= (hover || rating) : star <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            className={`transition-all duration-150 ${
              interactive ? "cursor-pointer hover:scale-125 active:scale-95" : "cursor-default"
            }`}
          >
            <Star
              className={`${size} transition-colors ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/30"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

const ProductReviews = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchReviews = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (data) {
      setReviews(data);
      if (user) {
        setHasReviewed(data.some((r) => r.user_id === user.id));
      }
    }
    setLoading(false);
  }, [productId, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Iltimos, avval tizimga kiring");
      return;
    }
    if (rating === 0) {
      toast.error("Iltimos, baho bering (1-5 yulduz)");
      return;
    }
    if (!comment.trim()) {
      toast.error("Iltimos, izoh yozing");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      user_name: user.name,
      rating,
      comment: comment.trim(),
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("Siz allaqachon bu mahsulotga baho bergansiz");
        setHasReviewed(true);
      } else {
        toast.error("Xatolik yuz berdi");
      }
    } else {
      toast.success("Izohingiz qo'shildi!");
      setRating(0);
      setComment("");
      fetchReviews();
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortMode === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortMode === "highest") return b.rating - a.rating;
    return a.rating - b.rating;
  });

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-primary" />
        Izohlar va baholar
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Summary + Form */}
        <div className="space-y-6">
          {/* Average rating card */}
          <div className="glass-card rounded-xl p-6 text-center">
            <p className="font-display text-5xl font-bold text-foreground">
              {avgRating.toFixed(1)}
            </p>
            <StarRating rating={Math.round(avgRating)} size="h-6 w-6" />
            <p className="text-sm text-muted-foreground mt-2">
              {reviews.length} ta izoh
            </p>

            {/* Rating distribution */}
            <div className="mt-4 space-y-1.5">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-muted-foreground">{star}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all"
                      style={{
                        width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <span className="w-4 text-right text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review form */}
          {!hasReviewed && user ? (
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-4">
              <h3 className="font-display font-semibold text-sm">Izoh qoldiring</h3>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Baho</label>
                <StarRating rating={rating} onRate={setRating} interactive size="h-7 w-7" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Izoh</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Mahsulot haqida fikringiz..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all resize-none text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Send className="h-4 w-4" />
                {submitting ? "Yuborilmoqda..." : "Izoh qoldirish"}
              </button>
            </form>
          ) : hasReviewed ? (
            <div className="glass-card rounded-xl p-6 text-center">
              <p className="text-sm text-muted-foreground">
                ✅ Siz allaqachon izoh qoldirgansiz
              </p>
            </div>
          ) : null}
        </div>

        {/* Right: Reviews list */}
        <div className="lg:col-span-2">
          {/* Sort buttons */}
          {reviews.length > 1 && (
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              {(
                [
                  ["newest", "Eng yangi"],
                  ["highest", "Eng yuqori"],
                  ["lowest", "Eng past"],
                ] as [SortMode, string][]
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sortMode === mode
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : sortedReviews.length === 0 ? (
            <div className="glass-card rounded-xl p-10 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Hali izohlar yo'q</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Birinchi bo'lib izoh qoldiring!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedReviews.map((review, i) => (
                <div
                  key={review.id}
                  className="glass-card rounded-xl p-5 animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground bg-primary">
                        {review.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {review.user_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString("uz-UZ", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="h-4 w-4" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
