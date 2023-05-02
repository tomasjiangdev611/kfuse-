import React from 'react';
import { Clock, Link2, Mail } from 'react-feather';
import { BiTag } from 'react-icons/bi';
import { TiSortAlphabetically, TiSortNumerically } from 'react-icons/ti';

const LogsFacetGroupFacetIcon = ({ type }) => {
  switch (type) {
    case 'duration':
      return (
        <Clock
          className="logs__facet-group__facet__title__icon--feather"
          size={13}
        />
      );
    case 'email':
      return (
        <Mail
          className="logs__facet-group__facet__title__icon--feather"
          size={13}
        />
      );
    case 'loglevel':
      return (
        <BiTag
          className="logs__facet-group__facet__title__icon--react-icons"
          size={18}
        />
      );
    case 'number':
      return (
        <TiSortNumerically
          className="logs__facet-group__facet__title__icon--react-icons"
          size={18}
        />
      );
    case 'string':
      return (
        <TiSortAlphabetically
          className="logs__facet-group__facet__title__icon--react-icons"
          size={18}
        />
      );
    case 'url':
      return (
        <Link2
          className="logs__facet-group__facet__title__icon--feather"
          size={13}
        />
      );
    case 'uuid':
      return (
        <span className="logs__facet-group__facet__title__icon--text">id</span>
      );
    default:
      return null;
  }
};

export default LogsFacetGroupFacetIcon;
