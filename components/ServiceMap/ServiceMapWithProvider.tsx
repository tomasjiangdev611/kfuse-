import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import ServiceMap from './ServiceMap';

const ServiceMapWithProvider = (props) => (
  <ReactFlowProvider>
    <ServiceMap {...props} />
  </ReactFlowProvider>
);

export default ServiceMapWithProvider;
