import * as React from 'react';
import type {RegisterOptions, UseFormReturn} from 'react-hook-form';
import {convertJsonToSectionsWithFields} from './convertFieldsToJs';

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
export type SectionProps = {
  title: string;
  fields: FieldProps[];
};
export type FormFieldsContextProps = {
  json: JsonFieldProps;
  getSections: (methods: UseFormReturn<Record<string, any>, object>) => {
    sections: SectionProps[];
    defaultValues: Record<string, any>;
  };
  defaultValues: Record<string, any>;
};
export const FormFieldsContext = React.createContext<FormFieldsContextProps>({
  json: {},
  getSections: () => ({sections: [], defaultValues: {}}),
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
  const getSections = React.useCallback(
    (methods?: UseFormReturn<Record<string, any>, object>) => {
      return convertJsonToSectionsWithFields(methods)(json);
    },
    [json],
  );

  const defaultValues = React.useMemo(() => {
    return convertJsonToSectionsWithFields()(json).defaultValues;
  }, [json]);

  const forwardProps = {json, getSections, defaultValues};
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
