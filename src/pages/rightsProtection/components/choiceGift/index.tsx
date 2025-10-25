import { Toast } from 'antd-mobile';
import cx from 'classnames';
import { cloneDeep } from 'lodash-es';
import { useEffect, useState } from 'react';

import ClassIcon from '@/assets/images/jojo/rightsProtection/class.png';
import Empty from '@/assets/images/jojo/rightsProtection/empty.png';
import GiftIcon from '@/assets/images/jojo/rightsProtection/gift.png';
import SelectedIcon from '@/assets/images/jojo/rightsProtection/selected.png';
import UnselectIcon from '@/assets/images/jojo/rightsProtection/unselect.png';

import styles from './index.module.less';

const ChoiceGift = (props: any) => {
  const { giftPoolsType, /* PromotionList */ onUserHandleClick, choicesChoiceData } = props;
  const normalList = [
    {
      // 是否命中促销
      hitPromotion: true,
      // 命中的促销活动ID
      promotionId: 123456789,
      // 命中的促销活动版本号
      promotionVersion: 1,
      //赠送策略， 赠送策略：NORMAL_GIFT-普通赠送；CHOICES_GIFT-M选N
      giftStrategy: 'NORMAL_GIFT',
      // SKU ID
      skuId: 10001,
      // 标准价格
      price: 10000,
      // 促销价格
      promotionPrice: 8000,
      // 立减金额
      discountAmount: 2000,
      // 赠品池信息列表
      giftPools: [
        {
          // 赠品池ID
          poolId: 5001,
          // 赠品池名称
          poolName: '双十一专属赠品池',
          // 赠品总可选数量
          giftOptionalNum: 3,
          //赠品池数量如何判断？ giftSkus.size() 已确认
          // 赠品SKU信息列表
          giftSkus: [
            {
              // 赠品SKU ID
              skuId: 20000,
              // 赠品SKU名称
              skuName: '精美礼品盒1',
              skuImageUrl:
                'https://jojostorage.oss-cn-hangzhou.aliyuncs.com/uc/userDefaultHeadImg.png', //赠品售卖SKU图  缺少,自己关联
              skuType: 'ENTITY',
              // 库存ID
              stockId: 30001,
              skuStock: 1, //可用库存 新的rpc没有 需要新增
              resourcePlatform: 2, //1是阅读,用于判断赠课/赠品 缺少,自己关联
              // 是否和首期发货
              mergeDelivery: true,
              // 赠品上限数量
              giftMaxNum: 1,
              // 产品组ID
              productGroupId: 4001,
              // 产品组名称
              productGroupName: '促销赠品组',
              // 赠品已使用数量
              giftUsedNum: 0,
              // 是否为固定赠品
              fixedGift: false,
              // 发货时机
              shipMoment: 'IMMEDIATE'
            },
            {
              // 赠品SKU ID
              skuId: 20001,
              // 赠品SKU名称
              skuName: '精美礼品盒2',
              skuImageUrl:
                'https://jojostorage.oss-cn-hangzhou.aliyuncs.com/uc/userDefaultHeadImg.png', //赠品售卖SKU图  缺少,自己关联
              skuType: '',
              // 库存ID
              stockId: 30001,
              skuStock: 1, //可用库存 新的rpc没有 需要新增
              resourcePlatform: 2, //1是阅读,用于判断赠课/赠品 缺少,自己关联
              // 是否和首期发货
              mergeDelivery: true,
              // 赠品上限数量
              giftMaxNum: 1,
              // 产品组ID
              productGroupId: 4001,
              // 产品组名称
              productGroupName: '促销赠品组',
              // 赠品已使用数量
              giftUsedNum: 0,
              // 是否为固定赠品
              fixedGift: false,
              // 发货时机
              shipMoment: 'IMMEDIATE'
            },
            {
              // 赠品SKU ID
              skuId: 20002,
              // 赠品SKU名称
              skuName: '精美礼品盒3',
              skuImageUrl:
                'https://jojostorage.oss-cn-hangzhou.aliyuncs.com/uc/userDefaultHeadImg.png', //赠品售卖SKU图  缺少,自己关联
              skuType: '',
              // 库存ID
              stockId: 30001,
              skuStock: 1, //可用库存 新的rpc没有 需要新增
              resourcePlatform: 2, //1是阅读,用于判断赠课/赠品 缺少,自己关联
              // 是否和首期发货
              mergeDelivery: true,
              // 赠品上限数量
              giftMaxNum: 1,
              // 产品组ID
              productGroupId: 4001,
              // 产品组名称
              productGroupName: '促销赠品组',
              // 赠品已使用数量
              giftUsedNum: 0,
              // 是否为固定赠品
              fixedGift: false,
              // 发货时机
              shipMoment: 'IMMEDIATE'
            },
            {
              // 赠品SKU ID
              skuId: 20003,
              // 赠品SKU名称
              skuName: '精美礼品盒4',
              skuImageUrl:
                'https://jojostorage.oss-cn-hangzhou.aliyuncs.com/uc/userDefaultHeadImg.png', //赠品售卖SKU图  缺少,自己关联
              skuType: '',
              // 库存ID
              stockId: 30001,
              skuStock: 1, //可用库存 新的rpc没有 需要新增
              resourcePlatform: 2, //1是阅读,用于判断赠课/赠品 缺少,自己关联
              // 是否和首期发货
              mergeDelivery: true,
              // 赠品上限数量
              giftMaxNum: 1,
              // 产品组ID
              productGroupId: 4001,
              // 产品组名称
              productGroupName: '促销赠品组',
              // 赠品已使用数量
              giftUsedNum: 1,
              // 是否为固定赠品
              fixedGift: false,
              // 发货时机
              shipMoment: 'IMMEDIATE'
            }
          ]
        }
      ],
      // 目标用户ID
      targetUserId: 100001,
      // 规则冲突策略：COUPON_FIRST-优惠券优先；DISCOUNT_COUPON_COMBINATION-立减、优惠券叠加
      ruleConflictStrategy: 'COUPON_FIRST',
      // 促销信息（具体结构参考PromotionInfoResp类）
      promotionInfo: {
        // 促销活动名称
        promotionName: '双十一大促',
        // 促销类型
        promotionType: 'DISCOUNT'
      },

      // 匹配促销规则时间（时间戳）
      matchedRuleTime: 1704067200000
    },
    {
      // 是否命中促销
      hitPromotion: true,
      // 命中的促销活动ID
      promotionId: 123456789,
      // 命中的促销活动版本号
      promotionVersion: 1,
      //赠送策略， 赠送策略：NORMAL_GIFT-普通赠送；CHOICES_GIFT-M选N
      giftStrategy: 'NORMAL_GIFT',
      // SKU ID
      skuId: 10002,
      // 标准价格
      price: 10000,
      // 促销价格
      promotionPrice: 8000,
      // 立减金额
      discountAmount: 2000,
      // 赠品池信息列表
      giftPools: [
        {
          // 赠品池ID
          poolId: 5002,
          // 赠品池名称
          poolName: '双十一专属赠品池',
          // 赠品总可选数量
          giftOptionalNum: 3,
          //赠品池数量如何判断？ giftSkus.size() 已确认
          // 赠品SKU信息列表
          giftSkus: [
            {
              // 赠品SKU ID
              skuId: 20004,
              // 赠品SKU名称
              skuName: '汉字真神奇汉字真神奇汉字真神奇汉字真神奇',
              skuImageUrl:
                'https://jojostorage.oss-cn-hangzhou.aliyuncs.com/uc/userDefaultHeadImg.png', //赠品售卖SKU图  缺少,自己关联
              skuType: '',
              // 库存ID
              stockId: 30001,
              skuStock: 1, //可用库存 新的rpc没有 需要新增
              resourcePlatform: 1, //1是阅读,用于判断赠课/赠品 缺少,自己关联
              // 是否和首期发货
              mergeDelivery: true,
              // 赠品上限数量
              giftMaxNum: 1,
              // 产品组ID
              productGroupId: 4001,
              // 产品组名称
              productGroupName: '促销赠品组',
              // 赠品已使用数量
              giftUsedNum: 0,
              // 是否为固定赠品
              fixedGift: false,
              // 发货时机
              shipMoment: 'IMMEDIATE'
            }
          ]
        }
      ],
      // 目标用户ID
      targetUserId: 100001,
      // 规则冲突策略：COUPON_FIRST-优惠券优先；DISCOUNT_COUPON_COMBINATION-立减、优惠券叠加
      ruleConflictStrategy: 'COUPON_FIRST',
      // 促销信息（具体结构参考PromotionInfoResp类）
      promotionInfo: {
        // 促销活动名称
        promotionName: '双十一大促',
        // 促销类型
        promotionType: 'DISCOUNT'
      },

      // 匹配促销规则时间（时间戳）
      matchedRuleTime: 1704067200000
    }
  ];

  const choiceList = [
    {
      // 是否命中促销
      hitPromotion: true,
      // 命中的促销活动ID
      promotionId: 123456789,
      // 命中的促销活动版本号
      promotionVersion: 1,
      //赠送策略， 赠送策略：NORMAL_GIFT-普通赠送；CHOICES_GIFT-M选N
      giftStrategy: 'CHOICES_GIFT',
      // SKU ID
      skuId: 10001,
      // 标准价格
      price: 10000,
      // 促销价格
      promotionPrice: 8000,
      // 立减金额
      discountAmount: 2000,
      // 赠品池信息列表
      giftPools: [
        {
          // 赠品池ID
          poolId: 5001,
          // 赠品池名称
          poolName: '双十一专属赠品池',
          // 赠品总可选数量
          giftOptionalNum: 2,
          //赠品池数量如何判断？ giftSkus.size() 已确认
          // 赠品SKU信息列表
          giftSkus: [
            {
              // 赠品SKU ID
              skuId: 20000,
              // 赠品SKU名称
              skuName: '精美礼品盒1',
              skuImageUrl:
                'https://jojostorage.oss-cn-hangzhou.aliyuncs.com/uc/userDefaultHeadImg.png', //赠品售卖SKU图  缺少,自己关联
              skuType: '',
              // 库存ID
              stockId: 30001,
              skuStock: 1, //可用库存 新的rpc没有 需要新增
              resourcePlatform: 1, //1是阅读,用于判断赠课/赠品 缺少,自己关联
              // 是否和首期发货
              mergeDelivery: true,
              // 赠品上限数量
              giftMaxNum: 1,
              // 产品组ID
              productGroupId: 4001,
              // 产品组名称
              productGroupName: '促销赠品组',
              // 赠品已使用数量
              giftUsedNum: 0,
              // 是否为固定赠品
              fixedGift: false,
              // 发货时机
              shipMoment: 'IMMEDIATE'
            },
            {
              // 赠品SKU ID
              skuId: 20001,
              // 赠品SKU名称
              skuName: '精美礼品盒2',
              skuImageUrl:
                'https://jojostorage.oss-cn-hangzhou.aliyuncs.com/uc/userDefaultHeadImg.png', //赠品售卖SKU图  缺少,自己关联
              skuType: '',
              // 库存ID
              stockId: 30001,
              skuStock: 1, //可用库存 新的rpc没有 需要新增
              resourcePlatform: 1, //1是阅读,用于判断赠课/赠品 缺少,自己关联
              // 是否和首期发货
              mergeDelivery: true,
              // 赠品上限数量
              giftMaxNum: 1,
              // 产品组ID
              productGroupId: 4001,
              // 产品组名称
              productGroupName: '促销赠品组',
              // 赠品已使用数量
              giftUsedNum: 0,
              // 是否为固定赠品
              fixedGift: false,
              // 发货时机
              shipMoment: 'IMMEDIATE'
            },
            {
              // 赠品SKU ID
              skuId: 20002,
              // 赠品SKU名称
              skuName: '精美礼品盒3',
              skuImageUrl:
                'https://jojostorage.oss-cn-hangzhou.aliyuncs.com/uc/userDefaultHeadImg.png', //赠品售卖SKU图  缺少,自己关联
              skuType: '',
              // 库存ID
              stockId: 30001,
              skuStock: 1, //可用库存 新的rpc没有 需要新增
              resourcePlatform: 2, //1是阅读,用于判断赠课/赠品 缺少,自己关联
              // 是否和首期发货
              mergeDelivery: true,
              // 赠品上限数量
              giftMaxNum: 1,
              // 产品组ID
              productGroupId: 4001,
              // 产品组名称
              productGroupName: '促销赠品组',
              // 赠品已使用数量
              giftUsedNum: 0,
              // 是否为固定赠品
              fixedGift: false,
              // 发货时机
              shipMoment: 'IMMEDIATE'
            },
            {
              // 赠品SKU ID
              skuId: 20003,
              // 赠品SKU名称
              skuName: '精美礼品盒4',
              skuImageUrl:
                'https://jojostorage.oss-cn-hangzhou.aliyuncs.com/uc/userDefaultHeadImg.png', //赠品售卖SKU图  缺少,自己关联
              skuType: '',
              // 库存ID
              stockId: 30001,
              skuStock: 1, //可用库存 新的rpc没有 需要新增
              resourcePlatform: 2, //1是阅读,用于判断赠课/赠品 缺少,自己关联
              // 是否和首期发货
              mergeDelivery: true,
              // 赠品上限数量
              giftMaxNum: 1,
              // 产品组ID
              productGroupId: 4001,
              // 产品组名称
              productGroupName: '促销赠品组',
              // 赠品已使用数量
              giftUsedNum: 1,
              // 是否为固定赠品
              fixedGift: false,
              // 发货时机
              shipMoment: 'IMMEDIATE'
            }
          ]
        }
      ],
      // 目标用户ID
      targetUserId: 100001,
      // 规则冲突策略：COUPON_FIRST-优惠券优先；DISCOUNT_COUPON_COMBINATION-立减、优惠券叠加
      ruleConflictStrategy: 'COUPON_FIRST',
      // 促销信息（具体结构参考PromotionInfoResp类）
      promotionInfo: {
        // 促销活动名称
        promotionName: '双十一大促',
        // 促销类型
        promotionType: 'DISCOUNT'
      },

      // 匹配促销规则时间（时间戳）
      matchedRuleTime: 1704067200000
    }
  ];
  // 普通赠品奖池
  const [normalPools, setNormalPools] = useState<any>({
    normalClassList: [],
    normalGiftList: []
  });
  // M选N赠品奖池
  const [choicePools, setChoicePools] = useState<any>([]);

  const onHanldeClick = (poolId: number, skuId: number, needAddress: boolean) => {
    const newlist = cloneDeep(choicesChoiceData);
    const isEditeItem = newlist.find((item: any) => item.poolId === poolId);
    if (!Array.isArray(isEditeItem?.skuIds) || isEditeItem.length === 0) {
      Toast.show({
        content: '出错了，请重试',
        duration: 2000
      });
      return;
    }

    const skuIndex = isEditeItem.skuIds.indexOf(skuId);

    if (skuIndex !== -1) {
      // 如果 skuId 已存在，移除它
      isEditeItem.skuIds.splice(skuIndex, 1);
    } else {
      // 如果 skuId 不存在，检查是否超过 giftOptionalNum 限制
      if (isEditeItem.skuIds.length < isEditeItem.giftOptionalNum) {
        isEditeItem.skuIds.push(skuId);
      } else {
        Toast.show({
          content: `最多只能选择 ${isEditeItem.giftOptionalNum} 个赠品`,
          duration: 2000
        });
        return;
      }
    }
    isEditeItem.needAddress = needAddress;
    onUserHandleClick({
      normalData: [],
      choicesData: newlist
    });
  };

  useEffect(() => {
    const normalChoiceData: any = [];
    const defaultChoiceData: any = [];

    if (Array.isArray(normalList) && normalList.length > 0) {
      const flatGiftPools = normalList
        .filter((item) => item.giftPools?.length > 0)
        .flatMap((item) => item.giftPools);
      // 遍历所有赠品池

      flatGiftPools?.forEach((poolItem) => {
        const isneedAddress =
          poolItem?.giftSkus?.some((skusItem) => skusItem?.skuType === 'ENTITY') || false;
        normalChoiceData.push({
          poolId: poolItem?.poolId,
          skuIds: poolItem?.giftSkus
            ?.filter((skusItem) => skusItem?.giftMaxNum - skusItem?.giftUsedNum > 0)
            ?.map((skusItem) => skusItem?.skuId)
            ?.filter((skuId) => skuId !== undefined),
          needAddress: isneedAddress
        });
      });

      // 遍历所有奖品池与奖品SKU
      const flatGiftSkus = flatGiftPools.flatMap((pool) => pool.giftSkus);
      // 获取赠课奖池list
      const normalClassList = flatGiftSkus.filter((sku) => sku.resourcePlatform === 1);
      // 获取赠品奖池list
      const normalGiftList = flatGiftSkus.filter((sku) => sku.resourcePlatform !== 1);

      setNormalPools({
        normalClassList,
        normalGiftList
      });
    }
    if (Array.isArray(choiceList) && choiceList.length > 0) {
      const flatGiftPools = choiceList
        .filter((item) => item.giftPools?.length > 0)
        .flatMap((item) => item.giftPools);
      const processedData = flatGiftPools.map((poolItem) => {
        const choiceClassList = poolItem.giftSkus.filter((sku) => sku.resourcePlatform === 1);
        const choiceGiftList = poolItem.giftSkus.filter((sku) => sku.resourcePlatform !== 1);
        defaultChoiceData.push({
          poolId: poolItem?.poolId,
          skuIds: [],
          giftOptionalNum: poolItem?.giftOptionalNum,
          needAddress: false
        });
        return {
          ...poolItem,
          choiceClassList,
          choiceGiftList
        };
      });
      setChoicePools(processedData);
    }

    onUserHandleClick({
      normalData: normalChoiceData,
      choicesData: defaultChoiceData
    });
  }, [onUserHandleClick]);

  const { normalClassList, normalGiftList } = normalPools;

  return (
    <div className={styles['choice-gift-container']}>
      {/* 普通奖池用户选择 */}
      {giftPoolsType !== 'CHOICES_GIFT' ? (
        <>
          <div className={styles['choice-class']}>
            {normalClassList.length > 0 && (
              <div className={styles['choice-class-header']}>
                <img src={ClassIcon} alt='' className={styles['choice-class-icon']} />
                <div className={styles['choice-class-title']}>赠课</div>
              </div>
            )}
            <div className={styles['choice-list']}>
              {normalClassList?.map((item) => {
                const isEmpty = item?.giftMaxNum - item?.giftUsedNum <= 0;
                return (
                  <div className={styles['choice-item']} key={item?.skuId}>
                    <div className={styles['choice-item-img-container']}>
                      <img src={item?.skuImageUrl} alt='' className={styles['choice-item-img']} />
                      {isEmpty && <img src={Empty} alt='' className={styles['empty-icon']} />}
                    </div>
                    <div className={styles['choice-item-name']}>{item?.skuName}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles['choice-gift']}>
            {normalGiftList.length > 0 && (
              <div className={styles['choice-gift-header']}>
                <img src={GiftIcon} alt='' className={styles['choice-gift-icon']} />
                <div className={styles['choice-gift-title']}>赠品</div>
              </div>
            )}
            <div className={styles['choice-list']}>
              {normalGiftList?.map((item) => {
                const isEmpty = item?.giftMaxNum - item?.giftUsedNum <= 0;
                return (
                  <div className={styles['choice-item']} key={item?.skuId}>
                    <div className={styles['choice-item-img-container']}>
                      <img src={item?.skuImageUrl} alt='' className={styles['choice-item-img']} />
                      {isEmpty && <img src={Empty} alt='' className={styles['empty-icon']} />}
                    </div>
                    <div className={styles['choice-item-name']}>{item?.skuName}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
      {/* M选N奖池用户选择 */}
      {giftPoolsType !== 'NORMAL_GIFT' ? (
        <>
          {choicePools?.map((poolItem: any) => {
            const { choiceClassList, choiceGiftList } = poolItem;
            const editItem = choicesChoiceData.find((item: any) => item.poolId === poolItem.poolId);
            const selectedSkuIds = editItem?.skuIds || [];
            return (
              <>
                <div
                  className={cx(
                    styles['choice-class'],
                    giftPoolsType !== 'MIX_GIFT' && styles['choice-class-mix']
                  )}>
                  <div className={styles['choice-class-header']}>
                    <img src={ClassIcon} alt='' className={styles['choice-class-icon']} />
                    <div className={styles['choice-class-title']}>
                      {choicePools.length > 1 ? poolItem?.poolName : '赠课'}
                    </div>
                    <div
                      className={
                        styles['choice-class-tip']
                      }>{`可选择${poolItem?.giftOptionalNum}件`}</div>
                  </div>
                  <div className={styles['choice-list']}>
                    {choiceClassList?.map((item) => {
                      const isEmpty = item?.giftMaxNum - item?.giftUsedNum <= 0;
                      const Selected = selectedSkuIds.includes(item?.skuId);
                      return (
                        <div
                          className={cx(styles['choice-item'], Selected && styles['selected'])}
                          key={item?.skuId}
                          onClick={() => {
                            onHanldeClick(poolItem.poolId, item.skuId, item.skuType === 'ENTITY');
                          }}>
                          <div className={styles['choice-item-img-container']}>
                            <img
                              src={item?.skuImageUrl}
                              alt=''
                              className={styles['choice-item-img']}
                            />
                            {!isEmpty && (
                              <img
                                src={Selected ? SelectedIcon : UnselectIcon}
                                className={styles['select-icon']}
                              />
                            )}
                            {isEmpty && <img src={Empty} alt='' className={styles['empty-icon']} />}
                          </div>
                          <div className={styles['choice-item-name']}>{item?.skuName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={styles['choice-gift']}>
                  <div className={styles['choice-gift-header']}>
                    <img src={GiftIcon} alt='' className={styles['choice-gift-icon']} />
                    <div className={styles['choice-gift-title']}>
                      {choicePools.length > 1 ? poolItem?.poolName : '赠品'}
                    </div>
                    {/* <div className={styles['choice-gift-tip']}>可选择2</div> */}
                  </div>
                  <div className={styles['choice-list']}>
                    {choiceGiftList?.map((item) => {
                      const isEmpty = item?.giftMaxNum - item?.giftUsedNum <= 0;
                      const Selected = selectedSkuIds.includes(item?.skuId);
                      return (
                        <div
                          className={cx(styles['choice-item'], Selected && styles['selected'])}
                          key={item?.skuId}
                          onClick={() => {
                            onHanldeClick(poolItem.poolId, item.skuId, item.skuType === 'ENTITY');
                          }}>
                          <div className={styles['choice-item-img-container']}>
                            <img
                              src={item?.skuImageUrl}
                              alt=''
                              className={styles['choice-item-img']}
                            />
                            {!isEmpty && (
                              <img
                                src={Selected ? SelectedIcon : UnselectIcon}
                                className={styles['select-icon']}
                              />
                            )}
                            {isEmpty && <img src={Empty} alt='' className={styles['empty-icon']} />}
                          </div>
                          <div className={styles['choice-item-name']}>{item?.skuName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })}
        </>
      ) : null}
    </div>
  );
};
export default ChoiceGift;
