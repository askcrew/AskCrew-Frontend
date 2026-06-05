"use client";

import useMultiStepForm, {
  MultiStepProvider,
} from "@/hooks/use-multi-step-form";
import { Bullets } from "./bullets";
import CreateAccountForm from "./create-account-form";
import ChooseSpecificationForm from "./choose-specification-form";
import DefineExperienceForm from "./define-experience-form";
import PersonalInfoForm from "./personal-info-form";
import ChoosePlanForm from "./choose-plan-form";
import SocailMediaForm from "./socail-media-form";

const StudentRegisterForm = () => {
  const multiStepsForm = useMultiStepForm({ steps: 6 });
  return (
    <div className="flex-1 space-y-8 px-4 w-full max-w-4xl mx-auto lg:px-0">
      <MultiStepProvider value={multiStepsForm}>
        {/* Progress Section */}
        <div className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
          <Bullets current={multiStepsForm.currentStep} length={6} />
        </div>

        {/* Form Content */}
        <div className="bg-background rounded-2xl border border-border shadow-xl md:p-8 p-4">
          {multiStepsForm.currentStep === 1 && <CreateAccountForm />}
          {multiStepsForm.currentStep === 2 && <ChooseSpecificationForm />}
          {multiStepsForm.currentStep === 3 && <DefineExperienceForm />}
          {multiStepsForm.currentStep === 4 && <SocailMediaForm />}
          {multiStepsForm.currentStep === 5 && <PersonalInfoForm />}
          {multiStepsForm.currentStep === 6 && <ChoosePlanForm />}
        </div>
      </MultiStepProvider>
    </div>
  );
};
export default StudentRegisterForm;
