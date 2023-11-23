import { toUnocssClass } from 'transform-to-unocss-core';

figma.codegen.on('generate', async (e) => {
  const node = e.node;

  const cssObj = await node.getCSSAsync();

  const cssCode = Object.entries(cssObj)
    .map(([key, value]) => `${key}: ${value.replace(/\/\*.*\*\//g, '').trim()};`)
    .join('\n');

  const uno = Object.entries(cssObj)
    .map(([key, value]) => `${key}: ${value.replace(/\/\*.*\*\//g, '').trim()}`)
    .map((i) => toUnocssClass(i, true)[0].replace(/-(var\(.*\))/g, (_, $1) => `-[${$1.replace(/\s/g, '_')}]`))
    .join(' ');

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
