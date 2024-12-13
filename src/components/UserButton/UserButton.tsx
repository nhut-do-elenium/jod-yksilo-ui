import { components } from '@/api/schema';
import { useMenuClickHandler } from '@/hooks/useMenuClickHandler';
import { PopupList, PopupListItem, useMediaQueries } from '@jod/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlinePerson } from 'react-icons/md';
import { Link, NavLink, useLoaderData } from 'react-router';

interface UserButtonProps {
  onLogout: () => void;
}

export const UserButton = ({ onLogout }: UserButtonProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const { sm } = useMediaQueries();
  const data = useLoaderData() as components['schemas']['YksiloCsrfDto'] | null;

  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuButtonRef = React.useRef<HTMLButtonElement>(null);
  const userMenuRef = useMenuClickHandler(() => setUserMenuOpen(false), userMenuButtonRef);

  const userMenuPreferencesUrl = `${t('slugs.profile.index')}/${t('slugs.profile.preferences')}`;

  // Highlight menu element when active
  const getActiveClassNames = ({ isActive }: { isActive: boolean }) => (isActive ? 'bg-secondary-1-50 rounded-sm' : '');

  const landingPageUrl = `/${language}/${t('slugs.profile.login')}`;
  const fullName = `${data?.etunimi} ${data?.sukunimi}`;
  const initials = !!data?.etunimi && !!data?.sukunimi ? data.etunimi[0] + data.sukunimi[0] : '';

  return data?.csrf ? (
    <div className="relative">
      <button
        ref={userMenuButtonRef}
        type="button"
        className={`h-8 w-8 rounded-full bg-secondary-3 bg-cover bg-center`}
        onClick={sm ? () => setUserMenuOpen(!userMenuOpen) : void 0}
        aria-label={fullName}
      >
        {initials}
      </button>
      {sm && userMenuOpen && (
        <div ref={userMenuRef} className="absolute right-0 min-w-max translate-y-8 transform">
          <PopupList classNames="gap-2">
            <NavLink
              to={userMenuPreferencesUrl}
              onClick={() => setUserMenuOpen(false)}
              className={(props) => `w-full ${getActiveClassNames(props)}`.trim()}
            >
              <PopupListItem>{t('profile.index')}</PopupListItem>
            </NavLink>
            <button type="button" onClick={onLogout} className="w-full">
              <PopupListItem classNames="w-full">{t('logout')}</PopupListItem>
            </button>
          </PopupList>
        </div>
      )}
    </div>
  ) : (
    <Link
      to={landingPageUrl}
      state={{ callbackURL: ' ' }}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-gray-2"
      aria-label={t('login')}
    >
      <MdOutlinePerson size={24} />
    </Link>
  );
};
