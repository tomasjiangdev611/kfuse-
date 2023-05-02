import dayjs from 'dayjs';
import React from 'react';
import { X } from 'react-feather';
import JSONTree from 'react-json-tree';

const getChanges = (obj, path = '', found = []) => {
  const keys = Array.isArray(obj)
    ? Array.from(Array(obj.length).keys())
    : Object.keys(obj);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = obj[key];
    const nextPath = `${path === '' ? '' : `${path}.`}${key}`;

    if (typeof value !== 'object') {
      found.push({ path: nextPath, value });
      continue;
    }

    getChanges(value, nextPath, found);
  }

  return found;
};

const getPreviousChanges = (entitySnapshot, changes) => changes.reduce((obj, change) => ({
  ...obj,
  [change.path]: getValueByPath(entitySnapshot, change.path.split('.')),
}), {});

const getValueByPath = (entitySnapshot, keys) => {
  const value = entitySnapshot[keys[0]];
  if (!value) {
    return null;
  }

  if (keys.length === 1) {
    return value;
  }

  return getValueByPath(value, keys.slice(1));
};

const TopologySidebar = ({ close, entity, topology }) => {
  const { krn } = entity;
  const { entitySnapshotByTimeByKrn, result } = topology;

  const changeTimes = Object.keys(result[krn])
    .filter((time) => time !== 'base')
    .sort();

  return (
    <div className="topology__sidebar">
      <div className="topology__sidebar__header">
        <div className="topology__sidebar__header__text">
          {entity.metadata.name}
        </div>
        <button onClick={close}>
          <X size={20} />
        </button>
      </div>
      <div className="topology__sidebar__body">
        {changeTimes.map((changeTime, i) => {
          const changes = getChanges(result[krn][changeTime]);
          const previousChanges = getPreviousChanges(
            i === 0
              ? entitySnapshotByTimeByKrn[krn].base
              : entitySnapshotByTimeByKrn[krn][changeTimes[i - 1]],
            changes,
          );

          return (
            <>
              {i > 0 ? (
                <div className="topology__sidebar__change-spacer" />
              ) : null}
              <div className="topology__sidebar__change">
                <div className="topology__sidebar__change__time">
                  {dayjs(changeTime).format('MMM D, YYYY h:mm:ss A')}
                  <div className="topology__sidebar__change__time__circle" />
                </div>
                <div className="topology__sidebar__change__items">
                  {changes.map((change) => (
                    <div className="topology__sidebar__change__item">
                      <div className="topology__sidebar__change__item__label">
                        {change.path}
                      </div>
                      <div className="topology__sidebar__change__item__previous-value">
                        {JSON.stringify(previousChanges[change.path])}
                      </div>
                      <div className="topology__sidebar__change__item__value">
                        {JSON.stringify(change.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default TopologySidebar;
