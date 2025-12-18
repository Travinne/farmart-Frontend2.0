import React from "react";
import Button from "./Button";

function CategoryCard({ category, description, image, actions = [], className = "" }) {
  return (
    <div className={`rounded-lg shadow-md overflow-hidden bg-white ${className}`}>
      {image && (
        <img
          src={image}
          alt={category}
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{category}</h3>
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        {actions.length > 0 && (
          <div className="flex gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || "primary"}
              >
                {action.text}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryCard;
