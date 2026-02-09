import { Link } from "react-scroll";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { IconeCarrinho } from "../icons";
import { useNavigate } from "@tanstack/react-router";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { to: "home", label: "Início" },
    { to: "location", label: "Localização" },
    { to: "products", label: "Lista de Presentes" },
    { to: "rsvp", label: "Confirmar Presença" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "bg-transparent py-6"
      }`}
      style={
        scrolled
          ? {
              backgroundColor: "rgba(250, 248, 243, 0.5)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              boxShadow: "0 8px 40px rgba(45, 74, 62, 0.12)",
            }
          : undefined
      }
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link
          to="home"
          smooth={true}
          duration={800}
          className="cursor-pointer group"
        >
          <span
            className={`font-accent text-4xl transition-colors duration-300 ${
              scrolled ? "text-forest" : "text-cream"
            } group-hover:text-terracotta`}
          >
            M & N
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              smooth={false}
              duration={800}
              offset={-80}
              spy={true}
              onSetActive={() => setActiveSection(item.to)}
              className={`relative cursor-pointer font-body text-sm tracking-widest uppercase transition-all duration-300 ${
                scrolled
                  ? "text-forest-dark hover:text-terracotta"
                  : "text-cream/90 hover:text-cream"
              } ${activeSection === item.to ? "font-semibold" : ""}`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-terracotta transition-all duration-300 ${
                  activeSection === item.to ? "w-full" : "w-0"
                }`}
              />
            </Link>
          ))}

          <button
            onClick={() => navigate({ to: "/lista2026" })}
            className={`relative cursor-pointer font-body text-sm tracking-widest uppercase transition-all duration-300 ${
              scrolled
                ? "text-forest-dark hover:text-terracotta"
                : "text-cream/90 hover:text-cream"
            } font-semibold`}
          >
            LISTA CONFIRMADOS
            <span className="absolute -bottom-1 left-0 h-px bg-terracotta w-full transition-all duration-300" />
          </button>
        </div>

        <button
          onClick={openCart}
          className="hidden md:flex relative p-2 hover:bg-white/10 rounded-lg transition items-center justify-center cursor-pointer"
          aria-label="Ver carrinho de compras"
        >
          <IconeCarrinho
            className={`w-6 h-6 transition-colors duration-300 ${
              scrolled ? "text-forest-dark" : "text-cream"
            }`}
          />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {itemCount}
            </span>
          )}
        </button>

        <div className="md:hidden flex items-center gap-2">
          <button
            className="flex flex-col items-center justify-center w-10 h-10 gap-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                scrolled ? "text-forest-dark" : "text-cream"
              } ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                scrolled ? "text-forest-dark" : "text-cream"
              } ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                scrolled ? "text-forest-dark" : "text-cream"
              } ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>

          <button
            onClick={() => {
              openCart();
              setMobileMenuOpen(false);
            }}
            className="relative p-2 hover:bg-white/10 rounded-lg transition items-center justify-center cursor-pointer"
            aria-label="Ver carrinho de compras"
          >
            <IconeCarrinho
              className={`w-6 h-6 transition-colors duration-300 ${
                scrolled ? "text-forest-dark" : "text-cream"
              }`}
            />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        style={
          mobileMenuOpen
            ? {
                backgroundColor: "rgba(250, 248, 243, 0.98)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 8px 40px rgba(45, 74, 62, 0.12)",
              }
            : undefined
        }
      >
        <nav className="flex flex-col items-center py-8 gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              smooth={false}
              duration={800}
              offset={-80}
              spy={true}
              onSetActive={() => {
                setActiveSection(item.to);
                setMobileMenuOpen(false);
              }}
              className={`relative cursor-pointer font-body text-base tracking-widest uppercase transition-all duration-300 ${
                activeSection === item.to
                  ? "text-terracotta font-semibold"
                  : "text-forest-dark hover:text-terracotta"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <button
            onClick={() => {
              navigate({ to: "/lista2026" });
              setMobileMenuOpen(false);
            }}
            className="relative cursor-pointer font-body text-base tracking-widest uppercase transition-all duration-300 text-terracotta font-semibold"
          >
            LISTA CONFIRMADOS
            <span className="absolute -bottom-1 left-0 h-px bg-terracotta w-full transition-all duration-300" />
          </button>
        </nav>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-sage-muted), transparent)",
        }}
      />
    </header>
  );
}
