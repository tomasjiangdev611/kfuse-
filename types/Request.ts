export type RequestState = {
  calledAtLeastOnce: boolean;
  error?: Error;
  isLoading: boolean;
  result: any;
};

export type RequestResult = RequestState & {
  call: any;
  clear: VoidFunction;
  clearError: VoidFunction;
};
