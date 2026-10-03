// One component for errors and empty states: say what happened and what to do next
export default function Notice({ tone = 'info', title, children, action }) {
  return (
    <div className={`notice notice-${tone}`} role={tone === 'error' ? 'alert' : undefined}>
      {title && <h2 className="notice-title">{title}</h2>}
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
