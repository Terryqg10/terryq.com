'use client';

import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioPills } from '@/components/ui/RadioPills';
import { TextArea } from '@/components/ui/TextArea';
import { TextField } from '@/components/ui/TextField';
import { buttonClasses } from '@/components/ui/button-classes';
import { Link } from '@/i18n/navigation';
import { AlertCircle, ArrowRight, Check, Loader2, TriangleAlert } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
} from 'react';
import { sendContact } from './action';
import {
  contactFields,
  contactNeeds,
  validateContact,
  type ContactErrorCode,
  type ContactField,
} from './schema';
import type { ContactState } from './submit';

type Errors = Partial<Record<ContactField, ContactErrorCode>>;

const initialState: ContactState = { status: 'idle' };

const isContactField = (name: string): name is ContactField =>
  (contactFields as readonly string[]).includes(name);

const readForm = (form: HTMLFormElement) => Object.fromEntries(new FormData(form));

type ContactFormProps = {
  /** Enlace de WhatsApp con el mensaje preparado (lo construye el servidor con `site.ts`). */
  whatsappHref: string;
  email: string;
};

/**
 * Formulario de contacto (spec §10.3). `key` cambia con «Enviar otro mensaje» y reinicia todo el
 * estado de la acción, incluido el `startedAt` del antispam.
 */
export function ContactForm(props: ContactFormProps) {
  const [round, setRound] = useState(0);
  return (
    <ContactFormRound
      key={round}
      {...props}
      focusFirstField={round > 0}
      onReset={() => setRound((current) => current + 1)}
    />
  );
}

