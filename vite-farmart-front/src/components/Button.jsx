import React from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

function Button({
  type = "button",        // button type: button, submit, reset
  variant = "primary",    // primary, secondary, danger, success, back
  size = "md",            // sm, md, lg
  disabled = false,
  isLoading = false,
  onClick,
  children,
  back = false,           // if true, acts as a "back" button
  className = "",
  ...props
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (back) {
      navigate(-1);
      return;
    }
    if (onClick) onClick(e);
  };

  const baseStyles = "rounded px-4 py-2 font-semibold transition-all duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    back: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  const sizes = {
    sm: "text-sm px-3 py-1",
    md: "text-md px-4 py-2",
    lg: "text-lg px-5 py-3",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={clsx(baseStyles, variants[variant], sizes[size], disabled && "opacity-50 cursor-not-allowed", className)}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}

export default Button;
