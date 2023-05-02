import { useMergeState } from 'hooks';

enum PanMode {
  LeftHandle = 'LeftHandle',
  RightHandle = 'RightHandle',
  Zone = 'Zone',
}

type RefAreaState = {
  dragStart: 0;
  isDragging: boolean;
  hoveredIndex: number | null;
  panMode: PanMode;
  panStart: 0;
  refAreaLeft: number;
  refAreaRight: number;
};

type CallbackArgs = {
  refAreaLeft: number;
  refAreaRight: number;
};

const initialState: RefAreaState = {
  dragStart: 0,
  isDragging: false,
  hoveredIndex: null,
  panMode: null,
  panStart: 0,
  refAreaLeft: null,
  refAreaRight: null,
};

const useRefAreaState = ({
  onClearCallback,
  onMouseUpCallback,
  shouldResetAfterMouseUp,
}) => {
  const [state, setState] = useMergeState<RefAreaState>(initialState);

  const clear = () => {
    setState(initialState);
  };

  const onMouseDown = (e: any) => {
    const activeLabel = e?.activeLabel;
    if (activeLabel) {
      setState((prevState: RefAreaState) => {
        const { refAreaLeft, refAreaRight } = prevState;

        if (activeLabel > refAreaLeft && activeLabel < refAreaRight) {
          return {
            hoveredIndex: null,
            panMode: PanMode.Zone,
            panStart: activeLabel,
          };
        }

        if (activeLabel === refAreaLeft) {
          return {
            hoveredIndex: null,
            panMode: PanMode.LeftHandle,
            panStart: activeLabel,
          };
        }

        if (activeLabel === refAreaRight) {
          return {
            hoveredIndex: null,
            panMode: PanMode.RightHandle,
            panStart: activeLabel,
          };
        }

        return {
          dragStart: activeLabel,
          isDragging: true,
          hoveredIndex: null,
          refAreaLeft: activeLabel - 1,
          refAreaRight: activeLabel + 1,
        };
      });
    }
  };

  const onMouseMove = (e: any) => {
    const activeLabel = e?.activeLabel;
    setState((prevState) => {
      const {
        dragStart,
        isDragging,
        panMode,
        panStart,
        refAreaLeft,
        refAreaRight,
      } = prevState;
      if (panMode) {
        const diff = activeLabel - panStart;

        if (panMode === PanMode.LeftHandle) {
          return {
            refAreaLeft: Math.min(refAreaLeft + diff, refAreaRight - 1),
            panStart: activeLabel,
          };
        }

        if (panMode === PanMode.RightHandle) {
          return {
            refAreaRight: Math.max(refAreaRight + diff, refAreaLeft + 1),
            panStart: activeLabel,
          };
        }

        return {
          refAreaLeft: refAreaLeft + diff,
          refAreaRight: refAreaRight + diff,
          panStart: activeLabel,
        };
      }

      if (isDragging && refAreaLeft) {
        const nextRefAreaLeft = Math.min(activeLabel, dragStart);
        const nextRefAreaRight = Math.max(activeLabel, dragStart);
        return {
          refAreaLeft: nextRefAreaLeft,
          refAreaRight: nextRefAreaRight,
        };
      }

      return {
        hoveredIndex: activeLabel,
      };
    });
  };

  const onMouseUp = (e) => {
    const activeLabel = e?.activeLabel;
    if (activeLabel) {
      setState((prevState) => {
        const { isDragging, panMode, refAreaLeft, refAreaRight } = prevState;
        if ((isDragging || panMode) && refAreaLeft && refAreaRight) {
          onMouseUpCallback({ refAreaLeft, refAreaRight });
          if (shouldResetAfterMouseUp) {
            return { ...initialState };
          }
        }

        return { isDragging: false, panMode: null };
      });
    }
  };

  return { clear, state, onMouseDown, onMouseMove, onMouseUp };
};

export default useRefAreaState;
