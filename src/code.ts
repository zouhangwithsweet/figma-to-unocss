import { toUnocssClass } from 'transform-to-unocss-core';

figma.codegen.on('generate', async (e) => {
  const node = e.node;

  const cssObj = await node.getCSSAsync();
  const raw = Object.entries(cssObj);

  const cssCode = raw.map(([key, value]) => `${key}: ${value.replace(/\/\*.*\*\//g, '').trim()};`).join('\n');

  const uno = raw
    .map(
      ([key, value]) =>
        `${key}: ${value
          .replace(/\/\*.*\*\//g, '')
          .replace(/var\(--[\w-]*,\s*(.*)\)/g, (_, $1) => $1)
          .trim()}`
    )
    .map((i) => toUnocssClass(i, true)[0])
    .join(' ')
    .replace(/border-(\d+\.\d+|\d+)/g, (_, $1) => `border-${Number($1) * 4}`)
    .replace(/(border-[xylrtb]-)(\d+\.\d+|\d+)/g, (_, $1, $2) => `${$1}${Number($2) * 4}`)
    .replace(/(p[xylrtb])-(\d+\.\d+|\d+)px/g, (_, $1, $2) => `${$1}-${$2 / 4}`);

  return [
    {
      title: 'unocss',
      code: uno,
      language: 'HTML'
    },
    {
      title: 'css',
      code: cssCode,
      language: 'CSS'
    }
  ];
});
