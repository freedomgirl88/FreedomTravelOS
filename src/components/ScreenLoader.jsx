export default function ScreenLoader({ label = "Loading trip tools" }) {
  return (
    <div className="screen-loader" role="status" aria-live="polite" aria-label={label}>
      <span className="screen-loader-orbit" aria-hidden="true" />
      <strong>{label}</strong>
      <small>Your saved trip data stays on this device.</small>
    </div>
  );
}
