import React from "react";
import clsx from "clsx";
import Button from "./Button";

function Card({
  title,
  subtitle,
  image,
  description,
  footer,
  variant = "default", // default, highlight
  hoverEffect = true,
  className = "",
  children,
  actions = [], // array of buttons [{ text, variant, onClick }]
}) {
  const baseStyles = "rounded shadow-md overflow-hidden transition-all duration-300 flex flex-col";

  const variants = {
    default: "bg-white",
    highlight: "bg-yellow-50 border border-yellow-300",
  };

  const hoverStyles = hoverEffect ? "hover:shadow-lg hover:scale-105" : "";

  return (
    <div className={clsx(baseStyles, variants[variant], hoverStyles, className)}>
      {image && (
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4 flex-1 flex flex-col">
        {title && <h3 className="font-bold text-lg mb-1">{title}</h3>}
        {subtitle && <h4 className="text-gray-500 text-sm mb-2">{subtitle}</h4>}
        {description && <p className="text-gray-700 flex-1">{description}</p>}
        {children && <div className="my-2">{children}</div>}

        {actions.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "primary"}
                size={action.size || "md"}
                onClick={action.onClick}
                isLoading={action.isLoading}
                disabled={action.disabled}
              >
                {action.text}
              </Button>
            ))}
          </div>
        )}

        {footer && <div className="mt-3 text-sm text-gray-400">{footer}</div>}
      </div>
    </div>
  );
}

export default Card;
