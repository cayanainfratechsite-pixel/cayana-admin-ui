// components/Button.tsx
import React from "react";
import { Button as MUIButton } from "@mui/material";
import { SvgIconProps } from "@mui/material/SvgIcon";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  variant?: "text" | "outlined" | "contained";
  icon?: React.ReactElement<SvgIconProps>;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  color = "primary",
  variant = "contained",
  icon,
}) => {
  const showText = text.trim() !== '';
  return (
    <MUIButton
      onClick={onClick}
      color={color}
      variant={variant}
      className="w-full sm:w-auto flex justify-center items-center gap-2"
    >
      {icon && (showText ? <span className="mr-2">{icon}</span> : icon)}
      {showText && text}
    </MUIButton>
  );
};

export default Button;
