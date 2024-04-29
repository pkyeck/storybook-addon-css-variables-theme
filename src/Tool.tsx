import { Icons, IconButton } from '@storybook/components';
import { useGlobals, useStorybookApi } from '@storybook/manager-api';
import React, { memo, useCallback, useEffect } from 'react';

import { ADDON_ID, ADDON_PARAM_KEY, TOOL_ID } from './constants';

export const Tool = memo(function MyAddonSelector() {
  const [globals, updateGlobals] = useGlobals();
  const api = useStorybookApi();

  const isActive = [true, 'true'].includes(globals[ADDON_PARAM_KEY]);

  const toggleMyTool = useCallback(() => {
    updateGlobals({
      [ADDON_PARAM_KEY]: !isActive,
    });
  }, [isActive]);

  useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: 'Toggle Measure [O]',
      defaultShortcut: ['O'],
      actionName: 'outline',
      showInMenu: false,
      action: toggleMyTool,
    });
  }, [toggleMyTool, api]);

  return (
    <IconButton
      key={TOOL_ID}
      active={isActive}
      title="Enable my addon"
      onClick={toggleMyTool}
    >
      <Icons icon="lightning" />
    </IconButton>
  );
});

// import {
//   IconButton,
//   WithTooltip,
//   TooltipLinkList,
// } from '@storybook/components';
// import { PaintBrushIcon } from '@storybook/icons';
// import { useGlobals, useParameter, useChannel } from '@storybook/preview-api';
// import { styled } from '@storybook/theming';
// import React, { memo, useEffect, useState } from 'react';

// import { ADDON_PARAM_KEY, CLEAR_LABEL } from './constants';
// import { getCookie } from './cookie';

// const IconButtonWithLabel = styled(IconButton)(() => ({
//   display: 'inline-flex',
//   alignItems: 'center',
// }));

// const ActiveViewportLabel = styled.div(({ theme }) => ({
//   display: 'inline-block',
//   textDecoration: 'none',
//   padding: 10,
//   fontWeight: theme.typography.weight.bold,
//   fontSize: theme.typography.size.s2 - 1,
//   lineHeight: '1',
//   height: 40,
//   border: 'none',
//   borderTop: '3px solid transparent',
//   borderBottom: '3px solid transparent',
//   background: 'transparent',
// }));

// const Dropdown = memo(function CssVariablesThemeAddonSelector() {
//   const [globals, updateGlobals] = useGlobals();
//   const cookieTheme = getCookie('cssVariables');
//   const addonParams = useParameter<{
//     theme?: string;
//     defaultTheme?: string;
//     files?: Array<string>;
//   }>(ADDON_PARAM_KEY, {});
//   const { theme, defaultTheme, files } = addonParams;
//   const id = files && Object.hasOwn(files, cookieTheme) && cookieTheme;
//   const selected = globals.cssVariables || theme || id;

//   console.log({ theme, defaultTheme, id, selected });
//   const [value, setValue] = useState(theme || id || defaultTheme);

//   useEffect(() => {
//     updateGlobals({
//       cssVariables: value,
//     });
//   }, [updateGlobals, value]);

//   const emit = useChannel({});

//   // useEffect(() => {
//   //   if (!selected) {
//   //     setValue(theme || id || defaultTheme);
//   //   }
//   // }, [selected, theme, defaultTheme, id]);

//   function handleChange(onHide: () => void, value: string) {
//     const newValue = value.indexOf(CLEAR_LABEL) > -1 ? CLEAR_LABEL : value;
//     setValue(newValue);
//     emit('cssVariablesChange', { id: newValue });
//     onHide();
//   }

//   function toLink(value: string, active: boolean, onHide: () => void) {
//     return {
//       id: value,
//       title: !value ? CLEAR_LABEL : value,
//       onClick: () => handleChange(onHide, value),
//       active,
//     };
//   }

//   function generateLinks(items: Array<string>, onHide: () => void) {
//     const result = Object.keys(items).map((value) =>
//       toLink(value, value === selected, onHide),
//     );
//     if (selected !== CLEAR_LABEL && !defaultTheme) {
//       result.unshift(toLink(CLEAR_LABEL, false, onHide));
//     }
//     return result;
//   }

//   if (files.length === 0) {
//     return null;
//   }

//   return (
//     <WithTooltip
//       placement="top"
//       trigger="click"
//       tooltip={({ onHide }) => (
//         <TooltipLinkList links={generateLinks(files, onHide)} />
//       )}
//     >
//       <IconButtonWithLabel
//         key="css themes"
//         title="CSS custom properties themes"
//         active={Object.hasOwn(files, selected)}
//       >
//         <PaintBrushIcon />
//         <ActiveViewportLabel title="Theme">
//           {selected || 'No theme'}
//         </ActiveViewportLabel>
//       </IconButtonWithLabel>
//     </WithTooltip>
//   );
// });

// export default Dropdown;
