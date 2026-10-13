export default function DataTable({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = "No records found",
  page,
  totalPages,
  onPageChange,
}) {
  if (isLoading) {
    return (
      <div className="admin-card overflow-hidden">
        <div className="p-12 text-center text-admin-muted text-sm flex flex-col items-center justify-center gap-3">
          <svg className="animate-spin h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading data...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="admin-card overflow-hidden">
        <div className="p-12 text-center text-admin-muted text-sm">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-admin-text">
          <thead className="bg-mist/50 border-b border-admin-border text-xs uppercase tracking-wider text-admin-muted">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-4 py-3 font-semibold ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {data.map((row, rowIdx) => (
              <tr key={row.id || rowIdx} className="hover:bg-mist/40 transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`px-4 py-3.5 text-sm ${col.className || ""}`}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-admin-border flex items-center justify-between text-xs text-admin-muted">
          <span>Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange && onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-2.5 py-1 rounded border border-admin-border hover:bg-mist disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange && onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-2.5 py-1 rounded border border-admin-border hover:bg-mist disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
