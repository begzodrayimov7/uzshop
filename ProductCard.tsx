import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import { Link } from "react-router-dom";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const QUICK_QUESTIONS = [
  "Eng arzon telefon qaysi?",
  "Yetkazib berish bormi?",
  "Yangi mahsulotlar qaysilar?",
  "Quloqchin tavsiya qiling",
];

function parseProductCards(text: string) {
  const parts: Array<{ type: "text"; value: string } | { type: "product"; id: string }> = [];
  const regex = /\[product:(\d+)\]/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: "text", value: text.slice(last, match.index) });
    parts.push({ type: "product", id: match[1] });
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}

const MiniProductCard = ({ productId }: { productId: string }) => {
  const product = products.find((p) => p.id === productId);
  if (!product) return null;
  return (
    <Link
      to={`/product/${product.id}`}
      className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-all my-1 group"
    >
      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
        <p className="text-xs font-bold text-primary">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
    <span className="text-xs text-muted-foreground ml-1">yozmoqda...</span>
  </div>
);

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNewMsg, setHasNewMsg] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setHasNewMsg(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Stream failed");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nlIdx);
          buf = buf.slice(nlIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              const snap = assistantSoFar;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: snap } : m));
                }
                return [...prev, { role: "assistant", content: snap }];
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }

      if (!open) setHasNewMsg(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Kechirasiz, xatolik yuz berdi. Qayta urinib ko'ring 😔" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform duration-200"
        style={{ boxShadow: "var(--glow-primary)" }}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {hasNewMsg && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive animate-pulse" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden flex flex-col glass-card border border-border shadow-2xl animate-scale-in">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-primary/5">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground font-display">UzShop AI</p>
              <p className="text-xs text-muted-foreground">Yordamchi assistant</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                  <Bot className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Salom! 👋</p>
                  <p className="text-xs text-muted-foreground mt-1">Sizga qanday yordam bera olaman?</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant"
                    ? parseProductCards(msg.content).map((part, j) =>
                        part.type === "product" ? (
                          <MiniProductCard key={j} productId={part.id} />
                        ) : (
                          <span key={j}>{part.value}</span>
                        )
                      )
                    : msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-secondary/20 flex-shrink-0 flex items-center justify-center mt-1">
                    <User className="w-4 h-4 text-secondary" />
                  </div>
                )}
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
          </div>

          {/* Quick questions after conversation */}
          {messages.length > 0 && !loading && (
            <div className="px-4 pb-1 flex gap-1.5 overflow-x-auto">
              {QUICK_QUESTIONS.slice(0, 2).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Xabar yozing..."
              disabled={loading}
              className="flex-1 bg-muted rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
