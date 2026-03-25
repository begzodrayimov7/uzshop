export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
};

export const categories = [
  { id: "all", label: "Barchasi" },
  { id: "telefonlar", label: "Telefonlar" },
  { id: "kiyimlar", label: "Kiyimlar" },
  { id: "texnika", label: "Texnika" },
  { id: "aksessuarlar", label: "Aksessuarlar" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    description: "A17 Pro chip, titanium dizayn, 48MP kamera tizimi. Eng kuchli iPhone.",
    price: 15990000,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "telefonlar",
    isNew: true,
    isBestseller: true,
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    description: "Galaxy AI, 200MP kamera, S Pen bilan. Yangi avlod smartfon.",
    price: 14500000,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "telefonlar",
    isNew: true,
  },
  {
    id: "3",
    name: "Klassik Erkaklar Ko'ylagi",
    description: "100% paxta, premium sifat. Har qanday mavsumga mos.",
    price: 350000,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    category: "kiyimlar",
    isBestseller: true,
  },
  {
    id: "4",
    name: "Sport Krossovka Nike",
    description: "Yengil va qulay. Yuqori sifatli sport poyabzal.",
    price: 890000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "kiyimlar",
    isNew: true,
  },
  {
    id: "5",
    name: "MacBook Pro 16\"",
    description: "M3 Pro chip, 18 soat batareya, Liquid Retina XDR display.",
    price: 32000000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    category: "texnika",
    isBestseller: true,
  },
  {
    id: "6",
    name: "Sony WH-1000XM5",
    description: "Eng yaxshi shovqin bekor qiluvchi quloqchin. 30 soat batareya.",
    price: 3200000,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    category: "aksessuarlar",
    isNew: true,
    isBestseller: true,
  },
  {
    id: "7",
    name: "Apple Watch Ultra 2",
    description: "Titanium korpus, GPS + Cellular. Sport va sarguzasht uchun.",
    price: 9800000,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop",
    category: "aksessuarlar",
  },
  {
    id: "8",
    name: "iPad Air M2",
    description: "M2 chip, 11\" Liquid Retina display. Ijod uchun ideal.",
    price: 8900000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    category: "texnika",
    isNew: true,
  },
  {
    id: "9",
    name: "Ayollar Palto",
    description: "Zamonaviy dizayn, issiq va nafis. Kuz-qish mavsumi uchun.",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=400&fit=crop",
    category: "kiyimlar",
  },
  {
    id: "10",
    name: "JBL Charge 5",
    description: "Portativ dinamik, suv o'tkazmaydi. 20 soat batareya.",
    price: 1500000,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    category: "texnika",
    isBestseller: true,
  },
  {
    id: "11",
    name: "Xiaomi 14 Pro",
    description: "Leica kamera, Snapdragon 8 Gen 3. Arzon narxda premium.",
    price: 7200000,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    category: "telefonlar",
  },
  {
    id: "12",
    name: "Charm Bilakuzuk",
    description: "Kumush qoplangan, zamonaviy dizayn. Ajoyib sovg'a.",
    price: 250000,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop",
    category: "aksessuarlar",
    isNew: true,
  },
];

export function formatPrice(price: number): string {
  return price.toLocaleString("uz-UZ") + " so'm";
}
