"use client";

import { DecisionDefinition, AnswerValue } from "@/lib/types";
import { FreeTextInput } from "./free-text-input";
import { SingleSelectInput } from "./single-select";
import { MultiSelectInput } from "./multi-select";
import { NumericInput } from "./numeric-input";
import { YesNoToggle } from "./yes-no-toggle";
import { FileUploadInput } from "./file-upload";
import { DataTableInput } from "./data-table-input";

interface InputRendererProps {
  definition: DecisionDefinition;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  disabled?: boolean;
}

export function InputRenderer({
  definition,
  value,
  onChange,
  disabled,
}: InputRendererProps) {
  switch (definition.inputType) {
    case "free_text":
    case "rich_text":
      return (
        <FreeTextInput
          value={(value as string) || ""}
          onChange={onChange}
          placeholder={definition.placeholder}
          disabled={disabled}
        />
      );

    case "single_select":
      return (
        <SingleSelectInput
          options={definition.options || []}
          value={(value as string) || ""}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case "multi_select":
      return (
        <MultiSelectInput
          options={definition.options || []}
          value={(value as string[]) || []}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case "numeric":
      return (
        <NumericInput
          value={value as number | null}
          onChange={onChange}
          validation={definition.numericValidation}
          placeholder={definition.placeholder}
          disabled={disabled}
        />
      );

    case "yes_no":
      return (
        <YesNoToggle
          value={value as boolean | null}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case "file_upload":
      return (
        <FileUploadInput
          placeholder={definition.placeholder}
          disabled={disabled}
        />
      );

    case "data_table":
      return (
        <DataTableInput
          columns={definition.tableColumns || []}
          value={(value as Record<string, string | number | boolean>[]) || []}
          onChange={onChange}
          disabled={disabled}
        />
      );

    default:
      return (
        <p className="text-sm text-muted-foreground">
          Unsupported input type: {definition.inputType}
        </p>
      );
  }
}
