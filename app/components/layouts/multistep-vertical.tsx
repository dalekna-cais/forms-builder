import React from 'react';
import type {JsonSectionProps} from '../../contexts/form-fields';
import {useFormFieldsContext} from '../../contexts/form-fields';
import cn from 'classnames';
import {FormProvider, useForm} from 'react-hook-form';
import {FieldsMatcher} from '../elements/common';
import {MultistepProvider, useMultistepActor} from '~/contexts/multistep-form';
import {sleep} from '~/api';

type FormProps = {defs: JsonSectionProps; name: string};
const Form = ({defs, name}: FormProps) => {
  const [state, send] = useMultistepActor();
  const {getSections, defaultValuesPerSection} = useFormFieldsContext();
  // default values loaded from state machine and matched with section fields
  const [defaultValues] = React.useState(() =>
    // TODO: should look up by defs.id, not title.
    Object.keys(defaultValuesPerSection[defs.title]).reduce(
      (acc, key) => ({
        ...acc,
        [key]: state.context.values[key],
      }),
      {},
    ),
  );
  const methods = useForm({defaultValues});
  const formSections = getSections(methods).sections;
  const section = formSections.find((section) => section.title === defs.title);
  const isValidating = ['submitting', `${name}:validate`].some(state.matches);

  /** focus first input of the form */
  React.useEffect(() => {
    const firstInputName = Object.keys(defaultValues)[0];
    methods?.setFocus(firstInputName as never);
  }, [methods, defaultValues]);

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
          <FieldsMatcher section={section} disableAllFields={isValidating} />
        </div>
        <footer className="flex my-5">
          <button
            type="submit"
            disabled={isValidating}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
          >
            {state.matches('submitting') ? 'Submitting' : 'Next'}
          </button>
          {!isValidating && (
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
          {[name, `${name}:validate`].some(state.matches) && (
            <Form name={name} defs={defs} />
          )}
          {state.matches('submitting') && !isNotLast && (
            <Form name={name} defs={defs} />
          )}
        </div>
      </div>
    </div>
  );
};

const MultistepForm = () => {
  const [state, send] = useMultistepActor();
  const {definitions} = useFormFieldsContext();

  if (state.matches('complete')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <h1 className="font-semibold text-5xl">{`Success 🎉`}</h1>
        <pre className="mt-5 p-5 bg-gray-100 rounded">
          {JSON.stringify(state.context.values, null, 2)}
        </pre>
      </div>
    );
  }
  if (state.matches('error')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <h1 className="font-semibold text-5xl">{`There was an error 💥`}</h1>
        <button
          type="button"
          onClick={() => send({type: 'restart'})}
          className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
        >
          Try again
        </button>
      </div>
    );
  }

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
    <MultistepProvider
      onSubmit={(values) => sleep(2500).then(() => console.log({values}))}
      onStepValidation={(values) => sleep(1000)}
      // onStepValidation={(values) =>
      //   sleep(1000).then(() => Promise.reject({email: 'already exists'}))
      // }
    >
      <MultistepForm />
    </MultistepProvider>
  );
};
