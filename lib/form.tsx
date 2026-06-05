import CheckboxWithLabelGroup from "@/components/global/checkbox-with-label-group";
import CustomSelect from "@/components/global/custom-select";
import DatePicker from "@/components/global/date-picker";
import FormGroup from "@/components/global/form-group";
import FormText from "@/components/global/form-text";
import LocationInput from "@/components/global/location-input";
import PhoneInputComponent from "@/components/global/phone-input";
import RadioWithLabelGroup from "@/components/global/radio-with-label-group";
import { RatingGroup } from "@/components/global/rating-group";
import { TimePicker } from "@/components/global/time-picker";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {
    FormGroup,
    FormText,
    CustomSelect,
    DatePicker,
    TimePicker,
    CheckboxWithLabelGroup,
    RadioWithLabelGroup,
    LocationInput,
    PhoneInputComponent,
    RatingGroup,
  },
  formComponents: {},
});
export default useAppForm;
