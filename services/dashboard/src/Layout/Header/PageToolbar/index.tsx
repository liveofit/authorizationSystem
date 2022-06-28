import React from 'react';
import {
  Button,
  ButtonVariant,
  KebabToggle,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownToggle,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
} from '@patternfly/react-core';
import { BellIcon, CogIcon, HelpIcon } from '@patternfly/react-icons';
import { userState, useUserState } from '@graphql/cache/userState';
import { logout } from '@utils/Auth/helpers';

export const userDropdownItems = (logout: () => void) => [
  <DropdownItem key="1">Link</DropdownItem>,
  <DropdownItem key="2" onClick={() => console.log(userState.get())} component="button">
    Imprimir Info Usuario
  </DropdownItem>,
  <DropdownItem key="3" isDisabled>
    Disabled Link
  </DropdownItem>,
  <DropdownItem key="4" isDisabled component="button">
    Disabled Action
  </DropdownItem>,
  <DropdownSeparator key="5" />,
  <DropdownItem key="6">Separated Link</DropdownItem>,
  <DropdownItem key="7" onClick={() => logout()} component="button">
    Cerrar Sesión
  </DropdownItem>,
];

export const kebabDropdownItems = [
  <DropdownItem key="1">
    <BellIcon /> Notifications
  </DropdownItem>,
  <DropdownItem key="2">
    <CogIcon /> Settings
  </DropdownItem>,
];

const PageToolbar: React.FC = () => {
  const user = useUserState();
  const [isKebabDropdownOpen, setIsKebabDropdownOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <PageHeaderTools>
      <PageHeaderToolsGroup
        visibility={{
          default: 'hidden',
          lg: 'visible',
        }} /** the settings and help icon buttons are only visible on desktop sizes and replaced by a kebab dropdown for other sizes */
      >
        <PageHeaderToolsItem>
          <Button aria-label="Settings actions" variant={ButtonVariant.plain}>
            <CogIcon />
          </Button>
        </PageHeaderToolsItem>
        <PageHeaderToolsItem>
          <Button aria-label="Help actions" variant={ButtonVariant.plain}>
            <HelpIcon />
          </Button>
        </PageHeaderToolsItem>
      </PageHeaderToolsGroup>
      <PageHeaderToolsGroup>
        <PageHeaderToolsItem
          visibility={{
            lg: 'hidden',
          }} /** this kebab dropdown replaces the icon buttons and is hidden for desktop sizes */
        >
          <Dropdown
            isPlain
            position="right"
            onSelect={onKebabDropdownSelect}
            toggle={<KebabToggle onToggle={onKebabDropdownToggle} />}
            isOpen={isKebabDropdownOpen}
            dropdownItems={kebabDropdownItems}
          />
        </PageHeaderToolsItem>
        <PageHeaderToolsItem
          visibility={{ md: 'visible' }} /** this user dropdown is hidden on mobile sizes */
        >
          <Dropdown
            isPlain
            position="right"
            onSelect={onDropdownSelect}
            isOpen={isDropdownOpen}
            toggle={<DropdownToggle onToggle={onDropdownToggle}>{user.username}</DropdownToggle>}
            dropdownItems={userDropdownItems(handleLogout)}
          />
        </PageHeaderToolsItem>
      </PageHeaderToolsGroup>
    </PageHeaderTools>
  );

  function onKebabDropdownSelect() {
    setIsKebabDropdownOpen(!isKebabDropdownOpen);
  }

  function onKebabDropdownToggle(isKebabDropdownOpen: boolean) {
    setIsKebabDropdownOpen(isKebabDropdownOpen);
  }

  function onDropdownSelect() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  function onDropdownToggle(isDropdownOpen: boolean) {
    setIsDropdownOpen(isDropdownOpen);
  }
};

export default PageToolbar;
