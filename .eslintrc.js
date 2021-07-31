module.exports = {
	extends: [require.resolve('@umijs/fabric/dist/eslint')],
	globals: {
		ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
		page: true,
		REACT_APP_ENV: true,
	},
	// 禁用掉一些eslint没必要的检测
	rules: {
		'array-callback-return': 0, // 数组返回值
		'react/no-string-refs': 0, // refs
	},
};
