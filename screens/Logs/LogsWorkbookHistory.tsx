import dayjs from 'dayjs';
import { useToggle } from 'hooks';
import React from 'react';
import { User } from 'types';
import { useLogsWorkbooksState } from './hooks';

type Props = {
  logsWorkbooksState: ReturnType<typeof useLogsWorkbooksState>;
  showHistoryToggle: ReturnType<typeof useToggle>;
  user: User;
};

const LogsWorkbookHistory = ({
  logsWorkbooksState,
  showHistoryToggle,
  user,
}: Props) => {
  const { currentWorkbookIndex, currentWorkbook, restoreHistoryEntryByIndex } =
    logsWorkbooksState;
  const { history } = currentWorkbook;

  const onClickHandler = (historyEntryIndex: number) => () => {
    restoreHistoryEntryByIndex(currentWorkbookIndex, historyEntryIndex);
  };

  return (
    <div className="logs__workbook-history__main">
      {history.map((historyEntry, i) => (
        <div className="logs__workbook-history__item">
          <div className="logs__workbook-history__item__action">
            {historyEntry.action.type}
          </div>
          <div className="logs__workbook-history__item__user">
            <div
              className="logs__workbook-history__item__user__avatar"
              style={{ backgroundImage: `url(${user.imageUrl})` }}
            />
            <div className="logs__workbook-history__item__user__name">
              admin
            </div>
          </div>
          <div className="logs__workbook-history__item__date">
            {dayjs(historyEntry.createdAt).fromNow()}
          </div>
          <div className="logs__workbook-history__itme__actions">
            <button className="link" onClick={onClickHandler(i)}>
              Restore
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LogsWorkbookHistory;
