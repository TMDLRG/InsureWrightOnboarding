"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableColumn, TableRow } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

interface DataTableInputProps {
  columns: TableColumn[];
  value: TableRow[];
  onChange: (value: TableRow[]) => void;
  disabled?: boolean;
}

export function DataTableInput({
  columns,
  value,
  onChange,
  disabled,
}: DataTableInputProps) {
  const addRow = () => {
    const newRow: TableRow = {};
    for (const col of columns) {
      newRow[col.key] = col.type === "number" ? 0 : "";
    }
    onChange([...value, newRow]);
  };

  const removeRow = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const updateCell = (
    rowIdx: number,
    colKey: string,
    cellValue: string | number
  ) => {
    const updated = [...value];
    updated[rowIdx] = { ...updated[rowIdx], [colKey]: cellValue };
    onChange(updated);
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* Table */}
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-10">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-2 text-left text-xs font-medium text-muted-foreground"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate block">
                          {col.label}
                          {col.required && (
                            <span className="text-red-500 ml-0.5">*</span>
                          )}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{col.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                ))}
                <th className="px-3 py-2 w-10" />
              </tr>
            </thead>
            <tbody>
              {value.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className="px-3 py-6 text-center text-xs text-muted-foreground"
                  >
                    No entries yet. Click &quot;Add Row&quot; to begin.
                  </td>
                </tr>
              ) : (
                value.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b last:border-0">
                    <td className="px-3 py-1.5 text-xs text-muted-foreground">
                      {rowIdx + 1}
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="px-2 py-1.5">
                        {col.type === "select" && col.options ? (
                          <Select
                            value={String(row[col.key] || "")}
                            onValueChange={(v) =>
                              updateCell(rowIdx, col.key, v)
                            }
                            disabled={disabled}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {col.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input
                                type={col.type === "number" ? "number" : "text"}
                                value={String(row[col.key] ?? "")}
                                onChange={(e) =>
                                  updateCell(
                                    rowIdx,
                                    col.key,
                                    col.type === "number"
                                      ? Number(e.target.value)
                                      : e.target.value
                                  )
                                }
                                disabled={disabled}
                                className="h-8 text-xs truncate"
                              />
                            </TooltipTrigger>
                            {String(row[col.key] ?? "").length > 20 && (
                              <TooltipContent
                                side="bottom"
                                className="max-w-xs"
                              >
                                <p className="break-words">
                                  {String(row[col.key])}
                                </p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        )}
                      </td>
                    ))}
                    <td className="px-2 py-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRow(rowIdx)}
                        disabled={disabled}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={addRow}
          disabled={disabled}
          className="text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Row
        </Button>
      </div>
    </TooltipProvider>
  );
}
