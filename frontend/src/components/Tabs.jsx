// A row of buttons where one is selected. The parent owns which one
// (`active`) and is told about clicks through onChange(id).
// tabs: [{ id, label }]; label: what the group is for, read by screen readers
export default function Tabs({ tabs, active, onChange, label }) {
  return (
    <div className="tabs" role="group" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={tab.id === active ? 'button' : 'button button-secondary'}
          aria-pressed={tab.id === active}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
