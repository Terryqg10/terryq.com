import { cn } from '@/lib/cn';
import type { ComponentProps } from 'react';
import {
  ErrorMessage,
  FieldLabel,
  controlClasses,
  describedBy,
  errorId,
  type FieldBaseProps,
} from './field';

export type TextFieldProps = FieldBaseProps &
  Omit<
    ComponentProps<'input'>,
    keyof FieldBaseProps | 'className' | 'aria-invalid' | 'aria-describedby'
  >;

export function TextField(props: TextFieldProps) {
  const { id, label, name, optional, error, describedById, ...native } = props;

  return (
    <div>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <input
        {...native}
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, describedById)}
        className={cn(controlClasses(Boolean(error)))}
      />
      {error ? <ErrorMessage id={errorId(id)}>{error}</ErrorMessage> : null}
    </div>
  );
}
