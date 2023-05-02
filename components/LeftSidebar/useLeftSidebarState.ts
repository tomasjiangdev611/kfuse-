import { useLocalStorageState } from 'hooks';

const useLeftSidebarState = (namespace: string) => {
  const [width, setWidth] = useLocalStorageState(
    `${namespace}-left-sidebar-width`,
    280,
  );

  const onResize = ({ deltaX }) => {
    setWidth((prevWidth) => Math.max(prevWidth + deltaX, 240));
  };

  const hide = () => {
    setWidth(0);
  };

  const show = () => {
    setWidth(280);
  };

  return {
    hide,
    onResize,
    show,
    width,
  };
};

export default useLeftSidebarState;
