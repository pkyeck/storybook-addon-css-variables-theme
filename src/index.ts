import { addons, makeDecorator } from '@storybook/addons';

import { ADDON_PARAM_KEY, CLEAR_LABEL, EVENT_NAME } from './constants';
import { getCookie } from './cookie';

let currentCSS: any = null;

async function addBrandStyles(id: string, files: { [key: string]: any }) {
  const file = files[id];
  if (file) {
    file.use();

    // If we've got a CSS file in use, turn it off
    if (currentCSS) {
      currentCSS.unuse();
    }

    currentCSS = file;
  }
  if (currentCSS && id === CLEAR_LABEL) {
    currentCSS.unuse();
    currentCSS = null;
  }
}

function handleStyleSwitch({
  id,
  files,
}: {
  id: string;
  files: { [key: string]: any };
}) {
  addBrandStyles(id, files);

  const customEvent = new CustomEvent(EVENT_NAME, { detail: { theme: id } });
  document?.dispatchEvent(customEvent);
}

export default makeDecorator({
  name: 'CSS Variables Theme',
  parameterName: ADDON_PARAM_KEY,

  wrapper: (getStory, context, { parameters }) => {
    const { files, theme, defaultTheme } = parameters;
    const globalsTheme = context.globals.cssVariables;
    const channel = addons.getChannel();
    const cookieId = getCookie('cssVariables');
    // eslint-disable-next-line max-len
    const savedTheme =
      cookieId &&
      (Object.hasOwnProperty.call(files, cookieId) || cookieId === CLEAR_LABEL)
        ? cookieId
        : null;

    if (savedTheme != null && globalsTheme !== savedTheme) {
      context.globals.cssVariables = savedTheme;
    }

    const themeToLoad = savedTheme || globalsTheme || theme || defaultTheme;

    handleStyleSwitch({ id: themeToLoad, files });
    channel.on('cssVariablesChange', ({ id }: { id: string }) => {
      handleStyleSwitch({ id, files });
    });

    return getStory(context);
  },
});
