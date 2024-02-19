import React from 'react';
import styles from './resultpage.module.css';
import { Link } from 'react-router-dom';

export function Resultpage() {
  return (
    <div className={styles.block_body}>
      <h1>Данные были успешно отправлены</h1>
      <Link className='buttons_link' to={'*'}>На главную</Link>
    </div>
  );
}
