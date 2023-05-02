export enum EditMode {
  range = 'range',
}

export type EditState = {
  mode: EditMode;
  name: string;
  range: { lower: number; upper: number };
};
