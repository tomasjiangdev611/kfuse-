export enum ServiceMapType {
  mini = 'Mini',
  flow = 'Flow',
  cluster = 'Cluster',
}

export type SpanNode = {
  children: SpanNode[];
  name: string;
  spanId: string;
  value: number;
};
