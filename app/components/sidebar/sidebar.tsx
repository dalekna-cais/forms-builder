import cn from 'classnames';
import {Link} from 'react-router-dom';
import type {SectionProps} from '../form-fields';

export type SidebarProps = {
  formSections: SectionProps[];
  errors?: Record<string, any>;
};
export const Sidebar = ({formSections, errors = {}}: SidebarProps) => {
  return (
    <aside className="flex flex-col flex-none w-[250px] border p-10">
      <div className="sticky top-5 flex flex-col">
        {formSections.map((section, key) => {
          return (
            <div key={key} className="mb-4">
              <Link
                to={`#${section.id}`}
                className="font-semibold text-blue-500"
              >
                {section.title}
              </Link>
              <ul className="mt-4">
                {section.fields.map((field) => {
                  const hasError = typeof errors[field.name] !== 'undefined';
                  return (
                    <li
                      key={field.name}
                      className={cn(
                        `ml-4 text-base list-disc ${
                          hasError && 'text-red-500'
                        }`,
                      )}
                    >
                      <Link to={`#${field.name}`}>{field.label}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
