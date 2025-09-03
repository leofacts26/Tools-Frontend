import { useGlobalContext } from '@/context/context';
import phoneImg from '../images/phone.svg';
console.log(phoneImg, "phoneImg");

const Hero = () => {
  const { closeSubmenu } = useGlobalContext();
  return (
    <section className='hero' onMouseOver={closeSubmenu}>
      <div className='hero-center'>
        <article className='hero-info'>
          <h1>
            Free Online Tools for Everyone,  <br />
            Everywhere
          </h1>
          <p>
            Millions of companies of all sizes—from startups to Fortune 500s—use
            Stripe’s software and APIs to accept payments, send payouts, and
            manage their businesses online.
          </p>
          <button className='btn'>Start now</button>
        </article>
        <article className='hero-images'>
          <img src={phoneImg.src} className='phone-img' alt='phone' />
        </article>
      </div>
    </section>
  );
};

export default Hero;
