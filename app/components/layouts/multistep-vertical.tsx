import React from 'react';
import type {JsonSectionProps} from '../../contexts/form-fields';
import {useFormFieldsContext} from '../../contexts/form-fields';
import cn from 'classnames';
import {FormProvider, useForm} from 'react-hook-form';
import {FieldsMatcher} from '../elements/common';
import {MultistepProvider, useMultistepActor} from '~/contexts/multistep-form';

type FormProps = {defs: JsonSectionProps};
const Form = ({defs}: FormProps) => {
  const [state, send] = useMultistepActor();
  const {getSections, defaultValuesPerSection} = useFormFieldsContext();
  // default values loaded from state machine and matched with section fields
  const [defaultValues] = React.useState(() =>
    // FIX: should look up by defs.id, not title.
    Object.keys(defaultValuesPerSection[defs.title]).reduce(
      (acc, key) => ({
        ...acc,
        [key]: state.context[key],
      }),
      {},
    ),
  );
  const methods = useForm({defaultValues});
  const formSections = getSections(methods).sections;
  const section = formSections.find((section) => section.title === defs.title);

  if (!section)
    return <div>there was an error looking up section by title!</div>;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((values) =>
          send({type: 'next', values}),
        )}
      >
        <div className="mt-5 max-w-[70%]">
          <FieldsMatcher section={section} />
        </div>
        <footer className="flex my-5">
          <button
            type="submit"
            disabled={state.matches('submitting')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
          >
            {state.matches('submitting') ? 'Submitting' : 'Next'}
          </button>
          {!state.matches('submitting') && (
            <button
              type="button"
              onClick={() => send({type: 'back'})}
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Cancel
            </button>
          )}
        </footer>
      </form>
    </FormProvider>
  );
};

type SectionProps = {
  defs: JsonSectionProps;
  count: number;
  name: string;
};
const Section = ({defs, count, name}: SectionProps) => {
  const [state] = useMultistepActor();
  const {definitions} = useFormFieldsContext();
  const isNotLast = Object.keys(definitions).length !== count;

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
          <h1 className="text-xl font-semibold">{defs.title}</h1>
        </div>
        <div className={cn(isNotLast && 'min-h-[24px]')}>
          {state.matches(name) && <Form defs={defs} />}
          {state.matches('submitting') && !isNotLast && <Form defs={defs} />}
        </div>
      </div>
    </div>
  );
};

const MultistepForm = () => {
  const {definitions} = useFormFieldsContext();

  return (
    <div className="w-full max-w-[1000px] min-w-[750px] border p-10">
      {Object.keys(definitions).map((key, index) => {
        const count = index + 1;
        const defs = definitions[key];
        return (
          <Section key={defs.title} name={key} defs={defs} count={count} />
        );
      })}
    </div>
  );
};

export const MultistepVertical = () => {
  return (
    <MultistepProvider>
      <MultistepForm />
    </MultistepProvider>
  );
};
