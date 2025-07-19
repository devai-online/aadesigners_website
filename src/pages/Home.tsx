import React from 'react';
import Hero from '../components/Hero';
import Portfolio from '../components/Portfolio';
import Process from '../components/Process';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <div>
      <Hero />
      <Portfolio />
      <Process />
      <Stats />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Home;