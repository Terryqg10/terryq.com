import type { WorkMeta } from '../../types';
import cover from './images/finanzas-escritorio.webp';

const coverImage = {
  src: cover,
  alt: {
    es: 'Panel de Finanzas Personales en modo demo: saldo total, resumen del mes, gasto por categoría y evolución mensual de ingresos y gastos',
    en: 'Finanzas Personales dashboard in demo mode: total balance, monthly summary, spending by category and monthly income and expenses',
  },
};

export const meta = {
  slug: 'finanzas-personales',
  name: 'Finanzas Personales',
  year: 2026,
  status: 'live',
  categories: ['web'],
  siteUrl: 'https://finanzas-personales-roan.vercel.app/',
  demoUrl: null,
  title: {
    es: 'Mis finanzas, mes a mes, sin hojas de cálculo',
    en: 'My finances, month by month, without spreadsheets',
  },
  summary: {
    es: 'App para controlar ingresos, gastos, presupuestos y ahorro mes a mes.',
    en: 'A personal finance app to track income, spending, budgets and savings month by month.',
  },
  rowSummary: {
    es: 'App para controlar ingresos, gastos, presupuestos y ahorro mes a mes.',
    en: 'A personal finance app to track income, spending, budgets and savings month by month.',
  },
  tags: {
    es: ['Aplicación web'],
    en: ['Web app'],
  },
  typeLabel: { es: 'Aplicación propia', en: 'Own web app' },
  sector: { es: 'Aplicación propia', en: 'Own web app' },
  cardStack: ['Next.js', 'Supabase', 'RLS'],
  facts: [
    {
      label: { es: 'Tipo', en: 'Type' },
      value: { es: 'Aplicación propia', en: 'Own web app' },
    },
    {
      label: { es: 'Servicios', en: 'Services' },
      value: {
        es: 'Diseño y desarrollo · Base de datos y seguridad',
        en: 'Design and development · Database and security',
      },
    },
  ],
  notice: null,
  testimonial: null,
  images: {
    cover: coverImage,
    // Provisional: aún no hay captura móvil de Finanzas; la sustituye `pnpm screenshots` (T35).
    mobile: coverImage,
    thumb: coverImage,
    preview: coverImage,
    pieces: [],
  },
} as const satisfies WorkMeta;
