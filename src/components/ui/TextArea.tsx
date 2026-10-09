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

export type TextAreaProps = FieldBaseProps &
  Omit<
    ComponentProps<'textarea'>,
    keyof FieldBaseProps | 'className' | 'aria-invalid' | 'aria-describedby'
  >;

export function TextArea(props: TextAreaProps) {
  const { id, label, name, optional, error, describedById, rows = 5, ...native } = props;

  return (
    <div>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <textarea
        {...native}
        id={id}
        name={name}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, describedById)}
        className={cn(controlClasses(Boolean(error)), 'min-h-37 resize-y')}
      />
      {error ? <ErrorMessage id={errorId(id)}>{error}</ErrorMessage> : null}
    </div>
  );
}
