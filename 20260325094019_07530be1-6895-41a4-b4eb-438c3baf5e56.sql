import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
              <span className="gradient-text">Zamonaviy</span> xaridlar
              <br />tajribasi
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-lg">
              Eng sara mahsulotlar, eng yaxshi narxlar. O'zbekistonning eng ishonchli onlayn do'koni.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: "var(--gradient-primary)" }}
              >
                Xarid qilish <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: "Tez yetkazib berish", desc: "24 soat ichida yetkazamiz" },
            { icon: Shield, title: "Kafolat", desc: "Barcha mahsulotlarga kafolat" },
            { icon: Zap, title: "Tezkor xizmat", desc: "24/7 mijozlar xizmati" },
          ].map((f, i) => (
            <div key={i} className="glass-card rounded-xl p-6 flex items-center gap-4 hover-glow transition-all duration-300">
              <div className="p-3 rounded-lg bg-muted">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Yangi mahsulotlar */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold">
            <span className="gradient-text">Yangi</span> mahsulotlar
          </h2>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">
            Barchasini ko'rish <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((p, i) => (
            <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Eng ko'p sotilgan */}
      <section className="container mx-auto px-4 py-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold">
            Eng ko'p <span className="gradient-text">sotilgan</span>
          </h2>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">
            Barchasini ko'rish <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((p, i) => (
            <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          © 2026 UzShop. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </div>
  );
};

export default Index;
