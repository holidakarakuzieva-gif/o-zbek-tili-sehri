import { useEffect } from 'react';
import { useLang } from '../../hooks/useLang';

interface PageMetaProps {
  title: string;
  description: string;
}

export function PageMeta({ title, description }: PageMetaProps) {
  const { t } = useLang();

  useEffect(() => {
    const siteName = t('siteName');
    document.title = title ? `${title} — ${siteName}` : siteName;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }
  }, [title, description, t]);

  return null;
}
