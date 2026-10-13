export default function StatCard({ title, value, icon, subtitle, color = "gold" }) {
  const colorStyles = {
    gold: "text-gold bg-gold/10 border-gold/25",
    terracotta: "text-terracotta bg-terracotta/10 border-terracotta/25",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/25",
    green: "text-green-400 bg-green-500/10 border-green-500/25",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/25",
  };

  return (
    <div className="admin-card p-5 relative overflow-hidden transition-all duration-200 hover:border-teal/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">{title}</p>
          <h3 className="text-2xl font-bold text-admin-text mt-2 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-admin-muted mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorStyles[color] || colorStyles.gold}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
