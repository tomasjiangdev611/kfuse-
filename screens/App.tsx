import { datadogRum } from '@datadog/browser-rum';
import {
  Modals,
  ModalsContextProvider,
  Popover,
  PopoverContextProvider,
  Toasts,
} from 'components';
import { useAuth } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import {
  Alerts,
  AlertsContacts,
  AlertsContactsCreate,
  AlertsCreate,
  AlertsDetails,
  AlertsDetailsSLO,
} from './NewAlerts';
import AlertsNewRule from './AlertsNewRule';
import { BullseyeDashboards, ControlPlane } from './Kfuse';
import { Dashboard, DashboardList } from './Dashboard';
import { EventsAnalytics, EventsExplorer } from './Events';
import { GrafanaMetrics, GrafanaLogs } from './Grafana';
import Header from './Header';
import Knight from './Knight';
import KubernetesServices from './KubernetesServices';
import Logs from './Logs';
import Metrics from './NewMetrics';
import MetricsSummary from './MetricsSummary';
import Serverless from './Serverless';
import Service from './Service';
import Services from './Services';
import TracesContainer from './Traces';
import Topology from './Topology';
import Transactions from './Transactions';
import Cicd from './Cicd/Cicd';
import CicdPipeline from './CicdPipeline';
import Kubernates from './Kubernetes/Kubernetes';
import { SLOCreate, SLOs } from './SLO';

type Props = {
  auth: ReturnType<typeof useAuth>;
};

const hostnameWhitelist: { [key: string]: number } = {
  'playground.kloudfuse.io': 1,
  'iris.kloudfuse.io': 1,
  'kfuse-reltio.kloudfuse.io': 1,
};

const App = ({ auth }: Props): ReactElement => {
  const { service } = useParams();
  useEffect(() => {
    const hostname = window.location.hostname;

    if (hostnameWhitelist[hostname]) {
      datadogRum.init({
        applicationId: '46f94d8e-7232-4bb7-ba10-e095727a4217',
        clientToken: 'pubed9555f1b6c9edd4d47709dc73f86ce7',
        env: hostname,
        site: 'datadoghq.com',
        service: 'kf-frontend',
        sampleRate: 100,
        sessionReplaySampleRate: 20,
        trackInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input',
      });

      datadogRum.startSessionReplayRecording();
    }
  }, []);

  return (
    <HashRouter>
      <ModalsContextProvider>
        <PopoverContextProvider>
          <div className="app">
            <Header auth={auth} />
            <div className="body">
              <Routes>
                <Route path="/" element={<Navigate replace to="/logs" />} />
                <Route path="/apm">
                  <Route element={<Services />} path="/apm/services" />
                  <Route
                    element={<Service key={service} />}
                    path="/apm/services/:service"
                  />
                  <Route path="/apm/traces">
                    <Route element={<TracesContainer />} path=":tab" />
                    <Route element={<TracesContainer />} path="" />
                  </Route>
                  <Route element={<SLOs />} path="/apm/slo" />
                  <Route path="/apm/slo/create" element={<SLOCreate />} />
                </Route>
                <Route path="/events/analytics" element={<EventsAnalytics />} />
                <Route path="/events" element={<EventsExplorer />} />
                <Route path="/grafana-metrics" element={<GrafanaMetrics />} />
                <Route path="/grafana-logs" element={<GrafanaLogs />} />
                <Route
                  path="/kfuse/:dashboardName"
                  element={<ControlPlane />}
                />
                <Route element={<Metrics />} path="/metrics" />
                <Route element={<MetricsSummary />} path="/metrics/summary" />
                <Route
                  path="/metrics/dashboard/lists"
                  element={<DashboardList />}
                />
                <Route
                  path="/metrics/dashboard/:dashboardId"
                  element={<Dashboard />}
                />
                <Route path="/logs">
                  <Route element={<Logs user={auth.user} />} path=":tab" />
                  <Route element={<Logs user={auth.user} />} path="" />
                </Route>
                <Route element={<Topology />} path="/topology" />
                <Route element={<Knight />} path="/knight" />
                <Route element={<Alerts />} path="/alerts" />
                <Route element={<AlertsContacts />} path="/alerts/contacts" />
                <Route
                  element={<AlertsContactsCreate />}
                  path="/alerts/contacts/create"
                />
                <Route element={<AlertsCreate />} path="/alerts/create" />
                <Route element={<AlertsDetails />} path="/alerts/details" />
                <Route
                  element={<AlertsDetailsSLO />}
                  path="/alerts/details/slo"
                />
                <Route element={<Transactions />} path="/transactions" />
                <Route element={<AlertsNewRule />} path="/alerts/new-rule" />
                <Route element={<Cicd />} path="/cicd" />
                <Route
                  element={<CicdPipeline key={service} />}
                  path="/cicd/:service"
                />
                <Route path="/serverless" element={<Serverless />} />
                <Route path="/kubernetes" element={<Kubernates />} />
                <Route
                  path="/analytics/services"
                  element={<KubernetesServices />}
                />
                <Route
                  path="/analytics/services/bullseye"
                  element={<BullseyeDashboards />}
                />
              </Routes>
            </div>
            <Modals />
            <Popover />
            <Toasts />
          </div>
        </PopoverContextProvider>
      </ModalsContextProvider>
    </HashRouter>
  );
};

export default App;
