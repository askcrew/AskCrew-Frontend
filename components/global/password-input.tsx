import { useState } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import FormMessage from "./form-message";
type PasswordInputProps = {
  label: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  message?: string;
} & React.ComponentProps<typeof Input>;

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  message,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder="••••••••••••"
          value={value}
          onChange={onChange}
          {...props}
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowPassword(!showPassword);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <FormMessage message={message} />
    </div>
  );
};
export default PasswordInput;
