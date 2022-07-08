import * as React from 'react';
import type {RegisterOptions, UseFormReturn} from 'react-hook-form';
import {convertFieldsToJs} from './convertFieldsToJs';

export type FieldInputTypes =
  | 'text'
  | 'password'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'image'
  | 'color'
  | 'date'
  | 'datetime'
  | 'email'
  | 'month'
  | 'number'
  | 'url'
  | 'week'
  | 'search'
  | 'tel';
export type FieldProps = {
  name: string;
  label: string;
  type: FieldInputTypes;
  order: number;
  placeholder?: string;
  validate?: any;
  options?: RegisterOptions<any, any>;
};
export type FormFieldsContextProps = {
  json: JsonFieldProps;
  getFields: (methods: UseFormReturn<Record<string, any>, object>) => {
    fields: FieldProps[];
    defaultValues: Record<string, any>;
  };
  defaultValues: Record<string, any>;
};
export const FormFieldsContext = React.createContext<FormFieldsContextProps>({
  json: {},
  getFields: () => ({fields: [], defaultValues: {}}),
  defaultValues: {},
});

export type JsonFieldProps = Record<string, any>;
export interface FormFieldsProviderProps {
  children: Function | React.ReactNode;
  json: JsonFieldProps;
}
export const FormFieldsProvider = ({
  children,
  json = [],
}: FormFieldsProviderProps) => {
  const getFields = React.useCallback(
    (methods?: UseFormReturn<Record<string, any>, object>) => {
      return convertFieldsToJs(methods)(json);
    },
    [json],
  );

  const defaultValues = React.useMemo(() => {
    return convertFieldsToJs()(json).defaultValues;
  }, [json]);

  const forwardProps = {json, getFields, defaultValues};
  const ui = typeof children === 'function' ? children(forwardProps) : children;
  return (
    <FormFieldsContext.Provider value={forwardProps}>
      {ui}
    </FormFieldsContext.Provider>
  );
};

export const useFormFieldsContext = () => {
  const utils = React.useContext(FormFieldsContext);
  if (!utils) {
    throw new Error(
      `FormFields compound components cannot be rendered outside the FormFieldsProvider`,
    );
  }
  return utils;
};
