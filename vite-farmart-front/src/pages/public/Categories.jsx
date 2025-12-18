import React from "react";
import PublicLayout from "../../layouts/PublicLayout";
import CategoryCard from "../../components/ui/CategoryCard";

function Categories() {
  const categories = [
    { id: 1, name: "Vegetables", description: "Fresh and organic vegetables directly from local farms" },
    { id: 2, name: "Fruits", description: "Seasonal fruits handpicked by farmers" },
    { id: 3, name: "Grains & Cereals", description: "High-quality grains for all your cooking needs" },
    { id: 4, name: "Dairy Products", description: "Fresh milk, cheese, and other dairy products" },
    { id: 5, name: "Farm Equipment", description: "Tools and equipment for efficient farming" },
    { id: 6, name: "Organic Fertilizers", description: "Eco-friendly fertilizers for sustainable farming" },
  ];

  return (
    <PublicLayout>
      <div className="page categories-page">
        <h1 className="page-title">Explore Categories</h1>
        <p className="page-text">
          Discover a wide range of products and equipment directly from trusted farmers. Click on a category to browse items.
        </p>

        <div className="categories-grid">
          {categories.map(category => (
            <CategoryCard 
              key={category.id} 
              title={category.name} 
              description={category.description} 
              buttonText="View Products" 
              onButtonClick={() => alert(`Viewing products for ${category.name}`)}
            />
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

export default Categories;
