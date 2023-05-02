import { FlyoutCaret } from 'components';
import React, { ReactElement, useEffect, useState } from 'react';

type StepProps = {
  title: string;
  isOpen?: boolean;
  component: ReactElement;
};

const Stepper = ({ steps }: { steps: StepProps[] }): ReactElement => {
  const [stepState, setStepState] = useState<StepProps[]>([]);

  const toggleStep = (index: number) => {
    const newStepState = [...stepState];
    newStepState[index].isOpen = !newStepState[index].isOpen;
    setStepState(newStepState);
  };

  useEffect(() => {
    if (stepState.length > 0) {
      const isOpenState = steps.map((step, idx) => {
        return {
          ...step,
          component: step.component,
          isOpen: stepState[idx].isOpen,
        };
      });
      setStepState(isOpenState);
      return;
    }

    const isOpenState = steps.map((step) => {
      return { ...step, isOpen: true };
    });

    setStepState(isOpenState);
  }, [steps]);
  return (
    <div className="stepper">
      <div className="stepper__labels">
        {stepState.map((step, idx) => {
          return (
            <div key={step.title}>
              <div
                className="stepper__labels__step"
                onClick={() => toggleStep(idx)}
              >
                <div className="stepper__labels__step__count">{idx + 1}</div>
                <FlyoutCaret isOpen={step.isOpen} size={24} />
                <div className="stepper__labels__step__text">{step.title}</div>
              </div>
              <div className="stepper__labels__step__content">
                <div
                  className="stepper__labels__step__line"
                  style={
                    idx === stepState.length - 1
                      ? { backgroundColor: 'transparent' }
                      : {}
                  }
                />
                <div
                  className="stepper__labels__step__component"
                  style={!step.isOpen ? { display: 'none' } : {}}
                >
                  {step.component}
                </div>
                {!step.isOpen && (
                  <div className="stepper__labels__step__component--placeholder" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
