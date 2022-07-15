import Downshift from 'downshift';
import type {FieldProps} from '../../contexts/form-fields';
import {useFormContext, Controller} from 'react-hook-form';
import {ErrorMessage, FieldSection} from './common';
import cn from 'classnames';

export const HFSelectInput = ({field}: {field: FieldProps}) => {
  const methods = useFormContext();
  const {errors} = methods.formState;

  return (
    <FieldSection className={field.className}>
      <Controller
        name={field.name}
        control={methods.control}
        render={({field: rhfField}) => {
          return (
            <Downshift
              id={field.name}
              initialSelectedItem={
                rhfField?.value &&
                field.items?.find((item) => item.value === rhfField?.value)
              }
              itemToString={(item) => (item ? item.label : '')}
              onChange={({value}) => rhfField.onChange({target: {value}})}
            >
              {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                getToggleButtonProps,
                isOpen,
                highlightedIndex,
                selectedItem,
                getRootProps,
              }) => (
                <div className="relative">
                  <div className="w-full">
                    <label
                      {...getLabelProps()}
                      className="form-label inline-block mb-2 text-gray-700"
                    >
                      {field.label}
                    </label>
                    {field.hint && (
                      <div className="border-l-4 pl-2 mb-2 text-gray-500">
                        <p className="text-base">{field.hint}</p>
                      </div>
                    )}
                    <div
                      className="flex bg-gray-50 w-full"
                      {...getRootProps({} as any, {
                        suppressRefError: true,
                      })}
                    >
                      <input
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-r-0 border-gray-300 rounded rounded-r-none transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none h-[38px]"
                        {...getInputProps({
                          name: rhfField.name,
                          ref: rhfField.ref,
                        })}
                        autoComplete="off"
                        disabled={field.options?.disabled}
                      />
                      <button
                        aria-label={'toggle menu'}
                        className="px-2 border border-l-0 rounded-r border-gray-300"
                        type="button"
                        disabled={field.options?.disabled}
                        {...getToggleButtonProps()}
                      >
                        {isOpen ? <>&#8593;</> : <>&#8595;</>}
                      </button>
                    </div>
                  </div>
                  <ul
                    className="z-10 absolute w-full bg-white shadow-md max-h-80 overflow-scroll"
                    {...getMenuProps()}
                  >
                    {isOpen
                      ? field.items?.map((item, index) => (
                          <li
                            key={index}
                            className={cn(
                              highlightedIndex === index && 'bg-blue-300',
                              selectedItem === item && 'font-bold',
                              'py-2 px-3 shadow-sm flex flex-col',
                            )}
                            {...getItemProps({
                              key: item.label,
                              index,
                              item,
                            })}
                          >
                            <span>{item.label}</span>
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              )}
            </Downshift>
          );
        }}
      />
      {errors[field.name] && <ErrorMessage error={errors[field.name]} />}
    </FieldSection>
  );
};
