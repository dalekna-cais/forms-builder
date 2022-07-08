import {useEffect, useState} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {getFieldProps} from '~/api';
import {
  HFTextInput,
  HFPasswordInput,
  HFSelectInput,
} from '~/components/elements';
import {ErrorMessages} from '~/components/elements/common';
import type {JsonSectionProps} from '~/components/form-fields';
import {
  FormFieldsProvider,
  useFormFieldsContext,
} from '~/components/form-fields';

const Page = () => {
  const {getSections, defaultValues} = useFormFieldsContext();
  const methods = useForm({defaultValues});
  const formSections = getSections(methods).sections;

  return (
    <div className="flex flex-row w-full max-w-[1000px] min-w-[750px] border p-10">
      <aside className="flex flex-col flex-none w-[250px] border p-10">
        <div className="sticky top-5 flex flex-col">
          {formSections.map((section, key) => {
            return (
              <div key={key} className="mb-4">
                <p className="font-semibold text-blue-500">{section.title}</p>
                <ul className="mt-4">
                  {section.fields.map((field) => (
                    <li key={field.name} className="ml-4 text-base list-disc">
                      {field.label}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </aside>
      <main className="flex flex-col flex-1 items-center">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((values) => console.log(values))}
            className="flex flex-col w-full border p-10"
          >
            {formSections.map((section, key) => {
              return (
                <fieldset key={key} className="mb-4">
                  <legend className="text-xl mb-5"># {section.title}</legend>
                  {section.fields
                    .sort((a, b) => a.order - b.order)
                    .map((field) => {
                      switch (field.type) {
                        case 'text':
                          return <HFTextInput key={field.name} field={field} />;
                        case 'email':
                          return <HFTextInput key={field.name} field={field} />;
                        case 'select':
                          return (
                            <HFSelectInput key={field.name} field={field} />
                          );
                        case 'password':
                          return (
                            <HFPasswordInput key={field.name} field={field} />
                          );
                        default:
                          throw new Error(`${field.type} is not supported`);
                      }
                    })}
                </fieldset>
              );
            })}
            {Object.keys(methods.formState.errors).length > 0 && (
              <ErrorMessages errors={methods.formState.errors} />
            )}
            <button
              type="submit"
              className="mt-6 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Submit
            </button>
          </form>
        </FormProvider>
      </main>
    </div>
  );
};

export default function Index() {
  const [fields, setFields] = useState<JsonSectionProps | undefined>(undefined);

  useEffect(() => {
    getFieldProps().then(setFields);
  }, []);

  if (!fields) {
    return <div className="flex flex-col items-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col flex-1 items-center">
      <FormFieldsProvider json={fields}>
        <Page />
      </FormFieldsProvider>
    </div>
  );
}
