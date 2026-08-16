import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export const DataTable = ({
  columns,
  data = [],
  searchable = true,
  searchPlaceholder = 'Search records...',
  pageSize = 6,
  emptyMessage = 'No matching records found',
  actions,
}) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = data.filter((row) =>
    columns.some((col) => {
      const val = col.accessorKey ? row[col.accessorKey] : col.accessorFn ? col.accessorFn(row) : '';
      return String(val || '').toLowerCase().includes(query.toLowerCase());
    })
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full space-y-4">
      {searchable && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-red-500 shadow-sm"
            />
          </div>
          {actions}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-600 border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3.5">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length > 0 ? (
              paginated.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-3.5 font-medium text-slate-800">
                      {col.cell ? col.cell(row) : row[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-slate-300" />
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>
            Showing {Math.min((page - 1) * pageSize + 1, filtered.length)} to{' '}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
