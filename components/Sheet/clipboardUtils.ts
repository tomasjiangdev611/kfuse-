export const toClipboard = (s) => {
  const el = document.createElement('textarea');
  el.value = s;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
