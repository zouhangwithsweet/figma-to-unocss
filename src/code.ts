import { toTailwindcss } from 'transform-to-tailwindcss-core';
import { toUnocssClass } from 'transform-to-unocss-core';

figma.codegen.on('generate', async (e) => {
  const node = e.node;

  const cssObj = await node.getCSSAsync();
  const raw = Object.entries(cssObj);
  const cssCode = raw.map(([key, value]) => `${key}: ${value.replace(/\/\*.*\*\//g, '').trim()};`).join('\n');

  const uno = toClass(raw, 'unocss');
  const unoMini = toMiniClass(raw, 'unocss');
  const tailwind = toClass(raw, 'tailwindcss', false);
  const tailwindMini = toMiniClass(raw, 'tailwindcss', false);

  return [
    {
      title: 'unocss',
      code: uno,
      language: "RUST"
    },
    {
      title: 'unocss-mini (without default properties)',
      code: unoMini,
      language: 'RUST'
    },
    {
      title: 'tailwindcss',
      code: tailwind,
      language: 'HTML'
    },
    {
      title: 'tailwindcss-mini (without default properties)',
      code: tailwindMini,
      language: 'HTML'
    },
    {
      title: 'css',
      code: cssCode,
      language: 'CSS'
    }
  ];
});


function toClass(raw: [string, string][], engine: 'unocss' | 'tailwindcss' = 'unocss', isRem: boolean = true) {
  return raw
    .map(
      ([key, value]) =>
        `${key}: ${value
          .replace(/\/\*.*\*\//g, '')
          .replace(/var\(--[\w-]*,\s*(.*)\)/g, (_, $1) => $1)
          .trim()}`
    )
    .map((i) => (engine === 'unocss' ? toUnocssClass(i, isRem)[0] : toTailwindcss(i, isRem)))
    .sort((a, b) => a.localeCompare(b))
    .join(' ')
    .replace(/border-(\d+\.\d+|\d+)/g, (_, $1) => `border-${Number($1) * 4}`)
    .replace(/(border-[xylrtb]-)(\d+\.\d+|\d+)/g, (_, $1, $2) => `${$1}${Number($2) * 4}`)
    .replace(/(p[xylrtb])-(\d+\.\d+|\d+)px/g, (_, $1, $2) => `${$1}-${$2 / 4}`);
}

function toMiniClass(raw: [string, string][], engine: 'unocss' | 'tailwindcss' = 'unocss', isRem: boolean = true) {
  return raw
    .filter(([key]) => !key.startsWith('font-family') && !key.startsWith('text-transform'))
    .map(
      ([key, value]) =>
        `${key}: ${value
          .replace(/\/\*.*\*\//g, '')
          .replace(/var\(--[\w-]*,\s*(.*)\)/g, (_, $1) => $1)
          .trim()}`
    )
    .map((i) => (engine === 'unocss' ? toUnocssClass(i, isRem)[0] : toTailwindcss(i, isRem)))
    .sort((a, b) => a.localeCompare(b))
    .filter((i) => ['lh-normal', 'font-not-italic', 'bg-[url(]'].every((item) => !i?.startsWith(item)))
    .join(' ')
    .replace(/border-(\d+\.\d+|\d+)/g, (_, $1) => `border-${Number($1) * 4}`)
    .replace(/(border-[xylrtb]-)(\d+\.\d+|\d+)/g, (_, $1, $2) => `${$1}${Number($2) * 4}`)
    .replace(/(p[xylrtb])-(\d+\.\d+|\d+)px/g, (_, $1, $2) => `${$1}-${$2 / 4}`);
}
