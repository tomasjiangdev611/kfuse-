import React from 'react';

type Props = {
  className?: string;
  highlighted?: string;
  text?: string;
};

const HighlightedText = ({ className, highlighted, text }: Props) => {
  if (highlighted && text) {
    const highlightedLowered = highlighted.toLowerCase();
    const textLowered = text.toLowerCase();

    const start = textLowered.indexOf(highlightedLowered);

    if (start > -1) {
      const end = start + highlightedLowered.length;

      const letters = text.split('');
      const first = letters.slice(0, start).join('');
      const second = letters.slice(start, end).join('');
      const third = letters.slice(end, text.length).join('');

      return (
        <>
          {first ? <span>{first}</span> : null}
          {second ? <span className="text--highlighted">{second}</span> : null}
          {third ? <span>{third}</span> : null}
        </>
      );
    }
  }

  return text;
};

export default HighlightedText;
