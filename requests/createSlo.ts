import { SLOProps, SLOAlertInputProps } from 'types';
import { onPromiseError } from 'utils';

import queryTraceService from './queryTraceService';

const getLabelsMapQuery = (labels: Array<{ Name: string; Value: string }>) => {
  let result = '[';
  labels.forEach((label) => {
    result += `{ Name: "${label.Name}", Value: "${label.Value}" }`;
  });
  result += ']';
  return result;
};

type Arg = {
  alertAnnotations: any;
  errorQuery: string;
  pageAlertInput: SLOAlertInputProps;
  objective: number;
  sloDescription: string;
  sloLabels: any;
  sloName: string;
  sloService: string;
  ticketAlertInput: SLOAlertInputProps;
  totalQuery: string;
};

const createSlo = async ({
  alertAnnotations,
  errorQuery,
  pageAlertInput,
  objective,
  sloDescription,
  sloLabels,
  sloName,
  sloService,
  ticketAlertInput,
  totalQuery,
}: Arg): Promise<SLOProps> => {
  return queryTraceService<SLOProps, 'createSLO'>(`
   {
    createSLO (
      sloName: "${sloName}"
      sloService: "${sloService}"
      errorQuery: "${errorQuery}"
      totalQuery: "${totalQuery}"
      objective: ${objective}
      sloDescription: "${sloDescription}"
      ${sloLabels ? `sloLabels: ${getLabelsMapQuery(sloLabels)}` : ''}
      ${
        alertAnnotations
          ? `alertAnnotations: ${getLabelsMapQuery(alertAnnotations)}`
          : ''
      }   
      pageAlertInput:{
        Name: "${pageAlertInput.Name}"
        ${
          pageAlertInput.Labels
            ? `Labels: ${getLabelsMapQuery(pageAlertInput.Labels)}`
            : ''
        }
        ${
          pageAlertInput.Annotations
            ? `Annotations: ${getLabelsMapQuery(pageAlertInput.Annotations)}`
            : ''
        }
      }
      ticketAlertInput:{
        Name: "${ticketAlertInput.Name}"
        ${
          ticketAlertInput.Labels
            ? `Labels: ${getLabelsMapQuery(ticketAlertInput.Labels)}`
            : ''
        }
        ${
          ticketAlertInput.Annotations
            ? `Annotations: ${getLabelsMapQuery(ticketAlertInput.Annotations)}`
            : ''
        }
      }
    )  
   }
    `).then((data) => data.createSLO || null, onPromiseError);
};

export default createSlo;
