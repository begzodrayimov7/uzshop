import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CheckCircle,
  CreditCard,
  Banknote,
  Loader2,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

type PaymentMethod = "click" | "payme" | "cash";
type Step = "info" | "payment" | "processing" | "success";

const generateOrderNumber = () => {
  const prefix = "UZ";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const paymentMethods: {
  id: PaymentMethod;
  name: string;
  desc: string;
  colors: [string, string];
  icon: React.ReactNode;
}[] = [
  {
    id: "click",
    name: "Click",
    desc: "Click orqali to'lov",
    colors: ["#00B4E6", "#0095C0"],
    icon: <CreditCard className="h-6 w-6" />,
  },
  {
    id: "payme",
    name: "Payme",
    desc: "Payme orqali to'lov",
    colors: ["#00CCCC", "#009999"],
    icon: <CreditCard className="h-6 w-6" />,
  },
  {
    id: "cash",
    name: "Naqd pul",
    desc: "Yetkazib berishda to'lov",
    colors: ["hsl(190, 90%, 40%)", "hsl(270, 60%, 55%)"],
    icon: <Banknote className="h-6 w-6" />,
  },
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("click");
  const [step, setStep] = useState<Step>("info");
  const [orderNumber, setOrderNumber] = useState("");
  const [progress, setProgress] = useState(0);

  // Redirect if cart empty (except after success)
  useEffect(() => {
    if (items.length === 0 && step === "info") {
      navigate("/cart");
    }
  }, [items, step, navigate]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }
    setStep("payment");
  };

  const handlePay = async () => {
    setStep("processing");
    setProgress(0);

    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);

    // Simulate payment progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 300);

    // Simulate payment delay
    await new Promise((r) => setTimeout(r, 2500));
    clearInterval(interval);
    setProgress(100);

    // Save order to database
    const orderItems = items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    }));

    const { error } = await supabase.from("orders").insert({
      order_number: newOrderNumber,
      user_id: user?.id || null,
      customer_name: form.name.trim(),
      customer_phone: form.phone.trim(),
      customer_address: form.address.trim(),
      items: orderItems,
      total_price: totalPrice,
      payment_method: selectedPayment,
      payment_status: selectedPayment === "cash" ? "pending" : "paid",
    });

    if (error) {
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      setStep("payment");
      return;
    }

    await new Promise((r) => setTimeout(r, 500));
    clearCart();
    setStep("success");
    toast.success("Buyurtmangiz muvaffaqiyatli qabul qilindi!");
  };

  // ─── SUCCESS ────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center animate-scale-in max-w-md">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-30" style={{ background: "var(--gradient-primary)" }} />
            <CheckCircle className="h-24 w-24 text-primary relative" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            To'lov muvaffaqiyatli!
          </h2>
          <p className="text-muted-foreground mt-3">
            Buyurtma raqami:{" "}
            <span className="font-mono font-bold text-foreground">{orderNumber}</span>
          </p>
          <div className="glass-card rounded-xl p-4 mt-6 inline-flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {selectedPayment === "cash"
                ? "Yetkazib berishda naqd to'lov"
                : `${selectedPayment === "click" ? "Click" : "Payme"} orqali to'landi`}
            </span>
          </div>
          <div className="mt-8">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95"
              style={{ background: "var(--gradient-primary)" }}
            >
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PROCESSING ─────────────────────────────────────────────
  if (step === "processing") {
    const method = paymentMethods.find((m) => m.id === selectedPayment)!;
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center animate-scale-in max-w-sm w-full">
          <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            To'lov amalga oshirilmoqda...
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            {method.name} orqali {formatPrice(totalPrice)}
          </p>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: `linear-gradient(90deg, ${method.colors[0]}, ${method.colors[1]})`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            <Clock className="h-3 w-3 inline mr-1" />
            Iltimos, kuting...
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          {step === "payment" && (
            <button
              onClick={() => setStep("info")}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          <h1 className="font-display text-4xl font-bold">
            <span className="gradient-text">
              {step === "info" ? "Buyurtma" : "To'lov"}
            </span>{" "}
            {step === "info" ? "berish" : "usuli"}
          </h1>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {["Ma'lumotlar", "To'lov"].map((label, i) => {
            const active = (step === "info" && i === 0) || (step === "payment" && i === 1);
            const done = step === "payment" && i === 0;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground"
                  }`}
                  style={active || done ? { boxShadow: "var(--glow-primary)" } : {}}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    active || done ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
                {i === 0 && (
                  <div className="flex-1 h-0.5 rounded bg-muted mx-2">
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{
                        width: step === "payment" ? "100%" : "0%",
                        background: "var(--gradient-primary)",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Buyurtma tarkibi
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <span className="text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                </div>
                <span className="text-foreground font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
              <span>Jami</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* ─── STEP: INFO ──────────────────────────────────────── */}
        {step === "info" && (
          <form onSubmit={handleInfoSubmit} className="glass-card rounded-xl p-6 space-y-5 animate-fade-in">
            <h3 className="font-display font-semibold mb-2">Ma'lumotlaringiz</h3>
            {[
              { label: "Ism", key: "name" as const, placeholder: "To'liq ismingiz", type: "text" },
              { label: "Telefon raqam", key: "phone" as const, placeholder: "+998 90 123 45 67", type: "tel" },
              { label: "Manzil", key: "address" as const, placeholder: "Shahar, ko'cha, uy raqami", type: "text" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-sm text-muted-foreground mb-1.5 block">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "var(--gradient-primary)" }}
            >
              Davom etish →
            </button>
          </form>
        )}

        {/* ─── STEP: PAYMENT ───────────────────────────────────── */}
        {step === "payment" && (
          <div className="space-y-6 animate-fade-in">
            {/* Payment method cards */}
            <div className="space-y-3">
              <h3 className="font-display font-semibold">To'lov usulini tanlang</h3>
              {paymentMethods.map((method) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center gap-4 group ${
                      isSelected
                        ? "border-primary shadow-lg"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                    style={isSelected ? { boxShadow: "var(--glow-primary)" } : {}}
                  >
                    {/* Icon */}
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground shrink-0 transition-transform group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${method.colors[0]}, ${method.colors[1]})`,
                      }}
                    >
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-semibold text-foreground">{method.name}</p>
                      <p className="text-xs text-muted-foreground">{method.desc}</p>
                    </div>
                    {/* Radio */}
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? "border-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary animate-scale-in" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment summary */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground text-sm">To'lov usuli</span>
                <span className="text-foreground font-medium text-sm">
                  {paymentMethods.find((m) => m.id === selectedPayment)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground text-sm">Mahsulotlar</span>
                <span className="text-foreground font-medium text-sm">
                  {items.reduce((s, i) => s + i.quantity, 0)} dona
                </span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-display font-bold text-lg">Jami to'lov</span>
                <span className="font-display font-bold text-xl text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              className="w-full py-4 rounded-xl font-bold text-lg text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ background: "var(--gradient-primary)" }}
            >
              <ShieldCheck className="h-5 w-5" />
              {selectedPayment === "cash"
                ? "Buyurtmani tasdiqlash"
                : `${formatPrice(totalPrice)} to'lash`}
            </button>

            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Barcha to'lovlar xavfsiz va himoyalangan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
