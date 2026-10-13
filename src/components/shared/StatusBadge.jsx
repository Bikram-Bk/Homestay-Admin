export default function StatusBadge({ status }) {
  const normalized = (status || "").toUpperCase();

  const configs = {
    PENDING: {
      label: "Pending",
      classes: "bg-[#FCF3DC] text-[#946B16] border-[#946B16]/30",
      dot: "bg-[#946B16]",
    },
    PAID: {
      label: "Paid",
      classes: "bg-[#E8F4EC] text-[#287451] border-[#287451]/30",
      dot: "bg-[#287451]",
    },
    CONFIRMED: {
      label: "Confirmed",
      classes: "bg-[#E8F4EC] text-[#287451] border-[#287451]/30",
      dot: "bg-[#287451]",
    },
    CANCELLED: {
      label: "Cancelled",
      classes: "bg-[#FBECEC] text-[#B54747] border-[#B54747]/30",
      dot: "bg-[#B54747]",
    },
  };

  const current = configs[normalized] || {
    label: status || "Unknown",
    classes: "bg-black/5 text-admin-muted border-admin-border",
    dot: "bg-admin-muted",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}
