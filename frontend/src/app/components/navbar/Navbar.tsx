"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import LoginModal from '../login-modal/LoginModal';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, userRole, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Extract the first segment of the pathname
    const pathSegments = pathname.split('/');
    const firstSegment = pathSegments[1] || '/'; // Default to '/' if no segment
    setActivePath('/' + firstSegment);  // Update activePath with leading slash
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const getLinkClass = useCallback(
    (path: string, size: 'small' | 'medium' | 'large' = 'medium'): string => {
      const sizeClass =
        size === 'small'
          ? styles.buttonSmall
          : size === 'large'
          ? styles.buttonLarge
          : styles.buttonMedium;

      return activePath === path
        ? `${styles.activeLink} ${styles.link} ${sizeClass}`
        : `${styles.link} ${sizeClass}`;
    },
    [activePath]
  );

  const openLoginModal = () => {
    setIsModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsModalOpen(false);
  };

  const handleLanguageChange = (newLanguage: string) => {
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
              <Link href="/" className={getLinkClass('/')}>
                {t('navbar.home')}
              </Link>

              {isAuthenticated ? (
                <>
                  {userRole === 'admin' && (
                    <Link href="/admin" className={getLinkClass('/admin')}>
                      {t('admin.admin')}
                    </Link>
                  )}
                  <Link href="/trips" className={getLinkClass('/trips')}>
                    {t('navbar.trips')}
                  </Link>
                  <button onClick={logout} className={getLinkClass('/dashboard')}>
                    {t('navbar.dashboard')}
                  </button>
                  <button onClick={logout} className={getLinkClass('/manage-trips')}>
                    {t('navbar.manage-trips')}
                  </button>
                  <button onClick={logout} className={getLinkClass('/profile')}>
                    {t('navbar.profile')}
                  </button>
                  <button onClick={logout} className={getLinkClass('/logout')}>
                    {t('navbar.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/trips" className={getLinkClass('/trips')}>
                    {t('trips.trips')}
                  </Link>
                  <button className={getLinkClass('/login')} onClick={openLoginModal}>
                    {t('navbar.login')}
                  </button>
                </>
              )}
            </div>

            {/* Remove language selector from here in desktop view */}
            {!isMobile && (
              <div className={styles.languageSelector}>
                {/* Language Select */}
                <select
                  value={i18n.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className={styles.languageSelect}
                >
                  <option value="en">EN</option>
                  <option value="fr">FR</option>
                </select>
              </div>
            )}
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

      {isOpen && (
        <div className={styles.mobileMenu}>
          <button onClick={() => navigate('/home')} className={getLinkClass('/home', 'medium')}>
            {t('navbar.home')}
          </button>

          {isAuthenticated ? (
            <>
              {userRole === 'admin' && (
                <button onClick={() => navigate('/admin')} className={getLinkClass('/admin', 'medium')}>
                  {t('admin.admin')}
                </button>
              )}
              <button onClick={() => navigate('/trips')} className={getLinkClass('/trips', 'medium')}>
                {t('navbar.trips')}
              </button>
              <button onClick={logout} className={styles.desktopMenu}>
                {t('navbar.dashboard')}
              </button>
              <button onClick={logout} className={styles.desktopMenu}>
                {t('navbar.manage-trips')}
              </button>
              <button onClick={logout} className={styles.navbarButton}>
                {t('navbar.profile')}
              </button>
              <button onClick={logout} className={styles.navbarButton}>
                {t('navbar.logout')}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/trips')} className={getLinkClass('/trips', 'medium')}>
                {t('navbar.trips')}
              </button>
              <button onClick={openLoginModal} className={getLinkClass('/login', 'medium')}>
                {t('navbar.login')}
              </button>
            </>
          )}
          {/* Add language selector to the mobile menu */}
          <div className={styles.languageSelector}>
            {/* Language Select */}
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className={styles.languageSelect}
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isModalOpen} onClose={closeLoginModal} />
    </nav>
  );
}