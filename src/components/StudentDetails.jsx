function StudentDetails({
  student,
  onClose
}) {

  if (!student) {
    return null;
  }


  return (

    <div className="modal-overlay">

      <div className="details-modal">

        <div className="modal-header">

          <h2>
            Student Details
          </h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <div className="student-details">

          <div className="detail-row">

            <span>
              ID
            </span>

            <strong>
              {student.id}
            </strong>

          </div>


          <div className="detail-row">

            <span>
              Name
            </span>

            <strong>
              {student.name}
            </strong>

          </div>


          <div className="detail-row">

            <span>
              Email
            </span>

            <strong>
              {student.email}
            </strong>

          </div>


          <div className="detail-row">

            <span>
              Department
            </span>

            <strong>
              {student.department}
            </strong>

          </div>


          <div className="detail-row">

            <span>
              Age
            </span>

            <strong>
              {student.age}
            </strong>

          </div>

        </div>


        <div className="modal-footer">

          <button
            className="cancel-button"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default StudentDetails;