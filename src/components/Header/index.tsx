import Link from 'next/link';

import styles from './header.module.scss';

export function Header(): React.ReactElement {
  return (
    <header className={styles.container}>
      <div className={styles.header}>
        <Link href="/">
          <img src="/logo.svg" width="250" height="20" alt="logo" />
        </Link>
      </div>
    </header>
  );
}
