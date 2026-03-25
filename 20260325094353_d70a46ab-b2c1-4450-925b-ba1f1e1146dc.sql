import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Store, UserPlus, LogIn } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Login = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Ismingizni kiriting");
      return;
    }
    if (pin.length !== 6) {
      toast.error("6 xonali kodni to'liq kiriting");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const success = await register(name, pin);
        if (success) {
          toast.success("Ro'yxatdan o'tdingiz!");
        } else {
          toast.error("Bu ism allaqachon mavjud");
        }
      } else {
        const success = await login(name, pin);
        if (success) {
          toast.success("Xush kelibsiz!");
        } else {
          toast.error("Ism yoki kod noto'g'ri");
        }
      }
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="glass-card rounded-2xl p-8 w-full max-w-md relative z-10 animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Store className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold gradient-text">UzShop</span>
          </div>
          <h1 className="font-display text-xl font-semibold text-foreground">
            {isRegister ? "Ro'yxatdan o'tish" : "Kirish"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isRegister ? "Ismingiz va 6 xonali kod kiriting" : "Ismingiz va kodingizni kiriting"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Ismingiz</label>
            <input
              type="text"
              placeholder="To'liq ismingiz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={loading}
            />
          </div>

          {/* PIN input */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">6 xonali kod</label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={pin} onChange={setPin} disabled={loading}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg font-semibold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : isRegister ? (
              <>
                <UserPlus className="h-5 w-5" />
                Ro'yxatdan o'tish
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Kirish
              </>
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setPin("");
            }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isRegister ? "Akkauntingiz bormi? " : "Akkauntingiz yo'qmi? "}
            <span className="text-primary font-medium">
              {isRegister ? "Kirish" : "Ro'yxatdan o'tish"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
