import React from "react";

interface ButtonProps {
  icon?: React.ReactNode;
  onClick: () => void;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({ icon, onClick, title }) => {
  return (
    <button className="nav-btn" onClick={onClick} title={title}>
      {icon}
    </button>
  );
};

export default Button;
