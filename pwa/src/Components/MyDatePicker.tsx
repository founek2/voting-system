import {
  DatePicker as OriginalDatePicker
} from "@mui/x-date-pickers/DatePicker";
import React from "react";
import { Controller, FieldPath, FieldValues, UseControllerProps } from "react-hook-form";

export function MyDatePickerControlled<
  TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  {
    control,
    name,
    defaultValue,
    label,
    ...props
  }: UseControllerProps<TFieldValues, TName> & { label: string },
) {
  return (
    <Controller
      name={name}
      defaultValue={defaultValue ? (new Date(defaultValue) as any) : undefined}
      control={control}
      {...props}
      render={({ field }) => {
        return <OriginalDatePicker
          slotProps={{ textField: { fullWidth: true } }}
          label={label}
          value={field.value ? new Date(field.value) : null}
          onChange={(date) => {
            field.onChange(date)
          }}
          name={name}
        />
      }}
    />
  );
};
