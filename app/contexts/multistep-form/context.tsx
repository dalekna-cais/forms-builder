import * as React from 'react';
import {useActor, useMachine} from '@xstate/react';
import type {ActorRef, State} from 'xstate';
import {assign, createMachine} from 'xstate';
import {useFormFieldsContext} from '../form-fields';
import {sleep} from '~/api';

export type MultistepContextProps = {
  service: any;
};
export const MultistepContext = React.createContext<MultistepContextProps>(
  null as any,
);

export interface MultistepProviderProps {
  children: Function | React.ReactNode;
}
export const MultistepProvider = ({children}: MultistepProviderProps) => {
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
              actions: assign<any>((context, event: any) => {
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
    createMachine(
      {
        initial: formNames[0],
        context: defaultValues,
        states: {
          ...fieldStates,
          submitting: {
            entry: [() => console.log('submitting')],
            invoke: {
              src: 'handleSubmit',
              onDone: 'complete',
              onError: 'error',
            },
          },
          complete: {
            entry: [(context) => console.log('complete', context)],
          },
          error: {
            entry: [() => console.log('error')],
          },
        },
      },
      {
        services: {
          handleSubmit: async () => sleep(2500),
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

type MultistepFormEvents =
  | {type: 'back'}
  | {type: 'next'; values: Record<string, any>};
export type MultistepActorRef = ActorRef<MultistepFormEvents, State<any, any>>;

export const useMultistepActor = () => {
  const {service} = useMultistepContext();
  return useActor(service as unknown as MultistepActorRef);
};
