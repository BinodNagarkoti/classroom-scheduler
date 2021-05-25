
import {
  clearFormData,
} from '../redux/classes';
import { useDispatch } from 'react-redux';


export const BootstrapModal = ({ children, title, }) => {
  const dispatch = useDispatch();
    return (<>
          <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                {title}
              </h5>
              <button type="button" className="close" data-dismiss="modal" onClick={() => dispatch(clearFormData())} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
                        <div className="container">
                            {children}
                        </div>
            </div>
          </div>
        </div>
      </div>
        </>)
}