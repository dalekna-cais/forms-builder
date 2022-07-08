import type {UseFormReturn} from 'react-hook-form';
import type {FieldProps, JsonFieldProps} from './context';
import {mergeDeepRight} from 'ramda';

const translateFields = (
  methods?: UseFormReturn<Record<string, any>, object>,
) => {
  return (field: FieldProps, key: string) => {
    const {validate, ...value}: Omit<FieldProps, 'name'> = field;

    if (validate && validate.isAMatch) {
      value.options = mergeDeepRight(value.options ?? {}, {
        validate: {
          isAMatch: (val: string) => {
            const isAMatch = validate.isAMatch;
            return (
              val?.toLowerCase() ===
                methods?.watch(isAMatch.with)?.toLowerCase() || isAMatch.message
            );
          },
        },
      });
    }

    return {...value, name: key};
  };
};

export const convertFieldsToJs = (
  methods?: UseFormReturn<Record<string, any>, object>,
) => {
  return (
    json: JsonFieldProps,
  ): {fields: FieldProps[]; defaultValues: Record<string, any>} => {
    const fields = Object.keys(json).reduce<FieldProps[]>((acc, key) => {
      const value: FieldProps = json[key];

      const field = translateFields(methods)(value, key);

      return [...acc, field];
    }, []);

    // default values can be taken after processing json to js
    const defaultValues: any = fields.reduce((acc, field) => {
      if (!field.options?.value) return acc;
      return {
        ...acc,
        [field.name]: field.options?.value,
      };
    }, {});

    return {fields, defaultValues};
  };
};
