import { LogEventDetail } from 'types';
import { onPromiseError } from 'utils';
import query from './query';

type Args = {
  eventId: string;
};

const logEventDetail = async ({ eventId }: Args): Promise<LogEventDetail> => {
  return query<LogEventDetail, 'logEventDetail'>(`
    {
      logEventDetail(eventId: "${eventId}") {
          logEvent {
            message,
            timestamp
            fpHash,
            fpPattern,
            host,
            kubeContainerName,
            kubeNamespace,
            kubeService,
            podName
          },
          logFacets {
            name,
            type,
            value
          },
          otherFacets {
            name,
            type,
            value
          }
        }
    }
  `).then((data) => data.logEventDetail, onPromiseError);
};

export default logEventDetail;
