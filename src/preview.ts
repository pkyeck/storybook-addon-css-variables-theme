import type { Renderer, ProjectAnnotations } from '@storybook/types';

import { ADDON_PARAM_KEY } from './constants';

const preview: ProjectAnnotations<Renderer> = {
  decorators: [],
  // decorators: [WithGlobals],
  globals: {
    [ADDON_PARAM_KEY]: false,
  },
};

export default preview;
