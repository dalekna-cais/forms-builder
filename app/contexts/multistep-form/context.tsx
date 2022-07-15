import * as React from 'react';
import {useActor, useMachine} from '@xstate/react';
import type {ActorRef, State} from 'xstate';
import {assign, createMachine} from 'xstate';
import {useFormFieldsContext} from '../form-fields';

type MultistepFormContext = {
  /** all values */
  values: Record<string, any>;
  /** internal use only */
  prevState?: string;
  /** internal use only */
  nextState?: string;
  /** errors for section */
  errors?: Record<string, any>;
};
type MultistepFormEvents =
  | {type: 'restart'}
  | {type: 'back'}
  | {type: 'next'; values: MultistepFormContext['values']};

export type MultistepContextProps = {
  service: any;
};
export const MultistepContext = React.createContext<MultistepContextProps>(
  null as any,
);

export interface MultistepProviderProps {
  children: Function | React.ReactNode;
  onSubmit: (context: MultistepFormContext) => Promise<any>;
  onStepValidation?: (context: MultistepFormContext) => Promise<any>;
}
export const MultistepProvider = ({
  children,
  onSubmit,
  onStepValidation,
}: MultistepProviderProps) => {
  const {definitions, defaultValues} = useFormFieldsContext();
  const formNames = Object.keys(definitions);
  const [fieldStates] = React.useState(() =>
    formNames.reduce((acc, state, index, array) => {
      const values = definitions[state];
      const validationState = `${state}_validate`;
      const prevState: string | undefined = array[index - 1];
      const nextState: string | undefined = array[index + 1];

      let nextTarget = '';

      if (nextState && values.validateAt) {
        nextTarget = validationState;
      } else if (nextState) {
        nextTarget = nextState;
      } else {
        nextTarget = 'submitting';
      }

      const sectionValidation = {
        [validationState]: {
          invoke: {
            src: 'onStepValidation',
            onDone: nextState,
            onError: {
              target: prevState,
              actions: assign<MultistepFormContext, any>({
                errors: (context, event) => event.data,
              }),
            },
          },
        },
      };

      return {
        ...acc,
        [state]: {
          on: {
            back: prevState,
            next: {
              target: nextTarget,
              actions: assign<
                MultistepFormContext,
                {type: 'next'; values: MultistepFormContext}
              >({
                values: (context, event) => {
                  const values = event?.values ?? {};
                  return {...context.values, ...values};
                },
                prevState: (context) => prevState,
                nextState: (context) => nextState,
              }),
            },
          },
        },
        ...(values.validateAt && sectionValidation),
      };
    }, {}),
  );
  console.log(fieldStates);
  const multistepFormMachine = React.useRef(
    createMachine<MultistepFormContext, MultistepFormEvents>({
      initial: formNames[0],
      context: {
        values: defaultValues,
      },
      states: {
        ...fieldStates,
        submitting: {
          entry: [() => console.log('submitting')],
          invoke: {
            src: 'onSubmit',
            onDone: 'complete',
            onError: 'error',
          },
        },
        complete: {
          entry: [() => console.log('complete')],
        },
        error: {
          entry: [() => console.log('error')],
          on: {
            restart: formNames[0],
          },
        },
      },
    }),
  );
  const [, , service] = useMachine(multistepFormMachine.current, {
    services: {
      onSubmit,
      onStepValidation,
    },
  });

  const forwardProps = {service};
  const ui = typeof children === 'function' ? children(forwardProps) : children;
  return (
    <MultistepContext.Provider value={forwardProps}>
      {ui}
    </MultistepContext.Provider>
  );
};

const useMultistepContext = () => {
  const utils = React.useContext(MultistepContext);
  if (!utils) {
    throw new Error(
      `Multistep compound components cannot be rendered outside the MultistepProvider`,
    );
  }
  return utils;
};

export type MultistepActorRef = ActorRef<
  MultistepFormEvents,
  State<MultistepFormContext, MultistepFormEvents>
>;

export const useMultistepActor = () => {
  const {service} = useMultistepContext();
  return useActor(service as unknown as MultistepActorRef);
};
