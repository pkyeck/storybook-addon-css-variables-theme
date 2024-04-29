import { addons, types } from '@storybook/addons';
import { useChannel, useParameter, useGlobals } from '@storybook/api';
import {
  Icons,
  IconButton,
  WithTooltip,
  TooltipLinkList,
} from '@storybook/components';
import { styled } from '@storybook/theming';
import React, { useEffect } from 'react';

import { ADDON_ID, ADDON_PARAM_KEY, CLEAR_LABEL } from './constants';
import { getCookie, setCookie } from './cookie';

type Files = {
  [key: string]: any;
};

type Params = {
  files?: Files;
  theme?: string;
  defaultTheme?: string;
};

const IconButtonWithLabel = styled(IconButton)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

const ActiveViewportLabel = styled.div(({ theme }) => ({
  display: 'inline-block',
  textDecoration: 'none',
  padding: 10,
  fontWeight: theme.typography.weight.bold,
  fontSize: theme.typography.size.s2 - 1,
  lineHeight: '1',
  height: 40,
  border: 'none',
  borderTop: '3px solid transparent',
  borderBottom: '3px solid transparent',
  background: 'transparent',
}));

const Dropdown = () => {
  const [globals, updateGlobals] = useGlobals();
  const cookieTheme = getCookie('cssVariables');
  const addonParams: Params = useParameter(ADDON_PARAM_KEY, {});
  const { theme, defaultTheme, files } = addonParams;
  const id =
    files && Object.hasOwnProperty.call(files, cookieTheme) && cookieTheme;

  const selected = globals.cssVariables || theme || id;
  const setSelected = (value: string | null) => {
    if (value != null) {
      setCookie('cssVariables', value, 10);
      updateGlobals({
        cssVariables: value,
      });
    }
  };

  const emit = useChannel({});

  useEffect(() => {
    if (!selected) {
      setSelected(theme || id || defaultTheme);
    }
  }, [selected, theme, defaultTheme, id]);

  function handleChange(onHide: () => void, value: string | null) {
    const newValue = value.indexOf(CLEAR_LABEL) > -1 ? CLEAR_LABEL : value;
    setSelected(newValue);
    emit('cssVariablesChange', { id: newValue });
    onHide();
  }

  function toLink(value: string, active: boolean, onHide: () => void) {
    return {
      id: value,
      title: !value ? CLEAR_LABEL : value,
      onClick: () => handleChange(onHide, value),
      active,
    };
  }

  function generateLinks(items: Files, onHide: () => void) {
    // eslint-disable-next-line max-len
    const result: any[] = Object.keys(items).map((value) =>
      toLink(value, value === selected, onHide),
    );
    if (selected !== CLEAR_LABEL && !defaultTheme) {
      result.unshift(toLink(CLEAR_LABEL, false, onHide));
    }
    return result;
  }

  if (files) {
    return (
      <WithTooltip
        placement="top"
        trigger="click"
        tooltip={({ onHide }) => (
          <TooltipLinkList links={generateLinks(files, onHide)} />
        )}
        closeOnClick
      >
        <IconButtonWithLabel
          key="css themes"
          title="CSS custom properties themes"
          active={Object.hasOwnProperty.call(files, selected)}
        >
          <Icons icon="paintbrush" />
          <ActiveViewportLabel title="Theme">
            {selected || 'No theme'}
          </ActiveViewportLabel>
        </IconButtonWithLabel>
      </WithTooltip>
    );
  }
  return null;
};

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'CSS Variables Theme',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => <Dropdown />,
  });
});
