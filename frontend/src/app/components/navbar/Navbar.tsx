"use client";
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import LoginModal from '../login-modal/LoginModal';
import { useAuth } from '@/context/AuthContext'; // Ensure this path is correct
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, userRole, logout } = useAuth(); // Using useAuth hook

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const getLinkClass: (path: string, size?: 'small' | 'medium' | 'large') => string = (
    path: string,
    size: 'small' | 'medium' | 'large' = 'medium'
  ): string => {
    const sizeClass =
      size === 'small'
        ? styles.buttonSmall
        : size === 'large'
        ? styles.buttonLarge
        : styles.buttonMedium;

    return pathname === path
      ? `${styles.activeLink} ${styles.link} ${sizeClass}`
      : `${styles.link} ${sizeClass}`;
  };

  const openLoginModal = () => {
    setIsModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsModalOpen(false);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.flexContainer}>
          <div className={styles.logoContainer}>
            <img className={styles.logo} src="/Blastey_cover.png" alt="Logo" />
          </div>
          <div className={styles.desktopMenuLangage}>
            <div className={styles.desktopMenu}>
              <button onClick={() => navigate('/home')} className={getLinkClass('/home', 'medium')}>
                {t('home.home')}
              </button>

              {/* Conditionally render links based on authentication and role */}
              {isAuthenticated ? (
                <>
                  {userRole === 'admin' && (
                    <button onClick={() => navigate('/admin')} className={getLinkClass('/admin', 'medium')}>
                      {t('admin.admin')}
                    </button>
                  )}
                  <button onClick={logout} className={getLinkClass('/logout', 'medium')}>
                    {t('logout.logout')}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/trips')} className={getLinkClass('/trips', 'medium')}>
                    {t('trips.trips')}
                  </button>
                  <button onClick={() => navigate('/activities')} className={getLinkClass('/activities', 'medium')}>
                    {t('activities.activities')}
                  </button>
                  <button onClick={openLoginModal} className={getLinkClass('/login', 'medium')}>
                    {t('login.login')}
                  </button>
                </>
              )}
            </div>

            <div className={styles.languageSelector}>
              <select value={i18n.language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          <div className={styles.mobileMenuButton}>
            <button onClick={toggleMenu} type="button">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <button onClick={() => navigate('/home')} className={getLinkClass('/home', 'medium')}>
            {t('home')}
          </button>

          {isAuthenticated ? (
            <>
              {userRole === 'admin' && (
                <button onClick={() => navigate('/admin')} className={getLinkClass('/admin', 'medium')}>
                  {t('admin.admin')}
                </button>
              )}
              <button onClick={logout} className={getLinkClass('/logout', 'medium')}>
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/trips')} className={getLinkClass('/trips', 'medium')}>
                {t('trips.trips')}
              </button>
              <button onClick={() => navigate('/activities')} className={getLinkClass('/activities', 'medium')}>
                {t('activities.activities')}
              </button>
              <button onClick={openLoginModal} className={getLinkClass('/login', 'medium')}>
                {t('login')}
              </button>
            </>
          )}
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isModalOpen} onClose={closeLoginModal} />
    </nav>
  );
}
