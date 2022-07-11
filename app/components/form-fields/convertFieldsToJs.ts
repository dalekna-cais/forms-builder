import type {UseFormReturn} from 'react-hook-form';
import {mergeDeepRight} from 'ramda';
import type {
  FieldProps,
  JsonSectionProps,
  JsonFieldProps,
  SectionProps,
} from './context';

const transformField = (
  methods?: UseFormReturn<Record<string, any>, object>,
) => {
  return (field: FieldProps, key: string): FieldProps => {
    const {config = {}, ...value}: JsonFieldProps = field;
    let options = {...config};

    // TODO: could have an object with all props to match
    // Object.keys(config).forEach(key => {
    //   options = mergeDeepRight(options, dictionary[key])
    // })

    if ('isAMatch' in config) {
      const isAMatch = config.isAMatch;

      options = mergeDeepRight(options, {
        validate: {
          isAMatch: (val: string) => {
            return (
              val?.toLowerCase() ===
                methods?.watch(isAMatch.field)?.toLowerCase() ||
              isAMatch.message
            );
          },
        },
      });
    }

    if ('pattern' in config) {
      const pattern = config.pattern;

      options = mergeDeepRight(options, {
        pattern: {
          value: new RegExp(pattern.value),
          message: pattern.message,
        },
      });
    }

    return {...value, options, name: key};
  };
};

const transformFields = (
  methods?: UseFormReturn<Record<string, any>, object>,
) => {
  return (section: JsonSectionProps): FieldProps[] => {
    const fields = Object.keys(section.fields).reduce<FieldProps[]>(
      (acc, sectionName) => {
        const value: FieldProps = section.fields[sectionName];

        const field = transformField(methods)(value, sectionName);

        return [...acc, field];
      },
      [],
    );

    return fields;
  };
};

export const convertJsonToSectionsWithFields = (
  methods?: UseFormReturn<Record<string, any>, object>,
) => {
  return (
    json: JsonSectionProps,
  ): {sections: SectionProps[]; defaultValues: Record<string, any>} => {
    const sections = Object.keys(json).reduce<SectionProps[]>((acc, key) => {
      const section: SectionProps = json[key];

      const fields = transformFields(methods)(section);

      return [...acc, {...section, id: key, fields}];
    }, []);

    /** get default values for the react hook form */
    const defaultValues = Object.keys(json).reduce<Record<string, any>>(
      (_acc, key) => {
        const section: SectionProps = json[key];
        const result = Object.keys(section.fields).reduce((acc, fieldName) => {
          const value: FieldProps = section.fields[fieldName as any];
          return {
            ...acc,
            [fieldName]: value.options?.value ?? undefined,
          };
        }, {});
        return result;
      },
      {},
    );

    return {sections, defaultValues};
  };
};
