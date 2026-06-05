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
import { Loader2 } from "lucide-react";

const EnterpriseRegisterForm = () => {
  const multiStepsForm = useMultiStepForm({ steps: 5 });
  return (
    <div className="flex-1 space-y-8 px-4 w-full max-w-4xl mx-auto lg:px-0">
      <MultiStepProvider value={multiStepsForm}>
        {/* Progress Section */}
        <div className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
          <Bullets current={multiStepsForm.currentStep} length={5} />
        </div>

        {/* Form Content */}
        <div className="bg-background rounded-2xl border border-border shadow-xl md:p-8 p-4">
          {!multiStepsForm.isLoaded ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
              <p className="text-muted-foreground animate-pulse font-medium">
                Loading your progress...
              </p>
            </div>
          ) : (
            <>
              {multiStepsForm.currentStep === 1 && <CreateAccountForm />}
              {multiStepsForm.currentStep === 2 && <ChooseSpecificationForm />}
              {multiStepsForm.currentStep === 3 && <DefineExperienceForm />}
              {multiStepsForm.currentStep === 4 && <PersonalInfoForm />}
              {multiStepsForm.currentStep === 5 && <ChoosePlanForm />}
            </>
          )}
        </div>
      </MultiStepProvider>
    </div>
  );
};
export default EnterpriseRegisterForm;
