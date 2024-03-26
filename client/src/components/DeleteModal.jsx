const DeleteModal = ({ showModal, cancelDelete, confirmDelete, entityType, errorMessage }) => {
  let entityName;
  switch (entityType) {
    case 'departments':
      entityName = 'department';
      break;
    case 'roles':
      entityName = 'role';
      break;
    case 'employees':
      entityName = 'employee';
      break;
    case 'managers':
      entityName = 'manager';
      break;
    default:
      entityName = 'item';
  }

  return (
    <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            <button type="button" className="btn-close" onClick={cancelDelete}></button>
          </div>
          <div className="modal-body">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {!errorMessage && `Are you sure you want to delete this ${entityName}?`}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={errorMessage && errorMessage.props.children[1].props.children.length > 0}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
