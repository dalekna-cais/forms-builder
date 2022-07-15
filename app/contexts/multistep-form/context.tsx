import * as React from 'react';
import {useActor, useMachine} from '@xstate/react';
import type {ActorRef, State} from 'xstate';
import {assign, createMachine} from 'xstate';
import {useFormFieldsContext} from '../form-fields';

type MultistepFormContext = Record<string, any>;
type MultistepFormEvents =
  | {type: 'restart'}
  | {type: 'back'}
  | {type: 'next'; values: MultistepFormContext};

export type MultistepContextProps = {
  service: any;
};
export const MultistepContext = React.createContext<MultistepContextProps>(
  null as any,
);

export interface MultistepProviderProps {
  children: Function | React.ReactNode;
  onSubmit: (context: MultistepFormContext) => Promise<any>;
}
export const MultistepProvider = ({
  children,
  onSubmit,
}: MultistepProviderProps) => {
  const {definitions, defaultValues} = useFormFieldsContext();
  const formNames = Object.keys(definitions);
  const [fieldStates] = React.useState(() =>
    formNames.reduce((acc, state, index, array) => {
      const prevState = array[index - 1];
      const nextState = array[index + 1];

      return {
        ...acc,
        [state]: {
          on: {
            back: prevState,
            next: {
              target: nextState ?? 'submitting',
              actions: assign<
                MultistepFormContext,
                {type: 'next'; values: MultistepFormContext}
              >((context, event) => {
                const values = event?.values ?? {};
                return {...context, ...values};
              }),
            },
          },
        },
      };
    }, {}),
  );
  const multistepFormMachine = React.useRef(
    createMachine<MultistepFormContext, MultistepFormEvents>(
      {
        initial: formNames[0],
        context: defaultValues,
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
      },
      {
        services: {
          onSubmit,
        },
      },
    ),
  );
  const [, , service] = useMachine(multistepFormMachine.current);

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
