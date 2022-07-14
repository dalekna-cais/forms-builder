import {FormProvider, useForm} from 'react-hook-form';
import {ErrorMessages, FieldsMatcher} from '~/components/elements/common';
import {useFormFieldsContext} from '~/contexts/form-fields';
import {Sidebar} from '~/components/sidebar';

export const DefaultWithSidebar = ({withSidebar}: {withSidebar: boolean}) => {
  const {getSections, defaultValues, settings} = useFormFieldsContext();
  const methods = useForm({defaultValues});
  const formSections = getSections(methods).sections;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-row w-full max-w-[1000px] min-w-[750px] border p-10">
        {withSidebar && (
          <Sidebar
            formSections={formSections}
            errors={methods.formState.errors}
          />
        )}
        <main className="flex flex-col flex-1 items-center">
          <form
            onSubmit={methods.handleSubmit((values) => console.log(values))}
            className="flex flex-col w-full border p-10"
          >
            {formSections.map((section) => {
              return (
                <fieldset key={section.id} className="mb-6">
                  {section.title && (
                    <legend id={section.id} className="text-xl mb-4">
                      # {section.title}
                    </legend>
                  )}
                  <FieldsMatcher section={section} />
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
              {settings.submit ?? 'Submit'}
            </button>
          </form>
        </main>
      </div>
    </FormProvider>
  );
};
