import { escapePeriod } from 'utils';

const formatFacetName = (
  component: string,
  facetName: string,
  type?: string,
): string =>
  component === 'Core' ||
  component === 'Kubernetes' ||
  component === 'Cloud' ||
  component === 'Additional' ||
  !component
    ? facetName
    : `@${escapePeriod(component)}${type ? `:${type}` : ''}.${escapePeriod(
        facetName,
      )}`;

export default formatFacetName;
