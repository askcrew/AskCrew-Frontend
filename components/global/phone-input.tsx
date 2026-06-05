"use client";
import PhoneInput from "react-phone-input-2";
import { PhoneInputProps } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputVisualProps extends PhoneInputProps {
  placeholder?: string;
  disabled?: boolean;
  defaultCountry?: PhoneInputProps["country"];
  onChange?: (phone: string | undefined) => void;
  value?: string;
  label?: string;
  errorMsg?: string;
}

export default function PhoneInputComponent({
  placeholder = "Type Here",
  disabled = false,
  defaultCountry = "eg",
  label,
  ...props
}: PhoneInputVisualProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
      <div className="w-full mx-auto">
        <div className="space-y-2">
          <div className="relative">
            <PhoneInput
              country={defaultCountry}
              disabled={disabled}
              inputStyle={{
                width: "100%",
                height: "48px",
                fontSize: "16px",
                border: "1px solid #d1d5db",
                borderRadius: "100vw",
                paddingLeft: "60px",
                backgroundColor: disabled
                  ? "#f9fafb"
                  : props.errorMsg
                  ? "#FDECEC"
                  : "white",
                borderColor: props.errorMsg ? "#EF4444" : "",
                color: disabled ? "#9ca3af" : "#374151",
                outline: "none",
                fontFamily: "inherit",
                letterSpacing: "0.025em",
              }}
              buttonStyle={{
                border: "1px solid #d1d5db",
                borderRadius: "100vw 0 0 100vw",
                backgroundColor: disabled ? "#f9fafb" : "white",
                padding: "0 0 0 8px",
                width: "50px",
                height: "48px",
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
              }}
              dropdownStyle={{
                borderRadius: "8px",
                zIndex: 0,
                maxHeight: "200px",
                overflowY: "auto",
                top: "50px",
                insetInlineStart: "0",
              }}
              containerStyle={{
                width: "100%",
              }}
              inputProps={{
                name: "phone",
                autoFocus: false,
                placeholder,
              }}
              specialLabel=""
              searchPlaceholder="Search countries..."
              disableDropdown={disabled}
              {...props}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
