'use client'

import { ReactNode, useEffect } from 'react';
import './i18n'; // Import i18n config

type Props = {
  children: ReactNode;
};

export default function I18nProvider({ children }: Props) {
  return <>{children}</>;
}