import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground">Savat bo'sh</h2>
          <p className="text-muted-foreground mt-2">Mahsulotlarni qo'shing</p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-primary-foreground transition-all hover:scale-105"
            style={{ background: "var(--gradient-primary)" }}
          >
            Xarid qilish <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold mb-8">
          <span className="gradient-text">Savat</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="glass-card rounded-xl p-4 flex gap-4 animate-fade-in">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`} className="font-display font-semibold text-foreground hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="self-start p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass-card rounded-xl p-6 h-fit sticky top-24">
            <h3 className="font-display text-xl font-bold mb-4">Buyurtma xulosasi</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Mahsulotlar</span>
                <span>{items.reduce((s, i) => s + i.quantity, 0)} dona</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Yetkazib berish</span>
                <span className="text-primary">Bepul</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-foreground font-bold text-lg">
                <span>Jami</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-primary-foreground transition-all hover:scale-105"
              style={{ background: "var(--gradient-primary)" }}
            >
              Buyurtma berish <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
