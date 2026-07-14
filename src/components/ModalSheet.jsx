export default function ModalSheet({ title, open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <strong>{title}</strong>
          <button className="sheet-close" onClick={onClose}>Close</button>
        </div>
        {children}
      </section>
    </div>
  );
}
