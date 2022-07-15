import type {PropsWithChildren} from 'react';
import type {SectionProps} from '../../contexts/form-fields';
import cn from 'classnames';
import {HFTextInput} from './hf-text';
import {HFSelectInput} from './hf-select';
import {HFPasswordInput} from './hf-password';
import {mergeDeepRight} from 'ramda';

export const ErrorMessage = ({error}: {error: any}) => {
  return (
    <span role="alert" className="mt-2 text-sm text-red-700">
      {error.message}
    </span>
  );
};

export const ErrorMessages = ({errors}: {errors: Record<string, any>}) => {
  return (
    <div className="flex flex-col p-2 border border-red-400">
      <p className="text-base mb-2">Form has errors:</p>
      {Object.keys(errors).map((fieldName) => {
        const value = errors[fieldName];

        return (
          <div key={fieldName}>
            field <span className="text-red-400">{value.type}</span>:{' '}
            {value.message}
          </div>
        );
      })}
    </div>
  );
};

export const FieldSection = ({
  children,
  className,
}: PropsWithChildren<{className?: string}>) => {
  return <div className={cn('w-full', className)}>{children}</div>;
};

type FieldsMatcherProps = {
  section: SectionProps;
  disableAllFields?: boolean;
};
export const FieldsMatcher = ({
  section,
  disableAllFields,
}: FieldsMatcherProps) => {
  return (
    <div className={cn(`grid grid-cols-${section.columns ?? 1} gap-4`)}>
      {section.fields
        .sort((a, b) => a.order - b.order)
        .map((originalField) => {
          let field = originalField;

          if (disableAllFields) {
            field = mergeDeepRight(field, {
              options: {disabled: true},
            });
          }

          switch (field.type) {
            case 'text':
              return <HFTextInput key={field.name} field={field} />;
            case 'email':
              return <HFTextInput key={field.name} field={field} />;
            case 'select':
              return <HFSelectInput key={field.name} field={field} />;
            case 'password':
              return <HFPasswordInput key={field.name} field={field} />;
            default:
              throw new Error(`${field.type} is not supported`);
          }
        })}
    </div>
  );
};
