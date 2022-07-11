import type {JsonSchemaProps} from '~/components/form-fields';

const fields: JsonSchemaProps = {
  withSidebar: true,
  submit: 'Submit',
  definitions: {
    personalDetails: {
      title: 'Personal Details',
      fields: {
        name: {
          label: 'Name',
          type: 'text',
          order: 1,
          config: {
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
          config: {
            value: 'testing default value',
          },
        },
        email: {
          label: 'Email',
          type: 'email',
          hint: 'must match email standards',
          order: 3,
          config: {
            pattern: {
              value: '/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i',
              message: 'invalid email format',
            },
            deps: ['confirm-email'],
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
          config: {
            isAMatch: {
              field: 'email',
              message: 'The emails do not match',
            },
            deps: ['email'],
          },
        },
      },
    },
    address: {
      title: 'Address',
      fields: {
        line1: {
          label: 'First line',
          type: 'text',
          order: 1,
        },
        line2: {
          label: 'Second line',
          type: 'text',
          order: 2,
        },
        country: {
          label: 'Country',
          type: 'select',
          items: [
            {value: 'uk', label: 'UK'},
            {value: 'us', label: 'US'},
            {value: 'ca', label: 'CA'},
          ],
          order: 3,
        },
      },
    },
    cryptoPortfolio: {
      title: 'Crypto Portfolio',
      columns: 2,
      fields: {
        coin1: {
          label: 'Coin',
          type: 'select',
          items: [
            {value: 'btc', label: 'BTC'},
            {value: 'eth', label: 'ETH'},
            {value: 'usdt', label: 'USDT'},
          ],
          order: 1,
        },
        quantity1: {
          label: 'Quantity',
          type: 'text',
          order: 2,
        },
        coin2: {
          label: 'Coin',
          type: 'select',
          items: [
            {value: 'btc', label: 'BTC'},
            {value: 'eth', label: 'ETH'},
            {value: 'usdt', label: 'USDT'},
          ],
          order: 3,
        },
        quantity2: {
          label: 'Quantity',
          type: 'text',
          order: 4,
        },
      },
    },
  },
};

export const getFieldProps = (): Promise<JsonSchemaProps> => {
  return new Promise((res) => setTimeout(() => res(fields), 1000));
};
