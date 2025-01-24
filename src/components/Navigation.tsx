import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { to: "/mini-game-center", label: t('nav.home') },
    { to: "/mini-game-center/about", label: t('nav.about') },
    // { to: "/projects", label: "Projects" },
    // { to: "/blog", label: "Blog" },
    // { to: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass py-4" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/mini-game-center" className="text-xl font-semibold hover:opacity-80 transition-opacity">
          {t('nav.title')}
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover-link ${
                location.pathname === link.to ? "after:w-full" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            onClick={() => {
              const nextLang = currentLang === 'en' ? 'zh' : 'en';
              setCurrentLang(nextLang);
              i18n.changeLanguage(nextLang);
            }}
            className="w-[120px] bg-background/40 backdrop-blur-md border-primary/20 hover:bg-background/60 transition-colors"
          >
            {currentLang === 'en' ? 'English' : '中文'}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
