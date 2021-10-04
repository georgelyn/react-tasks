import './Header.css';
import { logOut } from '../../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusSquare,
  faHome,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { NavLink, useHistory } from 'react-router-dom';
import QuickTask from '../../task/QuickTask';
import { useState } from 'react';

const signOut = () => {
  logOut()
    .then(() => {
      console.log('logged out');
    })
    .catch((error) => {
      console.error(error);
    });
};

export default function Header(props: { showAddTask: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const handleAddTask = () => {
    try {
      history.push('/task');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="header">
      <QuickTask showModal={showModal} setShowModal={setShowModal} />
      <NavLink to="/" className="header-logo">
        <p>
          <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>Geo-Tasks
        </p>
      </NavLink>
      {props.showAddTask && (
        <>
          <p className="header-quick-task-btn" onClick={handleAddTask}>
            <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
            Add task
          </p>
          <p
            className="header-quick-task-btn"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
            Quick task
          </p>
        </>
      )}
      <p className="header-log-out-btn" onClick={signOut}>
        <FontAwesomeIcon icon={faSignOutAlt}></FontAwesomeIcon>Log Out
      </p>
    </div>
  );
}
