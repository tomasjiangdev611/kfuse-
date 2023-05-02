import React, { ReactNode } from 'react';
import { BsHddNetwork } from 'react-icons/bs';
import { FiTool } from 'react-icons/fi';
import { HiQueueList } from 'react-icons/hi2';
import { RiDatabase2Line } from 'react-icons/ri';
import { SiRedis } from 'react-icons/si';
import { TbWorld } from 'react-icons/tb';

const iconsBySpanType: { [key: string]: ReactNode } = {
  cache: <SiRedis size={14} />,
  custom: <FiTool size={14} />,
  db: <RiDatabase2Line size={14} />,
  http: <BsHddNetwork size={14} />,
  queue: <HiQueueList size={14} />,
  web: <TbWorld size={14} />,
};

export default iconsBySpanType;
