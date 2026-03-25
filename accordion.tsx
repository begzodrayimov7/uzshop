import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Store, Sun, Moon, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Bosh sahifa" },
  { to: "/products", label: "Mahsulotlar" },
  { to: "/cart", label: "Savat" },
  { to: "/admin", label: "Admin" },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Store className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
          <span className="font-display text-xl font-bold gradient-text">UzShop</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-muted-foreground" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
          </button>
          <Link to="/products" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold animate-scale-in">
                {totalItems}
              </span>
            )}
          </Link>
          {user && (
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Chiqish"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-card border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                  location.pathname === link.to ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
