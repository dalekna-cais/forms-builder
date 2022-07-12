import * as React from 'react';
import type {JsonSectionProps} from '../form-fields';
import {useFormFieldsContext} from '../form-fields';

const Form = ({defs}: {defs: JsonSectionProps}) => {
  return (
    <>
      <div className="mt-5">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
        aspernatur voluptatibus sapiente, et minus exercitationem facere at
        deserunt molestiae aliquam, beatae aut commodi. Iste repudiandae
        molestias nihil in necessitatibus cumque, sequi impedit suscipit
        architecto nulla minus perferendis neque alias ipsum illum dolorum eum
        voluptas quam obcaecati ex aspernatur fugiat nisi! Fugiat vitae ducimus
        numquam accusantium autem architecto error iusto itaque at molestiae!
        Nostrum veritatis sunt consectetur distinctio? Odio, facilis laboriosam
        autem provident reprehenderit et possimus nostrum sed. Ducimus, illo
        temporibus magnam debitis aliquam voluptatem autem suscipit at eveniet
        nihil, quo a eos tempora odit quisquam nostrum corrupti! Voluptate modi
        voluptatum tempore. Quam error ut molestias consequuntur labore iure
        minima explicabo suscipit deserunt aliquid asperiores fugiat cupiditate
        odit itaque earum fugit laborum mollitia illum, deleniti sequi. Qui
        molestiae iusto atque amet animi minus sint eligendi obcaecati odio cum
        doloribus totam laudantium fugit distinctio iure officiis suscipit,
        accusantium dignissimos dolore incidunt sunt quasi quisquam! Placeat
        numquam ab quo earum culpa ratione facilis! Vero, eaque. Nemo obcaecati
        delectus voluptate quaerat autem! Laudantium consectetur odio,
        exercitationem tempore, pariatur, officia atque odit consequuntur
        impedit nobis nostrum dolor tempora eaque illum dignissimos. Facilis
        doloribus obcaecati a error, consequuntur, voluptatum ratione pariatur
        fuga alias magnam aperiam voluptate quis deserunt quasi optio sed ex
        amet officiis. Alias labore porro esse deserunt similique, perferendis
        dicta commodi veritatis pariatur, est, quis ducimus magni nisi ut
        quisquam libero non officia assumenda facere. Beatae atque quia nesciunt
        provident alias ipsa. Nostrum ducimus officiis rerum delectus atque
        repellendus ea consectetur obcaecati ut porro veniam facilis aspernatur
        sit enim qui deserunt, iusto doloribus tenetur molestias illum minus
        expedita? Rerum accusamus, quod ut neque eveniet ullam vero amet, porro
        repellat mollitia deleniti officia enim. At voluptates reprehenderit
        laboriosam optio eos. Dolore alias ratione ex aperiam, debitis ipsam at
        repellat, non atque quod quasi. Mollitia, veritatis!
      </div>
      <footer className="flex my-5">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Next
        </button>
        <button
          type="button"
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        >
          Cancel
        </button>
      </footer>
    </>
  );
};

const Section = ({defs, count}: {defs: JsonSectionProps; count: number}) => {
  const {definitions} = useFormFieldsContext();
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div key={defs.title} className="flex">
      <aside className="flex flex-col flex-none items-center w-[80px]">
        <div className="flex flex-none items-center justify-center border rounded-full border-gray-400 w-12 h-12">
          <h1 className="text-xl font-semibold">{count}</h1>
        </div>
        {Object.keys(definitions).length !== count && (
          <div className="h-full border-dotted border-l-2 border-gray-400"></div>
        )}
      </aside>
      <div className="flex flex-col flex-auto">
        <div className="flex items-center h-12">
          <h1 className="text-xl font-semibold">{defs.title}</h1>
        </div>
        <div className="min-h-[20px]">{open && <Form defs={defs} />}</div>
      </div>
    </div>
  );
};

export const MultistepVertical = () => {
  const {definitions} = useFormFieldsContext();

  return (
    <div className="w-full max-w-[1000px] min-w-[750px] border p-10">
      {Object.values(definitions).map((defs, key) => {
        const count = key + 1;
        return <Section key={defs.title} defs={defs} count={count} />;
      })}
    </div>
  );
};
