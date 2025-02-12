import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    const lang = location.pathname.endsWith('/zh') ? 'zh' : 'en';
    if (lang !== currentLang) {
      setCurrentLang(lang);
      i18n.changeLanguage(lang);
    }
  }, [location.pathname, currentLang, i18n]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLocalizedPath = (path: string) => {
    const basePath = path.replace(/\/(en|zh)$/, '');
    return `${basePath}/${currentLang}`;
  };

  console.log(currentLang,'sasas');
  

  const handleLanguageChange = () => {
    const nextLang = currentLang === 'en' ? 'zh' : 'en';
    const newPath = location.pathname.replace(/\/(en|zh)$/, `/${nextLang}`);
    i18n.changeLanguage(nextLang);
    setCurrentLang(nextLang);
    navigate(newPath, { replace: true });
  };

  const links = [
    { to: "/mini-game-center", label: t('nav.home') },
    { to: "/mini-game-center/about", label: t('nav.about') },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass py-4" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to={getLocalizedPath("/mini-game-center")} className="text-xl font-semibold hover:opacity-80 transition-opacity">
          {t('nav.title')}
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={getLocalizedPath(link.to)}
              className={`hover-link ${
                location.pathname === getLocalizedPath(link.to) ? "after:w-full" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            onClick={handleLanguageChange}
            className="w-[120px] bg-background/40 backdrop-blur-md border-primary/20 hover:bg-background/60 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            {currentLang === 'en' ? 'English' : '中文'}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
