import type {FieldProps} from '../form-fields';
import {useFormContext} from 'react-hook-form';
import {ErrorMessage, FieldSection} from './common';

export const HFTextInput = ({field}: {field: FieldProps}) => {
  const methods = useFormContext();
  const {errors} = methods.formState;

  return (
    <FieldSection className={field.className}>
      <label
        htmlFor={field.name}
        className="form-label inline-block mb-2 text-gray-700"
      >
        {field.label}
      </label>
      {field.hint && (
        <div className="border-l-4 pl-2 mb-2 text-gray-500">
          <p className="text-base">{field.hint}</p>
        </div>
      )}
      <input
        type="text"
        id={field.name}
        placeholder={field.placeholder}
        aria-invalid={errors[field.name] ? true : false}
        {...methods.register(field.name, field.options)}
        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      />
      {errors[field.name] && <ErrorMessage error={errors[field.name]} />}
    </FieldSection>
  );
};
