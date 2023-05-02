import { chartingPaletteAlt01 } from 'constants';

//very simple hash
const hashString = (s: string): number => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const charCode = s.charCodeAt(i);
    hash += charCode;
  }
  return hash;
};

const stringToColor = (s: string): string => {
  const hash = hashString(s);
  const index = hash % chartingPaletteAlt01.length;
  return chartingPaletteAlt01[index];
};

export default stringToColor;
