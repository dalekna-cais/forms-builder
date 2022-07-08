import type {JsonFieldProps} from '~/components/form-fields';

const fields: JsonFieldProps = {
  name: {
    label: 'Name',
    type: 'text',
    order: 1,
    options: {
      value: 'testing default value',
      required: {
        value: true,
        message: 'name is required',
      },
    },
  },
  surname: {
    label: 'Surname',
    type: 'text',
    order: 2,
  },
  email: {
    label: 'Email',
    type: 'email',
    order: 3,
    options: {
      deps: ['confirm-email'],
      pattern: {
        value: '/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i',
        message: 'invalid email format',
      },
      required: {
        value: true,
        message: 'emails did not match',
      },
    },
  },
  'confirm-email': {
    label: 'Confirm Email',
    type: 'email',
    order: 4,
    // validate is extracted from options and applied later because
    // of objects getting cloned with refs
    validate: {
      isAMatch: {
        with: 'email',
        message: 'The emails do not match',
      },
    },
    options: {
      deps: ['email'],
    },
  },
};

export const getFieldProps = (): Promise<JsonFieldProps> => {
  return new Promise((res) => setTimeout(() => res(fields), 1000));
};
