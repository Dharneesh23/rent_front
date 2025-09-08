import React, { useState } from 'react';
import './OnboardingSlides.css';

const slides = [
  {
    image: require('../assets/bike_rental.jpg'),
    title: 'Welcome to RideOn!',
    subtitle: 'Your Trusted Bike & Car Rental Platform',
    description: 'Find the perfect ride for your journey—anytime, anywhere.'
  },
  {
    image: require('../assets/car_rental.jpg'),
    title: 'Wide Range of Vehicles',
    subtitle: 'Bikes, Cars & More',
    description: 'Choose from a variety of vehicles to suit your needs and budget.'
  },
  {
    image: require('../assets/booking.jpg'),
    title: 'Easy Booking',
    subtitle: 'Fast & Hassle-Free',
    description: 'Book your ride in just a few clicks and hit the road!'
  },
  {
    image: require('../assets/support.jpg'),
    title: '24/7 Support',
    subtitle: 'We’re Here for You',
    description: 'Enjoy peace of mind with our dedicated customer support.'
  }
];

export default function OnboardingSlides() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrent((prev) => Math.max(prev - 1, 0));
  const skip = () => setCurrent(slides.length - 1);

  return (
    <div className="onboarding-container">
      <img src={slides[current].image} alt="slide" className="onboarding-image" />
      <div className="onboarding-content">
        <h2>{slides[current].title}</h2>
        <h4>{slides[current].subtitle}</h4>
        <p>{slides[current].description}</p>
        <div className="onboarding-indicators">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={idx === current ? 'active' : ''}
              onClick={() => setCurrent(idx)}
              style={{ cursor: 'pointer' }}
            ></span>
          ))}
        </div>
        <div className="onboarding-actions">
          {current < slides.length - 1 ? (
            <>
              <button className="skip-btn" onClick={skip}>Skip</button>
              <button className="next-btn" onClick={nextSlide}>Next →</button>
            </>
          ) : (
            <button className="get-started-btn" onClick={() => window.location.hash = '#/signup'}>Get Started</button>
          )}
        </div>
      </div>
    </div>
  );
}
