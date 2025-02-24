import React from "react";
import { TextField } from "@mui/material";
import styles from "./InputField.module.css"; // Import CSS module

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  fullWidth = true,
  disabled = false,
  placeholder = "",
}) => {
  return (
    <div className={styles.inputContainer}>
      <TextField
        className={styles.inputField}
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        fullWidth={fullWidth}
        disabled={disabled}
        placeholder={placeholder}
        variant="outlined"
      />
    </div>
  );
};

export default InputField;
