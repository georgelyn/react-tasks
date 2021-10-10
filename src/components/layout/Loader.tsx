import './Loader.css';

function Loader(props: { show: boolean }) {
  return props.show ? (
    <div className="loader-container">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  ) : null;
}

export default Loader;
