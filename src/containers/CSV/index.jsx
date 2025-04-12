import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import showResults from '../Form/Show';
import FileUploadDefault from './components/FileUploadDefault';

const FileUpload = ({ t }) => (
  <Container>
    <Row>
      <Col md={12}>
        <h3 className="page-title">{"Reconciliation"}</h3>
       </Col>
    </Row>
    <FileUploadDefault onSubmit={showResults} />
  </Container>
);
FileUpload.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(FileUpload);
