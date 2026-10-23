import { createCn } from 'cn/config'

export const cn = createCn({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'display-sm', 'heading', 'title', 'body-lg', 'body-md', 'body', 'caption', 'tiny'] }],
    },
  },
})
