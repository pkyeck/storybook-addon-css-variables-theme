import { addons, types } from '@storybook/manager-api';

import { Tool } from './Tool';
import { ADDON_ID } from './constants';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'CSS Variables Theme',
    type: types.TOOL,
    match: ({ viewMode }) => !!viewMode?.match(/^(story|docs)$/),
    render: Tool,
  });
});
