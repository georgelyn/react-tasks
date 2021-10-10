import './Loader.css';

function Loader(props: { show: boolean }) {
  return props.show ? (
    <div className="loader-container">
      <div className="lds-dual-ring"></div>
      <div className="lds-dual-ring-inner"></div>
    </div>
  ) : null;
}

export default Loader;
