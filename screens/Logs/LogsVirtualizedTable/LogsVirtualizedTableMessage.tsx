import classnames from 'classnames';
import React, { useMemo } from 'react';
import { LogEvent } from 'types';
import { isNumber } from 'utils';

enum TokenType {
  string = 'string',
  plain = 'plain',
  number = 'number',
}

type Token = {
  type: TokenType;
  value: string;
};

const getTokens = (row: LogEvent): Token[] => {
  const { facets, message } = row;

  const matchingTokens = Object.values(facets).filter(
    (facetValue: string) => facetValue.length > 2,
  );

  const facetValueByIndex = matchingTokens.reduce(
    (obj: { [key: number]: string }, facetValue: string) => ({
      ...obj,
      [message.indexOf(facetValue)]: facetValue,
    }),
    {},
  );

  const indexes = Object.keys(facetValueByIndex)
    .map((index) => Number(index))
    .filter((index) => index > -1)
    .sort((a, b) => a - b);

  let currentIndex = 0;
  const result: Token[] = [];
  for (let i = 0; i < indexes.length; i += 1) {
    const index = indexes[i];
    const nextCurrentIndex = index + facetValueByIndex[index].length;
    const beforeString = message.substring(currentIndex, index);
    result.push({ type: TokenType.plain, value: beforeString });

    const value = message.substring(index, nextCurrentIndex);
    result.push({
      type: isNumber(value) ? TokenType.number : TokenType.string,
      value,
    });

    currentIndex = nextCurrentIndex;
  }

  result.push({
    type: TokenType.plain,
    value: row.message.substring(currentIndex, row.message.length),
  });
  return result;
};

const LogsVirtualizedTableMessage = ({ row }) => {
  const tokens = useMemo(() => getTokens(row), [row]);

  return (
    <div>
      {tokens.map((token) => (
        <span
          className={classnames({
            'text--blue': token.type === TokenType.number,
            'text--green': token.type === TokenType.string,
            'text--prewrap': true,
            'text--weight-medium': token.type !== TokenType.plain,
          })}
        >
          {token.value}
        </span>
      ))}
    </div>
  );
};

export default LogsVirtualizedTableMessage;
