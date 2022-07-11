import type {JsonSectionProps} from '~/components/form-fields';

const fields: JsonSectionProps = {
  personalDetails: {
    title: 'Personal Details',
    fields: {
      name: {
        label: 'Name',
        type: 'text',
        order: 1,
        options: {
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
        options: {
          value: 'testing default value',
        },
      },
      email: {
        label: 'Email',
        type: 'email',
        hint: 'must match email standards',
        order: 3,
        options: {
          deps: ['confirm-email'],
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i,
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
};

export const getFieldProps = (): Promise<JsonSectionProps> => {
  return new Promise((res) => setTimeout(() => res(fields), 1000));
};
