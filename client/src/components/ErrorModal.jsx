const ErrorModal = ({ errorMessage, closeModal, entityType, entityAction }) => {
  let entityTypeName;
  switch (entityType) {
    case 'departments':
      entityTypeName = 'department';
      break;
    case 'roles':
      entityTypeName = 'role';
      break;
    case 'employees':
      entityTypeName = 'employee';
      break;
    case 'managers':
      entityTypeName = 'manager';
      break;
    default:
      entityTypeName = 'item';
  }

  let entityActionMessage;
  switch (entityAction) {
    case 'add':
      entityActionMessage = 'adding';
      break;
    case 'edit':
      entityActionMessage = 'editing';
      break;
    default:
      entityActionMessage = 'modifying';
  }

  return (
    <div className="modal" style={{ display: errorMessage ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Error</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-danger">
              <p>Error occurred while {entityActionMessage} {entityTypeName}:</p>
              <ul>
                <li>{errorMessage}</li>
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
