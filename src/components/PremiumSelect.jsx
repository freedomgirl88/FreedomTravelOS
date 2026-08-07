import { ChevronDown } from "lucide-react";

export default function PremiumSelect({ label, icon: Icon, value, onChange, children, className = "" }) {
  return (
    <label className={`premium-select-field ${className}`.trim()}>
      <span className="premium-select-label">{Icon && <Icon size={16}/>} {label}</span>
      <span className="premium-select-shell">
        {Icon && <Icon className="premium-select-leading" size={18}/>} 
        <select value={value} onChange={onChange} aria-label={label}>{children}</select>
        <ChevronDown className="premium-select-arrow" size={18}/>
      </span>
    </label>
  );
}
