import plush from "@/assets/product-plush.jpg";
import plush2 from "@/assets/product-plush2.jpg";
import cosplay from "@/assets/product-cosplay.jpg";
import figure from "@/assets/product-figure.jpg";
import figure2 from "@/assets/product-figure2.jpg";
import accessory from "@/assets/product-accessory.jpg";

export type Category = "plush" | "cosplay" | "figure" | "accessory";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  fandom: string;
  price: number; // IDR
  rating: number;
  stock: number;
  image: string;
  badges?: ("NEW" | "HOT")[];
  description: string;
}

export const CATEGORIES: { id: Category; label: string; emoji: string; tagline: string }[] = [
  { id: "plush", label: "Plush Dolls", emoji: "🧸", tagline: "Cuddle your fave waifu" },
  { id: "cosplay", label: "Cosplay Outfits", emoji: "🥷", tagline: "Become the hero" },
  { id: "figure", label: "Action Figures", emoji: "⚔️", tagline: "Pose. Display. Repeat." },
  { id: "accessory", label: "Accessories", emoji: "🎀", tagline: "Carry the fandom" },
];

export const PRODUCTS: Product[] = [
  {
    id: "1", slug: "chibi-orange-plush", name: "Chibi Orange Hero Plush",
    category: "plush", fandom: "Naruto", price: 249000, rating: 4.9, stock: 3,
    image: plush, badges: ["HOT"],
    description: "Squeezable chibi plush of your favorite orange-clad ninja. Super soft polyester fiber, embroidered eyes, 25cm tall.",
  },
  {
    id: "2", slug: "ninja-cosplay-set", name: "Hidden Leaf Ninja Cosplay Set",
    category: "cosplay", fandom: "Naruto", price: 749000, rating: 4.8, stock: 12,
    image: cosplay, badges: ["NEW"],
    description: "Complete ninja kit: jacket, pants, headband, sandals, kunai prop. Available in sizes S-XL.",
  },
  {
    id: "3", slug: "pirate-king-figure", name: "Pirate King PVC Figure",
    category: "figure", fandom: "One Piece", price: 1290000, rating: 5.0, stock: 7,
    image: figure, badges: ["HOT", "NEW"],
    description: "Highly detailed 28cm PVC figure of the future Pirate King in dynamic action pose. Officially licensed.",
  },
  {
    id: "4", slug: "anime-pin-set", name: "Anime Chibi Pin & Lanyard Set",
    category: "accessory", fandom: "Mixed", price: 159000, rating: 4.7, stock: 42,
    image: accessory,
    description: "8 enamel pins + premium lanyard featuring the biggest characters. Perfect for backpacks and conventions.",
  },
  {
    id: "5", slug: "saiyan-warrior-figure", name: "Super Saiyan Warrior Figure",
    category: "figure", fandom: "Dragon Ball", price: 1450000, rating: 4.9, stock: 5,
    image: figure2, badges: ["HOT"],
    description: "30cm super-articulated figure with energy effect parts and interchangeable hands.",
  },
  {
    id: "6", slug: "kitty-kawaii-plush", name: "Kawaii Kitty Plush",
    category: "plush", fandom: "Original", price: 199000, rating: 4.8, stock: 28,
    image: plush2, badges: ["NEW"],
    description: "Cuddle-grade kitty plush with sparkly eyes. 22cm tall, hypoallergenic stuffing.",
  },
];

export function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
