// Replace root page to redirect users to the default locale
import { redirect } from 'next/navigation';
import { i18n } from '@/i18n/i18n-config'; 

export default function RootPage() {
  redirect(`/${i18n.defaultLocale}`); // Use defaultLocale from i18n config
}
