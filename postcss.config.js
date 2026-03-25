import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRODUCTS_CONTEXT = `
Bizning do'kon mahsulotlari:

TELEFONLAR:
1. iPhone 15 Pro Max - 15,990,000 so'm (YANGI, BESTSELLER) - A17 Pro chip, titanium dizayn, 48MP kamera
2. Samsung Galaxy S24 Ultra - 14,500,000 so'm (YANGI) - Galaxy AI, 200MP kamera, S Pen
3. Xiaomi 14 Pro - 7,200,000 so'm - Leica kamera, Snapdragon 8 Gen 3

KIYIMLAR:
4. Klassik Erkaklar Ko'ylagi - 350,000 so'm (BESTSELLER) - 100% paxta, premium sifat
5. Sport Krossovka Nike - 890,000 so'm (YANGI) - Yengil va qulay
6. Ayollar Palto - 1,200,000 so'm - Zamonaviy dizayn, kuz-qish mavsumi

TEXNIKA:
7. MacBook Pro 16" - 32,000,000 so'm (BESTSELLER) - M3 Pro chip, 18 soat batareya
8. iPad Air M2 - 8,900,000 so'm (YANGI) - M2 chip, 11" Liquid Retina display
9. JBL Charge 5 - 1,500,000 so'm (BESTSELLER) - Portativ dinamik, suv o'tkazmaydi

AKSESSUARLAR:
10. Sony WH-1000XM5 - 3,200,000 so'm (YANGI, BESTSELLER) - Eng yaxshi shovqin bekor qiluvchi quloqchin
11. Apple Watch Ultra 2 - 9,800,000 so'm - Titanium korpus, GPS + Cellular
12. Charm Bilakuzuk - 250,000 so'm (YANGI) - Kumush qoplangan

YETKAZIB BERISH:
- Toshkent bo'ylab 1-2 kun ichida yetkazib beriladi
- Viloyatlarga 3-5 kun ichida
- 500,000 so'mdan ortiq buyurtmalarga bepul yetkazib berish
- To'lov: Naqd, karta, Click, Payme

QAYTARISH:
- 14 kun ichida qaytarish mumkin
- Mahsulot ishlatilmagan bo'lishi kerak
`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Sen UzShop do'konining yordamchi AI assistantisan. Foydalanuvchilarga o'zbek tilida javob ber. Doim samimiy, qisqa va aniq javob ber.

${PRODUCTS_CONTEXT}

MUHIM QOIDALAR:
- Har doim o'zbek tilida javob ber
- Narxlarni so'm da ko'rsat (masalan: 15,990,000 so'm)
- Agar foydalanuvchi mahsulot so'rasa, tegishli mahsulotlarni tavsiya qil
- Mahsulot tavsiya qilganda, product ID ni ham ko'rsat: [product:ID] formatida (masalan [product:1])
- Yetkazib berish haqida so'rasa, aniq ma'lumot ber
- Doim xushmuomala bo'l va emoji ishlat 😊
- Javoblarni qisqa tut, 2-3 jumla yetarli`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "So'rovlar limiti oshdi, keyinroq urinib ko'ring." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredit tugadi." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI xatolik yuz berdi" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Noma'lum xatolik" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
