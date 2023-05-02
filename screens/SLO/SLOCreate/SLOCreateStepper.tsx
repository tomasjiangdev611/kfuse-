import { Stepper } from 'components';
import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreateSLOState } from '../hooks';
import SLOCreateAlertSetup from './SLOCreateAlertSetup';
import SLOCreateDenominator from './SLOCreateDenominator';
import SLOCreateDetails from './SLOCreateDetails';
import SLOCreateLabel from './SLOCreateLabel';
import SLOCreateNumerator from './SLOCreateNumerator';
import SLOCreateObjective from './SLOCreateObjective';

const SLOCreateStepper = ({
  createSLOState,
}: {
  createSLOState: ReturnType<typeof useCreateSLOState>;
}): ReactElement => {
  const navigate = useNavigate();
  const { control, createSLO, sloFormError, handleSubmit } = createSLOState;

  return (
    <div className="slo__create__stepper">
      <div className="slo__create__header"> New SLO</div>
      <form onSubmit={handleSubmit(createSLO)}>
        <Stepper
          steps={[
            {
              title: 'Define the source',
              component: (
                <>
                  <SLOCreateNumerator createSLOState={createSLOState} />
                  <SLOCreateDenominator createSLOState={createSLOState} />
                </>
              ),
            },
            {
              title: 'Set the Objective',
              component: <SLOCreateObjective createSLOState={createSLOState} />,
            },
            {
              title: 'Define SLO the details',
              component: (
                <>
                  <SLOCreateDetails createSLOState={createSLOState} />
                  <SLOCreateLabel
                    control={control}
                    errors={sloFormError?.sloLabels}
                    name="sloLabels"
                    title="SLO Labels:"
                  />
                </>
              ),
            },
            {
              title: 'Setup high severity alert',
              component: (
                <SLOCreateAlertSetup
                  alertType="high"
                  createSLOState={createSLOState}
                />
              ),
            },
            {
              title: 'Setup low severity alert',
              component: (
                <SLOCreateAlertSetup
                  alertType="low"
                  createSLOState={createSLOState}
                />
              ),
            },
          ]}
        />
        <div className="slo__create__stepper__actions">
          <button
            className="button"
            onClick={() => navigate('/apm/slo')}
            type="button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button button--blue"
            onSubmit={handleSubmit(createSLO)}
          >
            Save & Exit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SLOCreateStepper;
