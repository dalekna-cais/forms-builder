import * as React from 'react';
import type {JsonSectionProps} from '../form-fields';
import {useFormFieldsContext} from '../form-fields';
import cn from 'classnames';
import {FormProvider, useForm} from 'react-hook-form';
import {FieldsMatcher} from '../elements/common';

// QUESTION: do we submit to db on each step or is there a final submit?

const Form = ({defs}: {defs: JsonSectionProps}) => {
  const {getSections, defaultValuesPerSection} = useFormFieldsContext();
  // NOTE: most likely defaultValues will come from the parent master state
  const methods = useForm({defaultValues: defaultValuesPerSection[defs.title]}); // should be defs.id, not title.
  const formSections = getSections(methods).sections;
  const section = formSections.find((section) => section.title === defs.title);

  if (!section)
    return <div>there was an error looking up section by title!</div>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((values) => console.log(values))}>
        <div className="mt-5 max-w-[70%]">
          <FieldsMatcher section={section} />
        </div>
        <footer className="flex my-5">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
          >
            Next
          </button>
          <button
            type="button"
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Cancel
          </button>
        </footer>
      </form>
    </FormProvider>
  );
};

const Section = ({defs, count}: {defs: JsonSectionProps; count: number}) => {
  const {definitions} = useFormFieldsContext();
  const [open, setOpen] = React.useState<boolean>(false);
  const isNotLast = Object.keys(definitions).length !== count;

  // NOTE: only one form can be open at a time, come up with a dynamic state machine

  return (
    <div key={defs.title} className="flex">
      <aside className="flex flex-col flex-none items-center w-[80px]">
        <div className="flex flex-none items-center justify-center border rounded-full border-gray-400 w-12 h-12">
          <h1 className="text-xl font-semibold">{count}</h1>
        </div>
        {isNotLast && (
          <div className="h-full border-dotted border-l-2 border-gray-400"></div>
        )}
      </aside>
      <div className="flex flex-col flex-auto">
        <div className="flex items-center h-12">
          <h1 className="text-xl font-semibold" onClick={() => setOpen(!open)}>
            {defs.title}
          </h1>
        </div>
        <div className={cn(isNotLast && 'min-h-[24px]')}>
          {open && <Form defs={defs} />}
        </div>
      </div>
    </div>
  );
};

export const MultistepVertical = () => {
  const {definitions} = useFormFieldsContext();

  return (
    <div className="w-full max-w-[1000px] min-w-[750px] border p-10">
      {Object.values(definitions).map((defs, key) => {
        const count = key + 1;
        return <Section key={defs.title} defs={defs} count={count} />;
      })}
    </div>
  );
};
