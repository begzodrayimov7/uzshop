import { Link } from "react-router-dom";
import { ShoppingCart, Sparkles, Flame } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  return (
    <div className="glass-card rounded-xl overflow-hidden group hover-glow transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              <Sparkles className="h-3 w-3" /> Yangi
            </span>
          )}
          {product.isBestseller && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
              <Flame className="h-3 w-3" /> Top
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-display font-bold text-primary text-lg">{formatPrice(product.price)}</span>
          <button
            onClick={() => addToCart(product)}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
