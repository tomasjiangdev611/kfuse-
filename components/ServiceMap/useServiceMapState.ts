import { useMergeState } from 'hooks';
import { EdgeType, Orientation } from './types';

const useServiceMapState = ({
  orientation = Orientation.vertical,
  renderNodeTooltip,
}) => {
  const [state, setState] = useMergeState({
    customFilterState: {},
    edgeType:
      orientation === Orientation.horizontal
        ? EdgeType.straight
        : EdgeType.smoothstep,
    focusedNodeId: false,
    hideDanglingNodes: false,
    hoveredEdgeId: null,
    hoveredNodeId: null,
    orientation,
    outerRingKey: null,
    search: '',
    selectedNodeId: null,
    showMiniMap: true,
    showOnlyPathsWithErrors: false,
  });

  const changeSearch = (nextSearch: string) => {
    setState({ search: nextSearch });
  };

  const changeEdgeType = (nextEdgeType: EdgeType) => {
    setState({ edgeType: nextEdgeType });
  };

  const changeFocusedNodeId = (nodeId: string) => {
    setState((prevState) => ({ focusedNodeId: prevState.selectedNodeId }));
  };

  const changeOrientation = (nextOrientation: Orientation) => {
    setState({
      edgeType:
        nextOrientation === Orientation.horizontal
          ? EdgeType.straight
          : EdgeType.smoothstep,
      orientation: nextOrientation,
    });
  };

  const changeOuterRingKey = (nextOuterRingKey: string) => {
    setState({ outerRingKey: nextOuterRingKey });
  };

  const clear = () => {
    setState({
      customFilterState: {},
      focusedNodeId: false,
      hoveredEdgeId: null,
      hoveredNodeId: null,
      search: '',
      selectedNodeId: null,
    });
  };

  const onNodeClick = (nodeId: string) => {
    setState({ selectedNodeId: nodeId });
  };

  const onNodeMouseEnter = (nodeId: string) => {
    setState({ hoveredEdgeId: null, hoveredNodeId: nodeId });
  };

  const onNodeMouseLeave = () => {
    setState({ hoveredNodeId: null });
  };

  const onEdgeMouseEnter = (edgeId: string) => {
    setState({ hoveredEdgeId: edgeId });
  };

  const onEdgeMouseLeave = () => {
    setState({ hoveredEdgeId: null });
  };

  const resetFocusedNodeId = () => {
    setState({ focusedNodeId: null });
  };

  const createToggleHandlerByKey = (key) => () => {
    setState((prevState) => ({ [key]: !prevState[key] }));
  };

  const toggleCustomFilterHandler = (key: string) => () => {
    setState((prevState) => ({
      customFilterState: {
        ...prevState.customFilterState,
        [key]: !prevState.customFilterState[key],
      },
    }));
  };

  return {
    changeEdgeType,
    changeFocusedNodeId,
    changeOrientation,
    changeOuterRingKey,
    changeSearch,
    clear,
    onNodeClick,
    onEdgeMouseEnter,
    onEdgeMouseLeave,
    onNodeMouseEnter,
    onNodeMouseLeave,
    renderNodeTooltip,
    resetFocusedNodeId,
    state,
    toggleCustomFilterHandler,
    toggleHideDanglingNodes: createToggleHandlerByKey('hideDanglingNodes'),
    toggleShowMiniMap: createToggleHandlerByKey('showMiniMap'),
    toggleShowOnlyPathsWithErrors: createToggleHandlerByKey(
      'showOnlyPathsWithErrors',
    ),
  };
};

export default useServiceMapState;
