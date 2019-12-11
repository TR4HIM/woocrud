import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const ModalConfirmation = ({ product , openModalConfirmation , validateAction}) => {

  return (
    <Dialog
        open={openModalConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id="delete-modal-confirmation"
    >
        <DialogTitle id="alert-dialog-title">
            Warning
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete <strong> { product } </strong>  ?
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => validateAction(false)} color="primary">
            Cancel
        </Button>
        <Button onClick={() => validateAction(true)} color="primary" autoFocus>
            Yes
        </Button>
        </DialogActions>
    </Dialog>
  );
}

ModalConfirmation.propTypes = {
    product : PropTypes.string,
    openModal : PropTypes.bool,
    validateAction : PropTypes.func,
}

export default ModalConfirmation; 