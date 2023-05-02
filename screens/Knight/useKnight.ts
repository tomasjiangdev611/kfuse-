import dayjs from 'dayjs';
import { useMergeState, useRequest } from 'hooks';
import { useState } from 'react';
import { podTrafficConnections } from 'requests';

const initialDate = {
  preset: null,
  endTimeUnix: dayjs('2021-10-21T00:00:00Z').unix(),
  startTimeUnix: dayjs('2021-10-21T00:00:00Z')
    .subtract(100000, 'seconds')
    .unix(),
};

const useKnight = () => {
  const podTrafficConnectionsRequest = useRequest(podTrafficConnections);

  const [state, setState] = useMergeState({
    activeLink: null,
    activeNode: null,
    date: initialDate,
    links: [],
    linksById: {},
    nodes: [],
    nodesById: {},
    protocol: 'Cassandra',
  });

  const fetch = ({ date, protocol }) => {
    podTrafficConnectionsRequest
      .call({ date, protocol})
      .then(setState);
  };

  const init = () => {
    fetch(state);
  };

  const onChangeDate = (nextDate) => {
    setState({ date: nextDate });
    fetch({ ...state, date: nextDate });
  };

  const onChangeProtocol = (nextProtocol) => {
    setState({ protocol: nextProtocol });
    fetch({ ...state, protocol: nextProtocol, });
  };

  const onClickLink = (source, target) => {
    const linkId = `${source}:${target}`;
    setState((prevState) => {
      return {
        activeLink: prevState.linksById[linkId] || null,
        activeNode: null,
      };
    });
  };

  const onClickNode = (_, activeNode) => {
    setState({ activeLink: null, activeNode });
  };

  return {
    ...state,
    init,
    isLoading: podTrafficConnectionsRequest.isLoading,
    links: state.links.map((link) => ({
      ...link,
      ...(state.activeLink?.id === link.id
        ? { color: '#3d8bc9', strokeWidth: 2 }
        : {}),
    })),
    nodes: state.nodes.map((node) => ({
      ...node,
      ...(state.activeNode?.id === node.id
        ? {
            color: '#c4e0eb',
            size: 260,
            strokeColor: '#3d8bc9',
          }
        : {}),
    })),
    onChangeDate,
    onChangeProtocol,
    onClickLink,
    onClickNode,
  };
};

export default useKnight;
