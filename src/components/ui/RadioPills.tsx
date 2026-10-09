import { useId } from 'react';
import { ErrorMessage } from './field';

export type RadioPillsProps = {
  name: string;
  legend: string;
  options: readonly { value: string; label: string }[];
  /** Mensaje de error ya traducido. */
  error?: string;
  defaultValue?: string;
  required?: boolean;
};

/** Grupo de pastillas: `<fieldset>` + `<legend>` y un `<input type="radio">` real por opción. */
export function RadioPills({
  name,
  legend,
  options,
  error,
  defaultValue,
  required,
}: RadioPillsProps) {
  const errorId = `${useId()}-error`;

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2 text-button">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line-strong px-4 text-button transition-colors duration-150 hover:border-ink has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={defaultValue === option.value}
              required={required}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error ? <ErrorMessage id={errorId}>{error}</ErrorMessage> : null}
    </fieldset>
  );
}
