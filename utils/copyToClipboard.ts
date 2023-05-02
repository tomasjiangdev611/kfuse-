const copyToClipboard = (s: string) => {
  const el = document.createElement('textarea');
  el.value = s;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export default copyToClipboard;
