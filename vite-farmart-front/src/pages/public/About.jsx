import React from "react";
import PublicLayout from "../../layouts/PublicLayout";

function About() {
  return (
    <PublicLayout>
      <div className="page about-page">
        <h1 className="page-title">About Farmart</h1>

        <p className="page-text">
          Welcome to <strong>Farmart</strong> the ultimate online marketplace designed to bridge the gap 
          between farmers and consumers. Our platform makes it easier than ever to buy and sell farm products 
          and agricultural equipment with confidence.
        </p>

        <p className="page-text">
          At Farmart, we believe in supporting local farmers and promoting sustainable agriculture. 
          Whether you are a farmer looking to reach more customers or a buyer searching for fresh produce 
          and quality equipment, Farmart is the place to be.
        </p>

        <h2 className="section-title">Our Mission</h2>
        <p className="page-text">
          Our mission is to empower farmers by providing them with a reliable platform to sell their products, 
          while giving customers access to fresh, high-quality farm goods. We strive to create a seamless, 
          transparent, and trustworthy marketplace where agriculture meets technology.
        </p>

        <h2 className="section-title">Why Choose Farmart?</h2>
        <ul className="page-list">
          <li>Direct connection with verified farmers</li>
          <li>Wide variety of farm products and equipment</li>
          <li>Affordable prices and competitive offers</li>
          <li>Secure and user-friendly platform</li>
          <li>Commitment to sustainability and quality</li>
        </ul>

        <p className="page-text">
          Join Farmart today and be part of a community that values quality, transparency, and the growth of local agriculture.
        </p>
      </div>
    </PublicLayout>
  );
}

export default About;
