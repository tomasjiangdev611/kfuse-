import classnames from 'classnames';
import { EditableText } from 'components';
import { useRequest, useToggle } from 'hooks';
import React, { useEffect } from 'react';
import {
  createWorkbook,
  deleteWorkbook,
  editWorkbook,
  getWorkbooks,
} from 'requests';
import { File, Plus, XCircle } from 'react-feather';
import { BiTimeFive } from 'react-icons/bi';
import { onPromiseError } from 'utils';
import { useLogsWorkbooksState } from './hooks';

type Props = {
  logsWorkbooksState: ReturnType<typeof useLogsWorkbooksState>;
  showHistoryToggle: ReturnType<typeof useToggle>;
};

const LogsWorkbooks = ({ logsWorkbooksState, showHistoryToggle }: Props) => {
  const getWorkbooksRequest = useRequest(getWorkbooks);
  const {
    addLogsWorkbook,
    currentWorkbookIndex,
    removeWorkbookByIndex,
    setCurrentWorkbookIndex,
    setWorkbookName,
    setWorkbooks,
    workbooks,
  } = logsWorkbooksState;
  const onClickHandler = (i: number) => () => {
    setCurrentWorkbookIndex(i);
  };

  const removeWorkbookByIndexHandler = (workbookIndex: number) => (e) => {
    e.stopPropagation();
    const workbook = workbooks[workbookIndex];

    const removeWorkbook = () => {
      removeWorkbookByIndex(workbookIndex);
    };

    if (workbook.id) {
      deleteWorkbook(workbook.id).then(removeWorkbook, onPromiseError);
    } else {
      removeWorkbook();
    }
  };

  const setWorkbookNameHandler = (workbookIndex: number) => (name: string) => {
    const workbook = { ...workbooks[workbookIndex], name };
    if (workbook.id) {
      editWorkbook({
        id: workbook.id,
        logsState: JSON.stringify(workbook.logsState),
        name,
      });
    } else {
      createWorkbook({ logsState: JSON.stringify(workbook.logsState), name });
    }

    setWorkbookName(workbookIndex, name);
    return new Promise<void>((resolve) => resolve());
  };

  useEffect(() => {
    // getWorkbooksRequest.call().then((result) => {
    //   const workbooks = result.map((workbook) => ({
    //     ...workbook,
    //     createdAt: new Date(workbook.created),
    //     history: [],
    //     logsState: JSON.parse(workbook.logsState),
    //     saved: true,
    //   }));
    //
    //   setWorkbooks(workbooks);
    // });

    setWorkbooks([]);
  }, []);

  return (
    <div className="logs__workbooks">
      <div className="logs__workbooks__left">
        {workbooks.map((workbook, i) => {
          const isActive = currentWorkbookIndex === i;
          const name = workbook.name || 'Untitled';
          return (
            <div
              className={classnames({
                logs__workbooks__left__item: true,
                'logs__workbooks__left__item--active': isActive,
              })}
              key={i}
              onClick={onClickHandler(i)}
            >
              <div className="logs__workbooks__left__item__inner">
                <div className="logs__workbooks__left__item__icon">
                  <File size={14} />
                </div>
                <div className="logs__workbooks__left__item__name">
                  {isActive ? (
                    <EditableText
                      key={workbook.name}
                      save={setWorkbookNameHandler(i)}
                      text={name}
                    />
                  ) : (
                    name
                  )}
                </div>
                <div
                  className={classnames({
                    'logs__workbooks__left__item__delete-button': true,
                    'logs__workbooks__left__item__delete-button--hidden':
                      workbooks.length === 1,
                  })}
                  onClick={removeWorkbookByIndexHandler(i)}
                >
                  <XCircle size={14} />
                </div>
              </div>
            </div>
          );
        })}
        <div className="logs__workbooks__add-button" onClick={addLogsWorkbook}>
          <Plus size={14} />
        </div>
      </div>
      <div className="logs__workbooks__right">
        <div className="logs__workbooks__right__item">
          <button
            className="button button--short"
            onClick={showHistoryToggle.on}
          >
            <div className="button__icon" style={{ paddingTop: '3px' }}>
              <BiTimeFive size={14} />
            </div>
            <div className="button__text">History</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogsWorkbooks;
