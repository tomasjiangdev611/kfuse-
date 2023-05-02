const isLeftClick = (e: MouseEvent) => {
  if ('buttons' in e) {
    return e.buttons == 0;
  }
  const button = e.which || e.button;
  return button == 0;
};

export default isLeftClick;
