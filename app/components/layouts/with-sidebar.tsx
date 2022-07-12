import cn from 'classnames';
import {FormProvider, useForm} from 'react-hook-form';
import {
  HFPasswordInput,
  HFSelectInput,
  HFTextInput,
} from '~/components/elements';
import {ErrorMessages} from '~/components/elements/common';
import {useFormFieldsContext} from '~/components/form-fields';
import {Sidebar} from '~/components/sidebar';

export const DefaultWithSidebar = () => {
  const {getSections, defaultValues, settings} = useFormFieldsContext();
  const methods = useForm({defaultValues});
  const formSections = getSections(methods).sections;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-row w-full max-w-[1000px] min-w-[750px] border p-10">
        {settings.layout === 'with-sidebar' && (
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
                  <div
                    className={cn(
                      `grid grid-cols-${section.columns ?? 1} gap-4`,
                    )}
                  >
                    {section.fields
                      .sort((a, b) => a.order - b.order)
                      .map((field) => {
                        switch (field.type) {
                          case 'text':
                            return (
                              <HFTextInput key={field.name} field={field} />
                            );
                          case 'email':
                            return (
                              <HFTextInput key={field.name} field={field} />
                            );
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
                  </div>
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
