import {useFormFieldsContext} from '../form-fields';

export const ErrorMessage = ({error}: {error: any}) => {
  return (
    <span role="alert" className="mt-2 text-sm text-red-700">
      {error.message}
    </span>
  );
};

export const ErrorMessages = ({errors}: {errors: Record<string, any>}) => {
  const {json} = useFormFieldsContext();

  return (
    <div className="flex flex-col p-2 border border-red-400 mb-10">
      <p className="text-base mb-2">Form has errors:</p>
      {Object.keys(errors).map((fieldName) => {
        const value = errors[fieldName];
        const field = json[fieldName];

        return (
          <div key={fieldName}>
            field <span className="text-red-400">{field.label}</span>:{' '}
            {value.message}
          </div>
        );
      })}
    </div>
  );
};
