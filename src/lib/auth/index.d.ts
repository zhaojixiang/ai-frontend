export type AuthorizeType = {
	appId?: string; //
	mode?: number; // 1 登录， 2 不登录
	wechatAuthType?: number; // 1 用户授权 2 静默授权
	authBizType?: 3 | 4; // 3 双账号处理场景 4 微信授权
	linkCode?: string; // 用于查询班期id
	requestUrl?: string; // 用于查询班期id
};
