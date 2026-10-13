export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  confirmVariant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
  children,
}) {
  if (!isOpen) return null;

  const btnColors = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    primary: "bg-terracotta hover:bg-terracotta-dark text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="admin-card w-full max-w-md p-6 shadow-2xl border-admin-border bg-admin-card">
        <h3 className="text-lg font-bold text-admin-text">{title}</h3>
        <p className="text-sm text-admin-muted mt-2">{message}</p>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="admin-btn-ghost text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer ${
              btnColors[confirmVariant] || btnColors.danger
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
