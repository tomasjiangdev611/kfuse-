import {
  CoreLabelsBitmap,
  CloudLabelsBitmap,
  KubernetesLabelsBitmap,
} from 'constants';

const groupLabels = (getlabelNamesResult: string[]) => {
  const additionalLabels = [];
  const cloudLabels = [];
  const kubernetesLabels = [];

  getlabelNamesResult.sort().forEach((labelName) => {
    if (CloudLabelsBitmap[labelName]) {
      cloudLabels.push(CloudLabelsBitmap[labelName]);
    } else if (KubernetesLabelsBitmap[labelName]) {
      kubernetesLabels.push(KubernetesLabelsBitmap[labelName]);
    } else if (!CoreLabelsBitmap[labelName]) {
      additionalLabels.push({
        component: 'Additional',
        name: labelName,
        type: 'string',
      });
    }
  });

  return {
    additionalLabels,
    cloudLabels,
    kubernetesLabels,
  };
};

export default groupLabels;