function ContactFormRound({
  whatsappHref,
  email,
  focusFirstField,
  onReset,
}: ContactFormProps & { focusFirstField: boolean; onReset: () => void }) {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(sendContact, initialState);
  const [clientErrors, setClientErrors] = useState<Errors | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  // El reloj del antispam arranca cuando el formulario aparece en pantalla. Se escribe en
  // `defaultValue` para que el reinicio del formulario tras una acción no lo borre.
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.defaultValue = String(Date.now());
    if (focusFirstField) document.getElementById('contact-name')?.focus();
  }, [focusFirstField]);

  // El resumen de validación recibe el foco cada vez que un envío falla.
  useEffect(() => {
    if (failedAttempts > 0 || state.status === 'invalid') summaryRef.current?.focus();
  }, [failedAttempts, state]);

  if (state.status === 'success') {
    return (
      <Card as="section" aria-label={t('formLabel')} className="p-6 sm:p-10">
        <SuccessMessage whatsappHref={whatsappHref} onReset={onReset} />
      </Card>
    );
  }

  const values = state.status === 'idle' ? undefined : state.values;
  const serverErrors: Errors = state.status === 'invalid' ? state.errors : {};
  const errors: Errors = clientErrors ?? serverErrors;
  const errorCount = Object.keys(errors).length;
  const attempted = clientErrors !== null || state.status === 'invalid';

  const messageOf = (field: ContactField) => {
    const code = errors[field];
    return code ? t(`errors.${code}`) : undefined;
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Un doble clic mientras se envía no debe lanzar un segundo envío.
    if (pending) {
      event.preventDefault();
      return;
    }
    const result = validateContact(readForm(event.currentTarget));
    if (result.success) {
      setClientErrors(null);
      return;
    }
    event.preventDefault();
    setClientErrors(result.errors);
    setFailedAttempts((current) => current + 1);
  }

  // Tras el primer intento, cada campo se revalida al salir de él para que el error desaparezca.
  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    const field = event.target.getAttribute('name');
    if (!attempted || !field || !isContactField(field)) return;
    const result = validateContact(readForm(event.currentTarget));
    const code = result.success ? undefined : result.errors[field];
    const next: Errors = { ...errors };
    if (code) next[field] = code;
    else delete next[field];
    setClientErrors(next);
  }

  return (
    <Card as="section" aria-label={t('formLabel')} className="p-6 sm:p-10">
      <form
        action={formAction}
        noValidate
        aria-busy={pending}
        onSubmit={handleSubmit}
        onBlur={handleBlur}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="type-section-sm">
            <span className="lg:hidden">{t('formTitleMobile')}</span>
            <span className="hidden lg:inline">{t('formTitle')}</span>
          </h2>
          <p className="text-meta text-ink-muted">{t('note')}</p>
        </div>

        {errorCount > 0 ? (
          <div
            ref={summaryRef}
            role="alert"
            tabIndex={-1}
            className="flex items-start gap-3 rounded-xl border border-danger bg-paper px-4 py-3.5 text-body text-ink outline-none focus-visible:ring-3 focus-visible:ring-danger/25"
          >
            <AlertCircle
              aria-hidden="true"
              size={20}
              strokeWidth={1.75}
              className="mt-0.5 shrink-0 text-danger"
            />
            <p>
              {t.rich('summary', {
                n: errorCount,
                b: (chunks) => <strong className="font-semibold text-danger">{chunks}</strong>,
              })}
            </p>
          </div>
        ) : null}

        {state.status === 'error' ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-danger bg-paper px-4 py-3.5 text-body text-ink"
          >
            <TriangleAlert
              aria-hidden="true"
              size={20}
              strokeWidth={1.75}
              className="mt-0.5 shrink-0 text-danger"
            />
            <p>
              {t.rich('failure', {
                email,
                b: (chunks) => <strong className="font-semibold text-danger">{chunks}</strong>,
                mail: (chunks) => (
                  <a
                    href={`mailto:${email}`}
                    className="font-semibold underline underline-offset-3"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        ) : null}

        <input type="hidden" name="locale" value={locale} />
        <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />
        {/* Campo trampa (spec §10.1): una persona no lo ve ni llega a él con el teclado. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="contact-company">Company</label>
          <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
          <TextField
            id="contact-name"
            name="name"
            label={t('fields.name.label')}
            placeholder={t('fields.name.placeholder')}
            autoComplete="name"
            maxLength={100}
            defaultValue={values?.name}
            error={messageOf('name')}
          />
          <TextField
            id="contact-contact"
            name="contact"
            type="text"
            label={t('fields.contact.label')}
            placeholder={t('fields.contact.placeholder')}
            autoComplete="email"
            maxLength={254}
            defaultValue={values?.contact}
            error={messageOf('contact')}
          />
        </div>

        <RadioPills
          name="need"
          legend={t('fields.need.legend')}
          options={contactNeeds.map((value) => ({
            value,
            label: t(`fields.need.options.${value}`),
          }))}
          defaultValue={values?.need}
          error={messageOf('need')}
        />

        <TextField
          id="contact-website"
          name="website"
          type="url"
          inputMode="url"
          label={t('fields.website.label')}
          optional={t('optional')}
          placeholder={t('fields.website.placeholder')}
          defaultValue={values?.website}
          error={messageOf('website')}
        />

        <TextArea
          id="contact-message"
          name="message"
          label={t('fields.message.label')}
          placeholder={t('fields.message.placeholder')}
          rows={5}
          maxLength={3000}
          defaultValue={values?.message}
          error={messageOf('message')}
        />

        <Checkbox
          id="contact-privacy"
          name="privacy"
          defaultChecked={values?.privacy}
          error={messageOf('privacy')}
          label={t.rich('fields.privacy', {
            link: (chunks) => (
              <Link href="/privacy" className="underline underline-offset-4">
                {chunks}
              </Link>
            ),
          })}
        />

        <div className="flex flex-col-reverse items-stretch gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-meta text-ink-muted">{t('destination', { email })}</p>
          {/* `aria-disabled` y no `disabled`: así el botón conserva el foco mientras se envía. */}
          <button
            type="submit"
            aria-disabled={pending || undefined}
            className={buttonClasses({
              variant: 'primary',
              size: 'lg',
              className: pending ? 'cursor-progress opacity-70' : undefined,
            })}
          >
            {pending ? (
              <>
                <Loader2
                  aria-hidden="true"
                  size={20}
                  strokeWidth={1.75}
                  className="animate-spin motion-reduce:animate-none"
                />
                {t('sending')}
              </>
            ) : (
              <>
                {t('submit')}
                <ArrowRight aria-hidden="true" size={20} strokeWidth={1.75} />
              </>
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}

/** «Enviado» sustituye al formulario dentro de la misma tarjeta; el foco pasa al título. */
function SuccessMessage({ whatsappHref, onReset }: { whatsappHref: string; onReset: () => void }) {
  const t = useTranslations('contact');
  const common = useTranslations('common');
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => heading.current?.focus(), []);

  return (
    <div role="status" className="flex flex-col items-start gap-5 py-6 sm:py-10">
      <span
        aria-hidden="true"
        className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent"
      >
        <Check size={28} strokeWidth={1.75} />
      </span>
      <p className="text-meta text-accent">{t('success.label')}</p>
      <h2 ref={heading} tabIndex={-1} className="type-section-lg outline-none">
        {t('success.title')}
      </h2>
      <p className="max-w-110 text-[19px]/[30px] text-ink-muted">{t('success.text')}</p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses({ variant: 'primary' })}
        >
          {t('success.whatsapp')}
          <span className="sr-only"> {common('external')}</span>
        </a>
        {/* Sin JavaScript es un enlace a la página (formulario nuevo); con él, reinicia la isla. */}
        <Link
          href="/contact"
          onClick={(event) => {
            event.preventDefault();
            onReset();
          }}
          className="tq-link"
        >
          {t('success.again')}
        </Link>
      </div>
      <p className="mt-2 w-full border-t border-line pt-6 text-meta text-ink-muted">
        <Link href="/work" className="tq-link">
          {t('success.works')}
        </Link>
      </p>
    </div>
  );
}
