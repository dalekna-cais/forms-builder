import type {JsonSchemaProps} from '~/contexts/form-fields';

export const sleep = (ms: number = 1000) =>
  new Promise((res) => setTimeout(res, ms));

const fields: JsonSchemaProps = {
  layout: 'multistep-vertical',
  submit: 'Submit',
  definitions: {
    personalDetails: {
      title: 'Personal Details',
      columns: 2,
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
          className: 'col-span-2',
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
          className: 'col-span-2',
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
          config: {
            value: 'uk',
          },
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

export const getFieldProps = async (): Promise<JsonSchemaProps> => {
  return await sleep().then(() => fields);
};
