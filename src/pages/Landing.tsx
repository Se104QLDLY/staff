import React from 'react';
import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { Metrics } from '../components/landing/Metrics';
import { Features } from '../components/landing/Features';
import { Team } from '../components/landing/Team';
import { Footer } from '../components/landing/Footer';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Metrics />
        <Features />
        <Team />
      </main>
      <Footer />
    </div>
  );
};

export default Landing; 