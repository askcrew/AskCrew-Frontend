import { ComponentProps, ReactNode } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

type CheckboxWithLabelGroupProps = {
  label: ReactNode;
} & ComponentProps<typeof Checkbox>;

const CheckboxWithLabelGroup = ({
  label,
  ...props
}: CheckboxWithLabelGroupProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox variant="blue" {...props} />
      <Label
        htmlFor={props.id}
        className="text-sm text-neutral-550 font-normal"
      >
        {label}
      </Label>
    </div>
  );
};
export default CheckboxWithLabelGroup;
