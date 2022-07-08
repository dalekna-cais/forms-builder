import type {FieldProps} from '../form-fields';
import {useFormContext} from 'react-hook-form';
import {ErrorMessage} from './common';

export const HFTextInput = ({field}: {field: FieldProps}) => {
  const methods = useFormContext();
  const {errors, touchedFields} = methods.formState;

  return (
    <div className="mb-3 xl:w-96">
      <label
        htmlFor={field.name}
        className="form-label inline-block mb-2 text-gray-700"
      >
        {field.label}
      </label>
      <input
        type="text"
        id={field.name}
        placeholder={field.placeholder}
        aria-invalid={errors[field.name] ? true : false}
        {...methods.register(field.name, field.options)}
        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      />
      {errors[field.name] && touchedFields[field.name] && (
        <ErrorMessage error={errors[field.name]} />
      )}
    </div>
  );
};
