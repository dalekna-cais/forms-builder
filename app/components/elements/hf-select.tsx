import type {FieldProps} from '../form-fields';
import {useFormContext} from 'react-hook-form';
import {ErrorMessage} from './common';

export const HFSelectInput = ({field}: {field: FieldProps}) => {
  const methods = useFormContext();
  const {errors, touchedFields} = methods.formState;

  return (
    <div className="mb-3">
      <label className="form-label inline-block mb-2 text-gray-700">
        {field.label}
      </label>
      {field.hint && (
        <div className="border-l-4 pl-2 mb-2 text-gray-500">
          <p className="text-base">{field.hint}</p>
        </div>
      )}
      <select
        id={field.name}
        {...methods.register(field.name, field.options)}
        className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {field.items?.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {errors[field.name] && touchedFields[field.name] && (
        <ErrorMessage error={errors[field.name]} />
      )}
    </div>
  );
};
