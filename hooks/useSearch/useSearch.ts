import { useMergeState } from 'hooks';
import { LimitTo, Operation, VisualizeAs } from 'types';

type State = {
  groupBys: string[];
  limitTo: LimitTo;
  limitToValue: number;
  measure: string;
  operation: Operation;
  rollUpInSeconds: number;
  visualizeAs: VisualizeAs;
};

const useSearch = () => {
  const [state, setState] = useMergeState<State>({
    groupBys: ['*'],
    limitTo: LimitTo.top,
    limitToValue: 5,
    measure: null,
    operation: Operation.distinctcount,
    rollUpInSeconds: null,
    visualizeAs: VisualizeAs.list,
  });

  const addGroupBy = (group: string) => {
    setState((prevState) => {
      const nextGroupBys = [...prevState.groupBys, group];
      return {
        groupBys: nextGroupBys,
      };
    });
  };

  const removeGroupByByIndexHandler = (i: number) => () => {
    setState((prevState) => {
      const nextGroupBys = [...prevState.groupBys];
      nextGroupBys.slice(i, 1);
      return {
        groupBys: nextGroupBys,
      };
    });
  };

  const changeHandler =
    <T extends keyof State>(key: T) =>
    (value: State[T]) => {
      setState({ [key]: value });
    };

  const changeMeasure = (nextMeasure: string) => {
    setState({
      measure: nextMeasure,
      operation:
        nextMeasure === 'duration' ? Operation.avg : Operation.distinctcount,
    });
  };

  return {
    ...state,
    addGroupBy,
    changeGroupBys: changeHandler('groupBys'),
    changeLimitTo: changeHandler('limitTo'),
    changeLimitToValue: changeHandler('limitToValue'),
    changeMeasure: changeMeasure,
    changeOperation: changeHandler('operation'),
    changeRollUpInSeconds: changeHandler('rollUpInSeconds'),
    changeVisualizeAs: changeHandler('visualizeAs'),
    removeGroupByByIndexHandler,
    state,
  };
};

export default useSearch;
