import React from "react";
import PublicLayout from "../../layouts/PublicLayout";
import CategoryCard from "../../components/ui/CategoryCard";
import heroImage from "../../assets/images/hero-bg.jpg"; // Place your hero image in assets/images

function Home() {
  const featuredCategories = [
    { id: 1, name: "Vegetables", description: "Fresh and organic vegetables from local farms" },
    { id: 2, name: "Fruits", description: "Seasonal fruits handpicked by farmers" },
    { id: 3, name: "Farm Equipment", description: "Tools and equipment for efficient farming" },
  ];

  const missionText = `At Farmart, our mission is to connect local farmers directly with buyers,
  providing fresh produce, sustainable products, and quality farm equipment.
  We aim to empower farmers while offering customers the best products at fair prices.`;

  return (
    <PublicLayout>
      <div className="page home-page">
        <header className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Farmart</h1>
            <p className="hero-text">
              Fresh produce, quality farm equipment, and direct farmer-to-consumer connections.
            </p>
          </div>
        </header>

        <section className="mission-section">
          <h2 className="section-title">Our Mission</h2>
          <p className="mission-text">{missionText}</p>
        </section>

        <section className="featured-categories">
          <h2 className="section-title">Explore Popular Categories</h2>
          <div className="categories-grid">
            {featuredCategories.map(category => (
              <CategoryCard
                key={category.id}
                title={category.name}
                description={category.description}
                buttonText="View Products"
                onButtonClick={() => alert(`Viewing products for ${category.name}`)}
              />
            ))}
          </div>
        </section>

        <section className="call-to-action">
          <h2 className="section-title">Join Farmart Today!</h2>
          <p className="cta-text">
            Sign up to start buying or selling fresh produce and farm equipment directly.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
}

export default Home;
