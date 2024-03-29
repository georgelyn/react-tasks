import { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusSquare,
  faHome,
  faSignOutAlt,
  faCat,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import QuickTask from '../task/QuickTask';
import { logOut } from '../../contexts/AuthContext';
import './Header.css';

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
  const [toggle, setToggle] = useState(false);
  const history = useHistory();

  const handleAddTask = () => {
    try {
      history.push('/task');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedirect = (event: any) => {
    try {
      history.push(`/${event.target.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <QuickTask showModal={showModal} setShowModal={setShowModal} />
      <div className={`header ${toggle ? 'header-toggle' : ''}`}>
        <FontAwesomeIcon
          onClick={() => setToggle(!toggle)}
          icon={faBars}
          className={'header-fa-bars'}
        ></FontAwesomeIcon>
        <NavLink to="/" className="header-logo">
          <p>
            <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
            Tasks
          </p>
        </NavLink>
        {props.showAddTask && (
          <>
            <p
              id="task"
              className="header-quick-task-btn"
              onClick={handleRedirect}
            >
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
            <p
              id="categories"
              className="header-quick-task-btn"
              onClick={handleRedirect}
            >
              <FontAwesomeIcon icon={faCat}></FontAwesomeIcon>
              Categories
            </p>
          </>
        )}
        <p className="header-log-out-btn" onClick={signOut}>
          <FontAwesomeIcon icon={faSignOutAlt}></FontAwesomeIcon>Log Out
        </p>
      </div>
    </>
  );
}
