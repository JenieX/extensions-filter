// const tpl = {
//   vue(strings, ...values) {
//     return String.raw({ raw: strings }, ...values);
//   },
//   // css(strings, ...values) {
//   //   return String.raw({ raw: strings }, ...values);
//   // },
// };

const tpl = {
  css: String.raw,
  html: String.raw,
  js: String.raw,
  json: String.raw,
  md: String.raw,
  ts: String.raw,

  vue(strings, ...values) {
    return String.raw({ raw: strings }, ...values)
      .trim()
      .slice(10, -11);
  },

  // test: String.raw,
  // test(strings, ...values) {
  //   console.log(strings);
  //   console.log(values);

  //   // console.log(String.raw(strings));
  //   return String.raw({ raw: strings }, ...values);
  // },
};

// const name = 'JenieX';
// console.log(tpl.test`I love you ${'great'} ${name}!`);

export { tpl };
