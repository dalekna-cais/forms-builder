import type {LoaderFunction} from '@remix-run/node';
import {json} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {getFieldProps} from '~/api';
import type {JsonSchemaProps} from '~/components/form-fields';
import {
  FormFieldsProvider,
  useFormFieldsContext,
} from '~/components/form-fields';
import {DefaultWithSidebar} from '~/components/layouts';

const Layout = () => {
  const {settings} = useFormFieldsContext();

  switch (settings.layout) {
    case 'default':
    case 'with-sidebar':
      return <DefaultWithSidebar />;
    case 'multistep-vertical':
      return <div>multistep-vertical form</div>;
    default:
      throw new Error('Unknown layout!');
  }
};

export const loader: LoaderFunction = async () => {
  const response = await getFieldProps();
  return json(response);
};

export default function Index() {
  const jsonFieldsDefs = useLoaderData<JsonSchemaProps>();

  return (
    <div className="flex flex-col flex-1 items-center">
      <FormFieldsProvider json={jsonFieldsDefs}>
        <Layout />
      </FormFieldsProvider>
    </div>
  );
}
