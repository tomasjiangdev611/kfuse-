import classnames from 'classnames';
import { CopyButton } from 'components';
import React, { useMemo } from 'react';
import { LogEvent } from 'types';
import { formatLogMessage, isNumber } from 'utils';

enum TokenType {
  string = 'string',
  plain = 'plain',
  number = 'number',
}

type Token = {
  type: TokenType;
  value: string;
};

const getTokens = (logEvent: LogEvent): Token[] => {
  const facets = logEvent.facets || {};
  const message = formatLogMessage(logEvent.message);

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
    value: message.substring(currentIndex, message.length),
  });
  return result;
};

type Props = {
  logEvent: LogEvent;
};

const LogsMessage = ({ logEvent }: Props) => {
  const tokens = useMemo(() => getTokens(logEvent), [logEvent]);
  const formattedLogMessage = useMemo(
    () => formatLogMessage(logEvent.message),
    [logEvent],
  );

  return <div className="logs__message">{formattedLogMessage}</div>;
};

export default LogsMessage;
