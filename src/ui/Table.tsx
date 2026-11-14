import React from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right";
  widthClass?: string;
}

export interface TableProps<T> {
  caption?: string;
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string;
}

export function Table<T>({ caption, columns, rows, getRowKey }: TableProps<T>) {
  return (
    <div
      tabIndex={0}
      aria-label={caption}
      className="w-full overflow-x-auto rounded-[10px] border border-[var(--line)] bg-[var(--paper)]"
    >
      <table className="w-full text-left border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-[var(--stone)] border-b border-[var(--line)]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`py-3 px-4 font-semibold text-xs text-[var(--ink)] whitespace-nowrap ${
                  col.align === "right" ? "text-right" : "text-left"
                } ${col.widthClass ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {rows.map((row, idx) => (
            <tr key={getRowKey(row, idx)} className="min-h-[48px] bg-[var(--paper)]">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-4 text-[var(--ink)] align-middle min-h-[48px] ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
