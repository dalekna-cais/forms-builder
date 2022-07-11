import * as React from 'react';
import type {RegisterOptions, UseFormReturn} from 'react-hook-form';
import {convertJsonToSectionsWithFields} from './convertFieldsToJs';

export type FieldInputTypes =
  | 'text'
  | 'password'
  | 'radio'
  | 'checkbox'
  | 'select'
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
  hint?: string;
  type: FieldInputTypes;
  order: number;
  placeholder?: string;
  items?: {value: any; label: string}[];
  // config?: any;
  options?: RegisterOptions<any, any>;
};
export type SectionProps = {
  id: string;
  title: string;
  columns?: number;
  fields: FieldProps[];
};
export type FormFieldsContextProps = {
  settings: Record<string, any>;
  definitions: JsonSectionProps;
  getSections: (methods: UseFormReturn<Record<string, any>, object>) => {
    sections: SectionProps[];
    defaultValues: Record<string, any>;
  };
  defaultValues: Record<string, any>;
};
export const FormFieldsContext = React.createContext<FormFieldsContextProps>({
  settings: {withSidebar: false},
  definitions: {},
  getSections: () => ({sections: [], defaultValues: {}}),
  defaultValues: {},
});

export interface JsonFieldProps extends Omit<FieldProps, 'name' | 'options'> {
  config?: any;
}
// export type JsonSectionProps = {
//   [key: string]: {
//     title: string;
//     fields: {
//       [name: string]: JsonFieldProps;
//     };
//   };
// };
export type JsonSectionProps = Record<string, any>;
export interface FormFieldsProviderProps {
  children: Function | React.ReactNode;
  json: JsonSectionProps;
}
export const FormFieldsProvider = ({
  children,
  json = {},
}: FormFieldsProviderProps) => {
  const {definitions, ...settings} = json;

  const getSections = React.useCallback(
    (methods?: UseFormReturn<Record<string, any>, object>) => {
      return convertJsonToSectionsWithFields(methods)(definitions);
    },
    [definitions],
  );

  const defaultValues = React.useMemo(() => {
    return convertJsonToSectionsWithFields()(definitions).defaultValues;
  }, [definitions]);

  const forwardProps = {definitions, settings, getSections, defaultValues};
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
