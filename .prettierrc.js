module.exports =  {
    printWidth: 100, // 每行最大字符数，超过会换行，默认80
    semi: true, // 是否在行尾加分号。
    singleQuote: true, // 是否使用单引号而不是使用双引号。
    trailingComma: "none", // 是否使用尾逗号，可选值"<none|es5|all>"，默认none
    tabWidt: 4, // 一个tab代表几个空格数，默认2
    useTabs: false,  // 是否使用tab进行缩进，默认false
    bracketSpacing: true,   // 是否保留对象内侧两端的空格，比如 { foo: bar } 和 {foo:bar} 的区别
    arrowParens: "avoid",  // 箭头函数参数使用圆括号包裹 比如 (x) => x 和 x => x 的区别，"always"( 默认) 总是包裹； "avoid" 尽可能避免包裹
  	endOfLine: "lf",
  	quoteProps: "as-needed", //对象中的属性名加引号的方式。取 as-needed | consistent | preserve,默认 as-needed  
  };