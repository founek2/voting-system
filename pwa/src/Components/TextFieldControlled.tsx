import { TextField, TextFieldProps } from "@mui/material";
import React from "react";
import {
  Controller,
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

type TextFieldControlledProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<
  TextFieldProps,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur"
> &
  UseControllerProps<TFieldValues, TName> & {
    formatValue?: (
      value: FieldPathValue<TFieldValues, TName>
    ) => TextFieldProps["value"];
    parseValue?: (
      value: string
    ) => FieldPathValue<TFieldValues, TName>;
  };

export function TextFieldControlled<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  rules,
  defaultValue,
  shouldUnregister,
  disabled,
  formatValue,
  parseValue,
  ...textFieldProps
}: TextFieldControlledProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      disabled={disabled}
      render={({ field }) => (
        <TextField
          {...textFieldProps}
          name={field.name}
          value={
            formatValue
              ? formatValue(field.value)
              : (field.value ?? "")
          }
          onChange={(event) => {
            field.onChange(
              parseValue ? parseValue(event.target.value) : event
            );
          }}
          onBlur={field.onBlur}
          inputRef={field.ref}
          disabled={disabled ?? field.disabled}
        />
      )}
    />
  );
}
