import {useEffect, useState} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {getFieldProps} from '~/api';
import {HFTextInput, HFPasswordInput} from '~/components/elements';
import {ErrorMessages} from '~/components/elements/common';
import type {JsonFieldProps} from '~/components/form-fields';
import {
  FormFieldsProvider,
  useFormFieldsContext,
} from '~/components/form-fields';

const Page = () => {
  const {getFields, defaultValues} = useFormFieldsContext();
  const methods = useForm({defaultValues});
  const formFields = getFields(methods).fields;

  return (
    <div className="flex flex-col items-center">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(console.log)}
          className="flex flex-col min-w-[750px] border p-10"
        >
          {Object.keys(methods.formState.errors).length > 0 && (
            <ErrorMessages errors={methods.formState.errors} />
          )}
          <fieldset>
            <legend className="text-xl mb-5">Personal details:</legend>
            {formFields
              .sort((a, b) => a.order - b.order)
              .map((field) => {
                switch (field.type) {
                  case 'text':
                    return <HFTextInput key={field.name} field={field} />;
                  case 'email':
                    return <HFTextInput key={field.name} field={field} />;
                  case 'password':
                    return <HFPasswordInput key={field.name} field={field} />;
                  default:
                    throw new Error(`${field.type} is not supported`);
                }
              })}
          </fieldset>
          <button
            type="submit"
            className="mt-6 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default function Index() {
  const [fields, setFields] = useState<JsonFieldProps | undefined>(undefined);

  useEffect(() => {
    getFieldProps().then(setFields);
  }, []);

  if (!fields) {
    return <div className="flex flex-col items-center">Loading...</div>;
  }

  return (
    <FormFieldsProvider json={fields}>
      <Page />
    </FormFieldsProvider>
  );
}
