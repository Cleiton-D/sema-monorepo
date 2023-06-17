import { memo } from 'react';

import UserDropdown from 'components/UserDropdown';
import ProfileListDropdown from 'components/ProfileListDropdown';
import SchoolYearSelector from 'components/SchoolYearSelector';

const Header = () => {
  return (
    <header
      style={{ gridArea: 'header' }}
      className="flex items-center justify-between py-0 px-6 bg-background border-b"
    >
      <div className="flex items-center">
        <span className="mr-2">Perfil:</span>
        <ProfileListDropdown />
      </div>

      <div className="flex items-center">
        <span className="mr-2">Ano Letivo:</span>
        <SchoolYearSelector />
      </div>

      <UserDropdown />
    </header>
  );
};

export default memo(Header);
