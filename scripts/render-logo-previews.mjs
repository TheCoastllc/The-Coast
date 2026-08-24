import sharp from 'sharp';
const dir='/private/tmp/claude-501/-Users-davidcoast-Downloads/ccfea029-f2ac-4c53-b644-a522e6661323/scratchpad';
const jobs=[
  [`${dir}/logos/gifted-touch.svg`, `${dir}/prev-gifted-touch.png`],
  [`${dir}/logos/solomon-katsman.svg`, `${dir}/prev-solomon-katsman.png`],
  [`${dir}/logos/omotunde-hospital.svg`, `${dir}/prev-omotunde-hospital.png`],
];
for(const [src,dst] of jobs){
  await sharp(src,{density:300}).resize({width:600}).flatten({background:'#f0f0f0'}).png().toFile(dst);
  console.log('rendered',dst);
}
// downsize dada pngs for viewing
for(const v of ['light','dark']){
  await sharp(`${dir}/dgfg-logo-${v}.png`).resize({width:600}).png().toFile(`${dir}/prev-dada-${v}.png`);
  console.log('rendered dada',v);
}
