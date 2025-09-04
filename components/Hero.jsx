"use client";

import { useGlobalContext } from '@/context/context';
import phoneImg from '../images/phone.svg';
import React from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslations } from 'next-intl';


const Hero = () => {
  const { closeSubmenu } = useGlobalContext();
  const theme = React.useContext(ThemeContext);
  const t = useTranslations();

  return (
    <section className={`hero ${theme.mode === 'dark' ? 'hero-dark' : 'hero-light'}`} onMouseOver={closeSubmenu}>
      <div className='hero-center'>
        <article className='hero-info'>
          <h1>
            {t('siteTitle')}
          </h1>
          <p>
            {t('tagline')}
          </p>
          <button className='btn'>startNow</button>
          <button className='btn theme-toggle-btn' onClick={theme.toggleTheme} style={{ marginLeft: '1rem' }}>
            {theme.mode === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </article>
        <article className='hero-images'>
          <img src={phoneImg.src} className='phone-img' alt='phone' />
        </article>
      </div>
    </section>
  );
};

export default Hero;
