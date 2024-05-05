import Image from 'next/legacy/image';
import { Nav } from '../Nav';
import styles from './Header.module.scss';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const Header = () => {
  const [linkTarget, setLinkTarget] = useState('/');

  useEffect(() => {
    setLinkTarget(!window.userid ? '/' : '/joined');
  }, []);

  return (
    <header className={`w-full px-8 py-4 gap-4 flex justify-between items-center z-1 ${styles.header}`}>
      <Link href={linkTarget}>
        <div style={{ minWidth: '119px' }}>
          <Image height={48} width={119} src="/images/logo.svg" alt="DAOnation" />
        </div>
      </Link>
      <Nav />
    </header>
  );
};

export default Header;
