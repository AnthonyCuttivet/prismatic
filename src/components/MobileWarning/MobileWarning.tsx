import './MobileWarning.css';

function MobileWarning() {
  return (
    <div className="mobile-warning">
      <div className="mobile-warning__content">
        <h1 className="mobile-warning__title">Desktop Only</h1>
        <p className="mobile-warning__message">
          The handheld version of this app is currently being worked on.
        </p>
        <p className="mobile-warning__submessage">
          Please visit this site on a desktop for the optimal experience.
        </p>
      </div>
    </div>
  );
}

export default MobileWarning;
