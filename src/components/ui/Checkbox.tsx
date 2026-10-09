import type { ComponentProps, ReactNode } from 'react';
import { ErrorMessage, errorId } from './field';

export type CheckboxProps = {
  id: string;
  name: string;
  label: ReactNode;
  /** Mensaje de error ya traducido. */
  error?: string;
} & Omit<
  ComponentProps<'input'>,
  'id' | 'name' | 'type' | 'className' | 'aria-invalid' | 'aria-describedby'
>;

export function Checkbox({ id, name, label, error, ...native }: CheckboxProps) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          {...native}
          type="checkbox"
          id={id}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId(id) : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-accent"
        />
        <label htmlFor={id} className="cursor-pointer text-body">
          {label}
        </label>
      </div>
      {error ? <ErrorMessage id={errorId(id)}>{error}</ErrorMessage> : null}
    </div>
  );
}
