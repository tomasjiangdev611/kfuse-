import * as yup from 'yup';

export const sloCreateInputSchema = () => {
  const labelKeyValueSchema = yup.object({
    key: yup
      .string()
      .matches(/^[a-zA-Z0-9_]*$/, 'Label must be alphanumeric and underscore'),
    value: yup.string(),
  });
  return yup.object({
    sloName: yup
      .string()
      .required('SLO name is required')
      .min(3, 'SLO name must be at least 3 characters')
      .max(512, 'SLO name must be less than 512 characters')
      .matches(
        /^[a-zA-Z0-9_]+$/,
        'SLO name must be alphanumeric and underscore',
      ),
    sloDescription: yup.string(),
    objective: yup
      .number()
      .typeError('Objective must be a number')
      .required('Objective is required')
      .min(0)
      .max(100),
    sloLabels: yup.array().of(labelKeyValueSchema),
    high: yup.object({
      name: yup
        .string()
        .required('High severity alert name is required')
        .min(3, 'High severity alert name must be at least 3 characters')
        .max(512, 'High severity alert name must be less than 512 characters')
        .matches(
          /^[a-zA-Z0-9_]+$/,
          'High severity alert name must be alphanumeric and underscore',
        ),
      description: yup.string(),
      labels: yup.array().of(labelKeyValueSchema),
    }),
    low: yup.object({
      name: yup
        .string()
        .required('Low severity alert name is required')
        .min(3, 'Low severity alert name must be at least 3 characters')
        .max(512, 'Low severity alert name must be less than 512 characters')
        .matches(
          /^[a-zA-Z0-9_]+$/,
          'Low severity alert name must be alphanumeric and underscore',
        ),
      description: yup.string(),
      labels: yup.array().of(labelKeyValueSchema),
    }),
  });
};
