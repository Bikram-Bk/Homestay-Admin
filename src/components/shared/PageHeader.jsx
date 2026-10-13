import Link from "next/link";

export default function PageHeader({ title, subtitle, actionText, actionHref, onAction, actionIcon }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-admin-text">{title}</h1>
        {subtitle && <p className="text-sm text-admin-muted mt-1">{subtitle}</p>}
      </div>
      {actionHref && (
        <Link href={actionHref} className="admin-btn-primary shadow-sm">
          {actionIcon}
          {actionText}
        </Link>
      )}
      {onAction && !actionHref && (
        <button onClick={onAction} className="admin-btn-primary shadow-sm">
          {actionIcon}
          {actionText}
        </button>
      )}
    </div>
  );
}
