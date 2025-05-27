import React from 'react';
import Head from 'next/head';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Location Matcher',
  description = 'Match and analyze location data'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.layout}>
        <header className={styles.header}>
          <div className="container">
            <div className={styles.headerContent}>
              <div className={styles.logo}>
                <h1>Location Matcher</h1>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          {children}
        </main>

        <footer className={styles.footer}>
          <div className="container">
            <div className={styles.footerContent}>
              <p>&copy; 2024 Location Matcher</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;