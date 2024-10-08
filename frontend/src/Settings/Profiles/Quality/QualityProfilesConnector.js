import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchMovieCollections } from 'Store/Actions/movieCollectionActions';
import { cloneQualityProfile, deleteQualityProfile, fetchQualityProfiles } from 'Store/Actions/settingsActions';
import createSortedSectionSelector from 'Store/Selectors/createSortedSectionSelector';
import sortByProp from 'Utilities/Array/sortByProp';
import QualityProfiles from './QualityProfiles';

function createMapStateToProps() {
  return createSelector(
    createSortedSectionSelector('settings.qualityProfiles', sortByProp('name')),
    (qualityProfiles) => qualityProfiles
  );
}

const mapDispatchToProps = {
  dispatchFetchQualityProfiles: fetchQualityProfiles,
  dispatchDeleteQualityProfile: deleteQualityProfile,
  dispatchCloneQualityProfile: cloneQualityProfile,
  dispatchFetchMovieCollections: fetchMovieCollections
};

class QualityProfilesConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.dispatchFetchQualityProfiles();
    this.props.dispatchFetchMovieCollections();
  }

  //
  // Listeners

  onConfirmDeleteQualityProfile = (id) => {
    this.props.dispatchDeleteQualityProfile({ id });
  };

  onCloneQualityProfilePress = (id) => {
    this.props.dispatchCloneQualityProfile({ id });
  };

  //
  // Render

  render() {
    return (
      <QualityProfiles
        onConfirmDeleteQualityProfile={this.onConfirmDeleteQualityProfile}
        onCloneQualityProfilePress={this.onCloneQualityProfilePress}
        {...this.props}
      />
    );
  }
}

QualityProfilesConnector.propTypes = {
  dispatchFetchQualityProfiles: PropTypes.func.isRequired,
  dispatchDeleteQualityProfile: PropTypes.func.isRequired,
  dispatchCloneQualityProfile: PropTypes.func.isRequired,
  dispatchFetchMovieCollections: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(QualityProfilesConnector);
