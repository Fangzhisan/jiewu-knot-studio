import type { KnotAtlasNode } from './types';

// 2026-10-24 核对246个公开条目；物品含859条来源明示与2条语义待定，不含第三方图片或动画载荷。
export const SOURCE_KNOT_NODES: readonly Omit<KnotAtlasNode, 'localCourse' | 'production'>[] = [
  {
    id: 'fg结',
    source: {
      name: 'FG结',
      url: 'https://knots3d.com/zh-CN/fg%E7%BB%93',
      englishName: 'FG Knot',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/fg-knot',
      englishSlug: 'fg-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/fg%E7%BB%93.webp',
      relatedIds: ['尤卡坦结', '奥尔布赖特结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/fg%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：编织鱼线与前导线是连接双方',
          },
        ],
      },
    ],
  },
  {
    id: '万字结',
    source: {
      name: '万字结',
      url: 'https://knots3d.com/zh-CN/%E4%B8%87%E5%AD%97%E7%BB%93',
      englishName: "Sailor's Cross",
      englishAliases: [
        'Southern Cross',
        'Shamrock Knot',
        "True Lover's Knot",
        'Wing Knot',
        'Suavastika',
      ],
      englishUrl: 'https://knots3d.com/en/sailors-cross-knot',
      englishSlug: 'sailors-cross-knot',
      aliases: ['水手结', '三环结', '卍字结'],
      abok: ['2419'],
      activityIds: ['decorative'],
      typeId: 'multi-loop',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E4%B8%87%E5%AD%97%E7%BB%93.webp',
      relatedIds: ['同心结', '桅顶结', '手铐结'],
    },
    objects: [
      {
        id: 'necklace',
        name: '项链与吊坠',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%87%E5%AD%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：项链是装饰结的成品用途',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%87%E5%AD%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：挂绳是装饰结的成品用途',
          },
        ],
      },
    ],
  },
  {
    id: '三叶结',
    source: {
      name: '三叶结',
      url: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%8F%B6%E7%BB%93',
      englishName: 'Trefoil Knot',
      englishAliases: ['Triquetra', 'Valknut'],
      englishUrl: 'https://knots3d.com/en/trefoil-knot',
      englishSlug: 'trefoil-knot',
      aliases: [],
      abok: [],
      activityIds: ['mathematics'],
      typeId: 'special',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E4%B8%89%E5%8F%B6%E7%BB%93.webp',
      relatedIds: ['反手结'],
    },
    objects: [
      {
        id: 'jewelry',
        name: '珠宝与首饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%8F%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：明确用于珠宝装饰，未推定具体饰品',
          },
        ],
      },
    ],
  },
  {
    id: '三向接绳结',
    source: {
      name: '三向接绳结',
      url: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%90%91%E6%8E%A5%E7%BB%B3%E7%BB%93',
      englishName: 'Three-way Sheet Bend',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/three-way-sheet-bend-knot',
      englishSlug: 'three-way-sheet-bend-knot',
      aliases: ['三向缭绳结'],
      abok: [],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E4%B8%89%E5%90%91%E6%8E%A5%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['接绳结', '双接绳结', '三重接绳结', '单向接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%90%91%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接三根绳索',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%90%91%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：牵绳用于遮蔽物',
          },
        ],
      },
    ],
  },
  {
    id: '三套结',
    source: {
      name: '三套结',
      url: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%A5%97%E7%BB%93',
      englishName: 'Rolling Hitch',
      englishAliases: ["Midshipman's Hitch"],
      englishUrl: 'https://knots3d.com/en/rolling-hitch-knot',
      englishSlug: 'rolling-hitch-knot',
      aliases: [],
      abok: ['1735'],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E4%B8%89%E5%A5%97%E7%BB%93.webp',
      relatedIds: ['舵副结', '营钉结', '马格努斯结', '克拉拉结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：抓握另一根受力绳索',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：细绳是连接材料',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：较粗绳索是被连接对象',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：圆杆是系附对象',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：木料是吊装对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：管子是纵向拖拽对象',
          },
        ],
      },
    ],
  },
  {
    id: '三脚架编结',
    source: {
      name: '三脚架编结',
      url: 'https://knots3d.com/zh-CN/%E4%B8%89%E8%84%9A%E6%9E%B6%E7%BC%96%E7%BB%93',
      englishName: 'Tripod Lashing',
      englishAliases: ['Tripod Lashing with Plain Turns'],
      englishUrl: 'https://knots3d.com/en/tripod-lashing-knot',
      englishSlug: 'tripod-lashing-knot',
      aliases: ['三角支架结'],
      abok: ['2107'],
      activityIds: ['pioneering', 'scouting', 'camping'],
      typeId: 'lashings',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E4%B8%89%E8%84%9A%E6%9E%B6%E7%BC%96%E7%BB%93.webp',
      relatedIds: ['双套结-绳端', '剪立编结'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E8%84%9A%E6%9E%B6%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：三根杆组成三脚架',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E8%84%9A%E6%9E%B6%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：三脚架作为遮蔽物或帐篷入口基座',
          },
        ],
      },
      {
        id: 'cooking',
        name: '炊锅与捆扎食物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E8%84%9A%E6%9E%B6%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：炊锅是悬挂对象',
          },
        ],
      },
      {
        id: 'lighting',
        name: '灯具',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E8%84%9A%E6%9E%B6%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：提灯是悬挂对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E8%84%9A%E6%9E%B6%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：营地装备是吊装对象',
          },
        ],
      },
    ],
  },
  {
    id: '三重反手结',
    source: {
      name: '三重反手结',
      url: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E5%8F%8D%E6%89%8B%E7%BB%93',
      englishName: 'Triple Overhand Knot',
      englishAliases: [
        "Franciscan Friar's Knot",
        'Threefold Overhand Knot',
        "Friar's Knot",
        "French Monk's Knot",
        'Barrel Knot',
        'Monk Knot',
        'Hoodie String Knot',
      ],
      englishUrl: 'https://knots3d.com/en/triple-overhand-knot',
      englishSlug: 'triple-overhand-knot',
      aliases: [],
      abok: ['517'],
      activityIds: ['climbing', 'decorative'],
      typeId: 'stoppers',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E4%B8%89%E9%87%8D%E5%8F%8D%E6%89%8B%E7%BB%93.webp',
      relatedIds: [
        '反手结',
        '双反手结',
        '多重反手结',
        '乌利结',
        '绞架结',
        '三重滚结',
        '三重渔人结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E5%8F%8D%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳尾结位于绳索末端',
          },
        ],
      },
      {
        id: 'shoelace',
        name: '鞋带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E5%8F%8D%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：明确用于鞋带末端',
          },
        ],
      },
      {
        id: 'clothing',
        name: '服装',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E5%8F%8D%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：帽衫绳属于服装配件，未声称捆绑整件衣物',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E5%8F%8D%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：挂绳上增加装饰凸起',
          },
        ],
      },
      {
        id: 'curtain',
        name: '窗帘与挂毯',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E5%8F%8D%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：明确用于窗帘拉绳',
          },
        ],
      },
    ],
  },
  {
    id: '三重接绳结',
    source: {
      name: '三重接绳结',
      url: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E6%8E%A5%E7%BB%B3%E7%BB%93',
      englishName: 'Triple Sheet Bend',
      englishAliases: ['Triple Becket Bend'],
      englishUrl: 'https://knots3d.com/en/triple-sheet-bend-knot',
      englishSlug: 'triple-sheet-bend-knot',
      aliases: ['三重贝克特结'],
      abok: ['1461'],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E4%B8%89%E9%87%8D%E6%8E%A5%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['接绳结', '双接绳结', '双龙连接结', '捆扎结', '贝克特结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两根绳索',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：细绳是连接的一端',
          },
        ],
      },
    ],
  },
  {
    id: '三重渔人结',
    source: {
      name: '三重渔人结',
      url: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E6%B8%94%E4%BA%BA%E7%BB%93',
      englishName: "Triple Fisherman's Knot",
      englishAliases: ["Triple Fisherman's Bend"],
      englishUrl: 'https://knots3d.com/en/triple-fishermans-knot',
      englishSlug: 'triple-fishermans-knot',
      aliases: ['三渔人结'],
      abok: [],
      activityIds: ['caving', 'climbing', 'arborist', 'fire-rescue'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E4%B8%89%E9%87%8D%E6%B8%94%E4%BA%BA%E7%BB%93.webp',
      relatedIds: ['双渔人结', '渔人结', '三重反手结', '普鲁士抓结', '反手连接结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：连接两条救援绳',
          },
        ],
      },
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：连接两条鱼线',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：将辅绳两端连接成绳环',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：长绳环用于搭建攀登锚点',
          },
        ],
      },
    ],
  },
  {
    id: '三重滚结',
    source: {
      name: '三重滚结',
      url: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E6%BB%9A%E7%BB%93',
      englishName: 'Triple Roll',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/triple-roll-knot',
      englishSlug: 'triple-roll-knot',
      aliases: [],
      abok: [],
      activityIds: ['military'],
      typeId: 'stoppers',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E4%B8%89%E9%87%8D%E6%BB%9A%E7%BB%93.webp',
      relatedIds: ['反手结', '三重反手结', '乌利结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E6%BB%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳尾结位于绳索末端',
          },
        ],
      },
    ],
  },
  {
    id: '三重称人结',
    source: {
      name: '三重称人结',
      url: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: 'Triple Bowline',
      englishAliases: ['Three Loop Bowline'],
      englishUrl: 'https://knots3d.com/en/triple-bowline-knot',
      englishSlug: 'triple-bowline-knot',
      aliases: [],
      abok: [],
      activityIds: ['military', 'climbing'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E4%B8%89%E9%87%8D%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: ['称人结', '双称人结-绳中', '西班牙称人结', '兔耳结', '葡萄牙称人结'],
    },
    objects: [
      {
        id: 'harness',
        name: '安全带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：制成三环安全带',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：用于搭建自均衡锚点',
          },
        ],
      },
    ],
  },
  {
    id: '中间八字结',
    source: {
      name: '中间八字结',
      url: 'https://knots3d.com/zh-CN/%E4%B8%AD%E9%97%B4%E5%85%AB%E5%AD%97%E7%BB%93',
      englishName: 'In-Line Figure Eight Loop',
      englishAliases: [
        'Directional Figure 8 Loop',
        'Single Figure Eight on the Bight',
        'In-Line Figure 8 Loop',
      ],
      englishUrl: 'https://knots3d.com/en/in-line-figure-eight-loop-knot',
      englishSlug: 'in-line-figure-eight-loop-knot',
      aliases: [],
      abok: ['1058'],
      activityIds: ['climbing', 'fire-rescue'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E4%B8%AD%E9%97%B4%E5%85%AB%E5%AD%97%E7%BB%93.webp',
      relatedIds: ['八字套结', '兔耳结', '阿尔卑斯蝴蝶结', '阿尔卑斯蝴蝶结-手法'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%AD%E9%97%B4%E5%85%AB%E5%AD%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：连接到绳索中间',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%AD%E9%97%B4%E5%85%AB%E5%AD%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成中段绳环',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B8%AD%E9%97%B4%E5%85%AB%E5%AD%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：铁锁是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '乌利结',
    source: {
      name: '乌利结',
      url: 'https://knots3d.com/zh-CN/%E4%B9%8C%E5%88%A9%E7%BB%93',
      englishName: 'Capuchin',
      englishAliases: ['Uli Knot', 'Heaving Line Knot'],
      englishUrl: 'https://knots3d.com/en/capuchin-knot',
      englishSlug: 'capuchin-knot',
      aliases: ['抛绳结'],
      abok: ['537'],
      activityIds: ['military', 'boating'],
      typeId: 'stoppers',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E4%B9%8C%E5%88%A9%E7%BB%93.webp',
      relatedIds: ['抛绳结', '三重反手结', '多重反手结', '猴拳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B9%8C%E5%88%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索末端增加重量',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'inferred',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B9%8C%E5%88%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '语义待定：明确有横梁，但组名未包括梁，需确认杆柱组是否容纳横梁',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B9%8C%E5%88%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：树枝是抛绳跨越对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B9%8C%E5%88%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：船是抛绳作业的场景载体',
          },
        ],
      },
    ],
  },
  {
    id: '九字结',
    source: {
      name: '九字结',
      url: 'https://knots3d.com/zh-CN/%E4%B9%9D%E5%AD%97%E7%BB%93',
      englishName: 'Figure Nine Loop',
      englishAliases: ['Figure-of-Nine Loop', 'Figure 9', 'Figure-of-Nine on a Bight'],
      englishUrl: 'https://knots3d.com/en/figure-nine-loop-knot',
      englishSlug: 'figure-nine-loop-knot',
      aliases: [],
      abok: [],
      activityIds: ['caving', 'climbing'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E4%B9%9D%E5%AD%97%E7%BB%93.webp',
      relatedIds: ['八字套结', '双重单结', '苦力结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B9%9D%E5%AD%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳端形成固定环',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B9%9D%E5%AD%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：明确在粗绳上打结',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B9%9D%E5%AD%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：形成固定绳环',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%B9%9D%E5%AD%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：制作洞穴探险锚点环',
          },
        ],
      },
    ],
  },
  {
    id: '亨特结',
    source: {
      name: '亨特结',
      url: 'https://knots3d.com/zh-CN/%E4%BA%A8%E7%89%B9%E7%BB%93',
      englishName: "Hunter's Bend",
      englishAliases: ["Rigger's Bend"],
      englishUrl: 'https://knots3d.com/en/hunters-bend-knot',
      englishSlug: 'hunters-bend-knot',
      aliases: ['猎人结', '索架结', '杭特接结'],
      abok: ['1425A'],
      activityIds: [],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E4%BA%A8%E7%89%B9%E7%BB%93.webp',
      relatedIds: ['齐柏林结', '阿什利结', '握手结', '阿尔卑斯中间衔接结', '接绳结', '反手结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%BA%A8%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条绳索',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%BA%A8%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：细绳是连接材料',
          },
        ],
      },
    ],
  },
  {
    id: '伏都结',
    source: {
      name: '伏都结',
      url: 'https://knots3d.com/zh-CN/%E4%BC%8F%E9%83%BD%E7%BB%93',
      englishName: 'Voodoo Hitch',
      englishAliases: ['Transport Hitch', 'Pure Magic', 'PM Hitch'],
      englishUrl: 'https://knots3d.com/en/voodoo-hitch-knot',
      englishSlug: 'voodoo-hitch-knot',
      aliases: ['巫毒结', '运输结', '伏都滑轮结'],
      abok: [],
      activityIds: ['fire-rescue'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E4%BC%8F%E9%83%BD%E7%BB%93.webp',
      relatedIds: [
        '车夫结',
        '快速车夫结',
        '波尔多滑轮结',
        '八字返穿结',
        '阿尔卑斯蝴蝶结-手法',
        '中间八字结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%BC%8F%E9%83%BD%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：给救援绳索施加张力',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%BC%8F%E9%83%BD%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：张紧天幕或遮蔽物绳索',
          },
        ],
      },
      {
        id: 'guyline',
        name: '营绳与地钉',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E4%BC%8F%E9%83%BD%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：明确收紧帐篷绳',
          },
        ],
      },
    ],
  },
  {
    id: '克拉拉结',
    source: {
      name: '克拉拉结',
      url: 'https://knots3d.com/zh-CN/%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
      englishName: 'Clara Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/clara-hitch-knot',
      englishSlug: 'clara-hitch-knot',
      aliases: ['克拉拉盘绕结'],
      abok: [],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93.webp',
      relatedIds: ['抓紧克拉拉结', '皇后克拉拉结', '大皇后克拉拉结', '冰柱结', '三套结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳与较粗绳索连接',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳是连接材料',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：粗绳是把手主体',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：圆杆是抓紧对象',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳结组合制成把手',
          },
        ],
      },
    ],
  },
  {
    id: '克氏抓结',
    source: {
      name: '克氏抓结',
      url: 'https://knots3d.com/zh-CN/%E5%85%8B%E6%B0%8F%E6%8A%93%E7%BB%93',
      englishName: 'Klemheist',
      englishAliases: ['Kleimheist', 'French Machard Knot'],
      englishUrl: 'https://knots3d.com/en/klemheist-knot',
      englishSlug: 'klemheist-knot',
      aliases: [],
      abok: ['1762'],
      activityIds: ['caving', 'climbing', 'arborist', 'fire-rescue'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%85%8B%E6%B0%8F%E6%8A%93%E7%BB%93.webp',
      relatedIds: ['普鲁士抓结', '布莱克氏结', '双渔人结', '冰柱结', '施瓦本结', '迪斯特尔结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%8B%E6%B0%8F%E6%8A%93%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：沿绳索攀升下降',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%8B%E6%B0%8F%E6%8A%93%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：细绳是连接材料',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%8B%E6%B0%8F%E6%8A%93%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：受力粗绳是被连接对象',
          },
        ],
      },
      {
        id: 'webbing',
        name: '扁带与织带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%8B%E6%B0%8F%E6%8A%93%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：明确用扁带吊环打摩擦结',
          },
        ],
      },
    ],
  },
  {
    id: '克雷圆环结',
    source: {
      name: '克雷圆环结',
      url: 'https://knots3d.com/zh-CN/%E5%85%8B%E9%9B%B7%E5%9C%86%E7%8E%AF%E7%BB%93',
      englishName: 'Kreh Loop',
      englishAliases: ['Non-Slip Mono Knot', "Lefty Kreh's Loop Knot", 'Non-Slip Loop'],
      englishUrl: 'https://knots3d.com/en/kreh-loop-knot',
      englishSlug: 'kreh-loop-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%85%8B%E9%9B%B7%E5%9C%86%E7%8E%AF%E7%BB%93.webp',
      relatedIds: ['拉帕拉结', '邓肯环-结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%8B%E9%9B%B7%E5%9C%86%E7%8E%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：鱼线是连接材料',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%8B%E9%9B%B7%E5%9C%86%E7%8E%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：毛钩或拟饵是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '兔耳结',
    source: {
      name: '兔耳结',
      url: 'https://knots3d.com/zh-CN/%E5%85%94%E8%80%B3%E7%BB%93',
      englishName: 'Double Bight Figure Eight',
      englishAliases: [
        'Bunny Ears',
        'Two Loop Figure Eight Knot',
        'Y-Hang',
        'Double Figure 8 Loop',
        'Double Flemish Loop',
        'Double Loop Figure Eight',
        'Canadian Eight',
        'Canadian Figure 8',
      ],
      englishUrl: 'https://knots3d.com/en/double-bight-figure-eight-knot',
      englishSlug: 'double-bight-figure-eight-knot',
      aliases: ['双股的八字结'],
      abok: ['1085'],
      activityIds: ['caving', 'climbing', 'fire-rescue'],
      typeId: 'multi-loop',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%85%94%E8%80%B3%E7%BB%93.webp',
      relatedIds: ['八字套结', '中间八字结', '双称人结-绳中', '西班牙称人结', '葡萄牙称人结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%94%E8%80%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：在绳索中间制作环',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%94%E8%80%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成两个独立绳环',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%94%E8%80%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：连接两个锚点',
          },
        ],
      },
    ],
  },
  {
    id: '八字套结',
    source: {
      name: '八字套结',
      url: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E5%A5%97%E7%BB%93',
      englishName: 'Figure Eight Loop',
      englishAliases: ['Flemish Loop', 'Figure Eight on the Bight', 'Blood Bight'],
      englishUrl: 'https://knots3d.com/en/figure-eight-loop-knot',
      englishSlug: 'figure-eight-loop-knot',
      aliases: ['八字结绳耳', '双八字结', '八字结绳圈'],
      abok: ['1047'],
      activityIds: [
        'essentials',
        'military',
        'caving',
        'climbing',
        'arborist',
        'fire-rescue',
        'diving',
      ],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%85%AB%E5%AD%97%E5%A5%97%E7%BB%93.webp',
      relatedIds: ['八字返穿结', '八字结', '兔耳结', '九字结', '中间八字结', '双重单结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳端制作固定环',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：脚手架是连接对象',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成固定绳环',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：铁锁是环的连接对象',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：制作绳索作业中段锚点',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：固定手柄环属于狗绳握持部',
          },
        ],
      },
      {
        id: 'pet-lead',
        name: '动物牵绳与缰绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：制成绳索狗绳',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：装备是绳环连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '八字结',
    source: {
      name: '八字结',
      url: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E7%BB%93',
      englishName: 'Figure Eight',
      englishAliases: ['Flemish Knot', 'Savoy Knot', 'Figure of Eight Knot'],
      englishUrl: 'https://knots3d.com/en/figure-eight-knot',
      englishSlug: 'figure-eight-knot',
      aliases: ['单八字结'],
      abok: ['570'],
      activityIds: [
        'essentials',
        'theater-film',
        'climbing',
        'arborist',
        'fire-rescue',
        'diving',
        'boating',
      ],
      typeId: 'stoppers',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%85%AB%E5%AD%97%E7%BB%93.webp',
      relatedIds: [
        '八字返穿结',
        '八字套结',
        '八字连接结',
        '扁八字连接结',
        '滑八字结',
        '兔耳结',
        '中间八字结',
        '反手结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：阻止绳索滑出',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：帆船用绳止端场景，未推断系船固定',
          },
        ],
      },
    ],
  },
  {
    id: '八字返穿结',
    source: {
      name: '八字返穿结',
      url: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E8%BF%94%E7%A9%BF%E7%BB%93',
      englishName: 'Figure Eight Follow Through',
      englishAliases: [
        'Figure Eight Retrace',
        'Rerouted Figure Eight Loop',
        'Threaded Figure Eight Loop',
      ],
      englishUrl: 'https://knots3d.com/en/figure-eight-follow-through-knot',
      englishSlug: 'figure-eight-follow-through-knot',
      aliases: ['穿式八字结', '翻穿双八字结'],
      abok: ['1047'],
      activityIds: ['military', 'caving', 'climbing', 'fire-rescue'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%85%AB%E5%AD%97%E8%BF%94%E7%A9%BF%E7%BB%93.webp',
      relatedIds: [
        '八字套结',
        '八字结',
        '八字连接结',
        '双称人结',
        '中间八字结',
        '双重单结',
        '阿尔卑斯蝴蝶结-回穿',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E8%BF%94%E7%A9%BF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：攀登绳系入安全带',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E8%BF%94%E7%A9%BF%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：柱或栏杆是环绕对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E8%BF%94%E7%A9%BF%E7%BB%93',
            field: 'common-uses',
            useIndex: 8,
            note: '逐条语义核对：下降绳锚固到树',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E8%BF%94%E7%A9%BF%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：形成固定绳环',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E8%BF%94%E7%A9%BF%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：环与树柱并列为外接物，未推定金属材质',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E8%BF%94%E7%A9%BF%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：秋千座是连接对象',
          },
        ],
      },
      {
        id: 'harness',
        name: '安全带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E8%BF%94%E7%A9%BF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：安全带是系入对象',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E8%BF%94%E7%A9%BF%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索穿过固定锚点',
          },
        ],
      },
    ],
  },
  {
    id: '八字连接结',
    source: {
      name: '八字连接结',
      url: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E8%BF%9E%E6%8E%A5%E7%BB%93',
      englishName: 'Figure Eight Bend',
      englishAliases: ['Flemish Bend', 'Rewoven Figure Eight'],
      englishUrl: 'https://knots3d.com/en/figure-eight-bend-knot',
      englishSlug: 'figure-eight-bend-knot',
      aliases: ['八字接结', '加固用的八字内结'],
      abok: ['1411'],
      activityIds: ['military', 'caving', 'climbing', 'fire-rescue'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%85%AB%E5%AD%97%E8%BF%9E%E6%8E%A5%E7%BB%93.webp',
      relatedIds: ['八字返穿结', '八字结', '扁八字连接结', '水结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%85%AB%E5%AD%97%E8%BF%9E%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条攀登绳',
          },
        ],
      },
    ],
  },
  {
    id: '内跨结',
    source: {
      name: '内跨结',
      url: 'https://knots3d.com/zh-CN/%E5%86%85%E8%B7%A8%E7%BB%93',
      englishName: 'Snell Knot',
      englishAliases: ['Snood Knot'],
      englishUrl: 'https://knots3d.com/en/snell-knot',
      englishSlug: 'snell-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%86%85%E8%B7%A8%E7%BB%93.webp',
      relatedIds: ['改进的扭抱结', '平尾结-方法一', '平尾结-方法二', '平尾结-方法三'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%86%85%E8%B7%A8%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：前导线是鱼钩连接材料',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%86%85%E8%B7%A8%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼钩是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '冰柱结',
    source: {
      name: '冰柱结',
      url: 'https://knots3d.com/zh-CN/%E5%86%B0%E6%9F%B1%E7%BB%93',
      englishName: 'Icicle Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/icicle-hitch-knot',
      englishSlug: 'icicle-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['climbing', 'boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%86%B0%E6%9F%B1%E7%BB%93.webp',
      relatedIds: ['普鲁士抓结', '桩结', '克氏抓结', '克拉拉结', '吊装结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%86%B0%E6%9F%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索系在光滑杆上',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%86%B0%E6%9F%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：光滑杆或棒是系附对象',
          },
        ],
      },
      {
        id: 'cleat',
        name: '系缆桩、船锚与锚链',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%86%B0%E6%9F%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：锚链是缓冲绳连接对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%86%B0%E6%9F%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：管道是悬挂重物的系附支撑',
          },
        ],
      },
      {
        id: 'cable',
        name: '电线与线缆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%86%B0%E6%9F%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：电线电缆是牵拉对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%86%B0%E6%9F%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：工具柄是绳索固定对象',
          },
        ],
      },
    ],
  },
  {
    id: '凯尔特结',
    source: {
      name: '凯尔特结',
      url: 'https://knots3d.com/zh-CN/%E5%87%AF%E5%B0%94%E7%89%B9%E7%BB%93',
      englishName: 'Celtic Knot',
      englishAliases: ['Celtic Mat', 'Celtic Plait', 'Icovellavna'],
      englishUrl: 'https://knots3d.com/en/celtic-knot',
      englishSlug: 'celtic-knot',
      aliases: [],
      abok: [],
      activityIds: ['decorative'],
      typeId: 'mats',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%87%AF%E5%B0%94%E7%89%B9%E7%BB%93.webp',
      relatedIds: ['双钱结', '三叶结', '土耳其头垫结-3l5b', '海洋垫结'],
    },
    objects: [
      {
        id: 'jewelry',
        name: '珠宝与首饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%87%AF%E5%B0%94%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：明确用于珠宝图案，未推定具体首饰',
          },
        ],
      },
      {
        id: 'mat',
        name: '绳垫、杯垫与装饰垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%87%AF%E5%B0%94%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：制成桌面或地面绳垫',
          },
        ],
      },
    ],
  },
  {
    id: '刺网套钩结',
    source: {
      name: '刺网套钩结',
      url: 'https://knots3d.com/zh-CN/%E5%88%BA%E7%BD%91%E5%A5%97%E9%92%A9%E7%BB%93',
      englishName: 'Ossel Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/ossel-hitch-knot',
      englishSlug: 'ossel-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%88%BA%E7%BD%91%E5%A5%97%E9%92%A9%E7%BB%93.webp',
      relatedIds: ['单环结', '天线袋口结', '相依套钩结', '双套结-绳端'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%88%BA%E7%BD%91%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳连接到较粗绳索',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%88%BA%E7%BD%91%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳为连接材料',
          },
        ],
      },
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%88%BA%E7%BD%91%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：主鱼线是分支线连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '剪立编结',
    source: {
      name: '剪立编结',
      url: 'https://knots3d.com/zh-CN/%E5%89%AA%E7%AB%8B%E7%BC%96%E7%BB%93',
      englishName: 'Shear Lashing',
      englishAliases: ['Sheer Lashing'],
      englishUrl: 'https://knots3d.com/en/shear-lashing-knot',
      englishSlug: 'shear-lashing-knot',
      aliases: ['展立结'],
      abok: ['2108'],
      activityIds: ['pioneering', 'scouting'],
      typeId: 'lashings',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%89%AA%E7%AB%8B%E7%BC%96%E7%BB%93.webp',
      relatedIds: ['双套结-绳端', '圆周编结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%89%AA%E7%AB%8B%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索参与搭建起重结构',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%89%AA%E7%AB%8B%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：两根杆形成A字架',
          },
        ],
      },
    ],
  },
  {
    id: '加拿大锁结',
    source: {
      name: '加拿大锁结',
      url: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
      englishName: 'Canadian Jam Knot',
      englishAliases: ['Jam Knot', 'Canadian Jam'],
      englishUrl: 'https://knots3d.com/en/canadian-jam-knot',
      englishSlug: 'canadian-jam-knot',
      aliases: [],
      abok: [],
      activityIds: ['camping'],
      typeId: 'binding',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93.webp',
      relatedIds: ['轱辘结', '林地扎带结', '包裹结', '反手结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索箍住包裹',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 8,
            note: '逐条语义核对：细绳为捆扎材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：木棍是捆绑对象',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：木材是捆扎对象',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：形成收紧绳环',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：防水布是压紧储存对象',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：包裹是捆扎对象',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：袋口是系紧对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：管道是捆扎对象',
          },
        ],
      },
      {
        id: 'bag',
        name: '包',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：背包是装备固定的载体',
          },
        ],
      },
      {
        id: 'bedding',
        name: '睡袋与铺盖垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：床垫卷与睡袋是捆扎对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8A%A0%E6%8B%BF%E5%A4%A7%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：装备用收紧绳环捆绑',
          },
        ],
      },
    ],
  },
  {
    id: '包裹结',
    source: {
      name: '包裹结',
      url: 'https://knots3d.com/zh-CN/%E5%8C%85%E8%A3%B9%E7%BB%93',
      englishName: "Packer's Knot",
      englishAliases: ["Butcher's knot", 'Parcel Knot', "Meat Packer's Knot"],
      englishUrl: 'https://knots3d.com/en/packers-knot',
      englishSlug: 'packers-knot',
      aliases: [],
      abok: ['187'],
      activityIds: [],
      typeId: 'binding',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8C%85%E8%A3%B9%E7%BB%93.webp',
      relatedIds: ['加拿大锁结', '八字结', '反手结', '半扣结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8C%85%E8%A3%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索是捆扎材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8C%85%E8%A3%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：木棒捆是捆扎对象',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8C%85%E8%A3%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：木材是捆扎对象',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8C%85%E8%A3%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：包裹是捆扎对象',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8C%85%E8%A3%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：袋子麻袋是封口对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8C%85%E8%A3%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：管道是捆扎对象',
          },
        ],
      },
      {
        id: 'bedding',
        name: '睡袋与铺盖垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8C%85%E8%A3%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：铺盖或毯子是打包对象',
          },
        ],
      },
    ],
  },
  {
    id: '十字编结',
    source: {
      name: '十字编结',
      url: 'https://knots3d.com/zh-CN/%E5%8D%81%E5%AD%97%E7%BC%96%E7%BB%93',
      englishName: 'Diagonal Lashing',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/diagonal-lashing-knot',
      englishSlug: 'diagonal-lashing-knot',
      aliases: ['十字结'],
      abok: ['2115'],
      activityIds: ['pioneering', 'scouting'],
      typeId: 'lashings',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8D%81%E5%AD%97%E7%BC%96%E7%BB%93.webp',
      relatedIds: ['双套结-绳端', '系木结', '四方编结'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%81%E5%AD%97%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：两根杆以角度绑扎',
          },
        ],
      },
    ],
  },
  {
    id: '半扣结',
    source: {
      name: '半扣结',
      url: 'https://knots3d.com/zh-CN/%E5%8D%8A%E6%89%A3%E7%BB%93',
      englishName: 'Half Hitch',
      englishAliases: ['Single Hitch'],
      englishUrl: 'https://knots3d.com/en/half-hitch-knot',
      englishSlug: 'half-hitch-knot',
      aliases: ['半结'],
      abok: ['50'],
      activityIds: [],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8D%8A%E6%89%A3%E7%BB%93.webp',
      relatedIds: ['反手结', '双半结', '单环结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%8A%E6%89%A3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索以半扣收尾固定',
          },
        ],
      },
      {
        id: 'cleat',
        name: '系缆桩、船锚与锚链',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%8A%E6%89%A3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：系索栓是固定对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%8A%E6%89%A3%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：软管是吊起对象',
          },
        ],
      },
      {
        id: 'cable',
        name: '电线与线缆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%8A%E6%89%A3%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：电线电缆是牵拉对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%8A%E6%89%A3%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：工具是吊起对象',
          },
        ],
      },
    ],
  },
  {
    id: '半温莎结',
    source: {
      name: '半温莎结',
      url: 'https://knots3d.com/zh-CN/%E5%8D%8A%E6%B8%A9%E8%8E%8E%E7%BB%93',
      englishName: 'Half Windsor',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/half-windsor-knot',
      englishSlug: 'half-windsor-knot',
      aliases: [],
      abok: [],
      activityIds: ['neckties'],
      typeId: 'special',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8D%8A%E6%B8%A9%E8%8E%8E%E7%BB%93.webp',
      relatedIds: ['温莎结'],
    },
    objects: [
      {
        id: 'tie',
        name: '领带、领巾与围巾',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%8A%E6%B8%A9%E8%8E%8E%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：明确系领带',
          },
        ],
      },
    ],
  },
  {
    id: '单向接绳结',
    source: {
      name: '单向接绳结',
      url: 'https://knots3d.com/zh-CN/%E5%8D%95%E5%90%91%E6%8E%A5%E7%BB%B3%E7%BB%93',
      englishName: 'Tucked Sheet Bend',
      englishAliases: ['One-Way Sheet Bend', 'Figure Eight Becket Bend', 'Figure Eight Sheet Bend'],
      englishUrl: 'https://knots3d.com/en/tucked-sheet-bend-knot',
      englishSlug: 'tucked-sheet-bend-knot',
      aliases: ['穿入接绳结', '单编缭绳结'],
      abok: ['1436'],
      activityIds: ['boating', 'camping'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8D%95%E5%90%91%E6%8E%A5%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['三向接绳结', '接绳结', '双接绳结', '三重接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%95%E5%90%91%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两根绳索',
          },
        ],
      },
    ],
  },
  {
    id: '单套衔接结',
    source: {
      name: '单套衔接结',
      url: 'https://knots3d.com/zh-CN/%E5%8D%95%E5%A5%97%E8%A1%94%E6%8E%A5%E7%BB%93',
      englishName: 'Bowline Bend',
      englishAliases: ['Two Bowlines', 'Interlocking Bowlines'],
      englishUrl: 'https://knots3d.com/en/bowline-bend-knot',
      englishSlug: 'bowline-bend-knot',
      aliases: ['称人结连接结'],
      abok: ['1455'],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8D%95%E5%A5%97%E8%A1%94%E6%8E%A5%E7%BB%93.webp',
      relatedIds: [
        '并蒂单套衔接结',
        '称人结',
        '接绳结',
        '大绳接结',
        '对称缆绳连接结-上',
        '对称缆绳连接结-下',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%95%E5%A5%97%E8%A1%94%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：接长绳索',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%95%E5%A5%97%E8%A1%94%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：船只是拖曳对象',
          },
        ],
      },
    ],
  },
  {
    id: '单环结',
    source: {
      name: '单环结',
      url: 'https://knots3d.com/zh-CN/%E5%8D%95%E7%8E%AF%E7%BB%93',
      englishName: 'Munter Hitch',
      englishAliases: [
        'Italian Hitch',
        'Crossing Hitch',
        'HMS',
        'Tag Knot',
        'MB',
        'Mezzo Barcaiolo',
      ],
      englishUrl: 'https://knots3d.com/en/munter-hitch-knot',
      englishSlug: 'munter-hitch-knot',
      aliases: ['意大利半结', '意大利半扣', 'HMS', '蒙特结'],
      abok: ['1818'],
      activityIds: ['military', 'caving', 'climbing', 'arborist', 'fire-rescue'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8D%95%E7%8E%AF%E7%BB%93.webp',
      relatedIds: ['超级单环结', '蒙特牵引结', '双套结-双环', '后手套结', '刺网套钩结', '双半结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%95%E7%8E%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：绳索系在铁锁上',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%95%E7%8E%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：铁锁提供摩擦表面',
          },
        ],
      },
    ],
  },
  {
    id: '卡尔梅克结',
    source: {
      name: '卡尔梅克结',
      url: 'https://knots3d.com/zh-CN/%E5%8D%A1%E5%B0%94%E6%A2%85%E5%85%8B%E7%BB%93',
      englishName: 'Kalmyk Loop',
      englishAliases: ['Slipped Inuit Bowline'],
      englishUrl: 'https://knots3d.com/en/kalmyk-loop-knot',
      englishSlug: 'kalmyk-loop-knot',
      aliases: ['卡尔梅克环'],
      abok: [],
      activityIds: ['camping'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8D%A1%E5%B0%94%E6%A2%85%E5%85%8B%E7%BB%93.webp',
      relatedIds: ['哥萨克结', '称人结', '接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%A1%E5%B0%94%E6%A2%85%E5%85%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳端形成可释放环',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%A1%E5%B0%94%E6%A2%85%E5%85%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：柱子是系住动物的固定对象',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%A1%E5%B0%94%E6%A2%85%E5%85%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：绳环可由绳尾释放',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%A1%E5%B0%94%E6%A2%85%E5%85%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：小船使用快拆系泊环',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%A1%E5%B0%94%E6%A2%85%E5%85%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：装备是临时环连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '卡里克垫结',
    source: {
      name: '卡里克垫结',
      url: 'https://knots3d.com/zh-CN/%E5%8D%A1%E9%87%8C%E5%85%8B%E5%9E%AB%E7%BB%93',
      englishName: 'Carrick Mat',
      englishAliases: ['Carrick Bend Mat', "Turk's Head Mat (3L4B)"],
      englishUrl: 'https://knots3d.com/en/carrick-mat-knot',
      englishSlug: 'carrick-mat-knot',
      aliases: ['卡里克垫片结', '土耳其头垫结（3L4B）', '三股四耳土耳其头结'],
      abok: ['2287'],
      activityIds: ['decorative'],
      typeId: 'mats',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8D%A1%E9%87%8C%E5%85%8B%E5%9E%AB%E7%BB%93.webp',
      relatedIds: [
        '大绳接结',
        '双钱结',
        '海洋垫结',
        '土耳其头垫结-5l4b',
        '土耳其头垫结-3l5b',
        '天线袋口结',
        '土耳其头垫结-6l4b',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%A1%E9%87%8C%E5%85%8B%E5%9E%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：轻型绳索是编制材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%A1%E9%87%8C%E5%85%8B%E5%9E%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳是编制材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%A1%E9%87%8C%E5%85%8B%E5%9E%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：栏杆是被保护对象',
          },
        ],
      },
      {
        id: 'tie',
        name: '领带、领巾与围巾',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%A1%E9%87%8C%E5%85%8B%E5%9E%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：制成领巾环',
          },
        ],
      },
      {
        id: 'tag',
        name: '徽章与标牌',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%A1%E9%87%8C%E5%85%8B%E5%9E%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：编成徽章',
          },
        ],
      },
      {
        id: 'mat',
        name: '绳垫、杯垫与装饰垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8D%A1%E9%87%8C%E5%85%8B%E5%9E%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：制成桌垫或隔热垫',
          },
        ],
      },
    ],
  },
  {
    id: '压绑结',
    source: {
      name: '压绑结',
      url: 'https://knots3d.com/zh-CN/%E5%8E%8B%E7%BB%91%E7%BB%93',
      englishName: 'Strangle Knot',
      englishAliases: ['Double Overhand Hitch', 'Double Overhand Knot', "Modified Miller's Knot"],
      englishUrl: 'https://knots3d.com/en/strangle-knot',
      englishSlug: 'strangle-knot',
      aliases: ['绞杀结', '袋口结'],
      abok: ['1239'],
      activityIds: ['rope-care', 'camping'],
      typeId: 'binding',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8E%8B%E7%BB%91%E7%BB%93.webp',
      relatedIds: [
        '天线袋口结',
        '收缩结',
        '米勒结',
        '双反手结',
        '双圈索结',
        '双渔人结',
        '完美绳端结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8E%8B%E7%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：固定绳索末端',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8E%8B%E7%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：圆木棒是捆扎对象',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8E%8B%E7%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：圆木棒明确是木质对象',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8E%8B%E7%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：麻袋口是系紧对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8E%8B%E7%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：软管或管子是封闭对象',
          },
        ],
      },
    ],
  },
  {
    id: '友谊结',
    source: {
      name: '友谊结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8B%E8%B0%8A%E7%BB%93',
      englishName: 'Friendship Knot',
      englishAliases: [
        'Japanese Crown Knot',
        'Square Knot',
        'Neckerchief Knot',
        'Scarf Knot',
        'Success Knot',
        "Rustler's Knot",
        'Buckaroo Knot',
        'Two Strand Crown Knot',
        'Chinese Cross Knot',
      ],
      englishUrl: 'https://knots3d.com/en/friendship-knot',
      englishSlug: 'friendship-knot',
      aliases: ['十字结'],
      abok: ['1032'],
      activityIds: ['scouting', 'decorative'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8B%E8%B0%8A%E7%BB%93.webp',
      relatedIds: ['领圈结', '钻石结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8B%E8%B0%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：细绳是手工材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8B%E8%B0%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：明确使用细绳',
          },
        ],
      },
      {
        id: 'tie',
        name: '领带、领巾与围巾',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8B%E8%B0%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：系好童军领巾',
          },
        ],
      },
      {
        id: 'bracelet',
        name: '手链与腕带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8B%E8%B0%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：螺旋图案用于手链',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8B%E8%B0%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：明确制作装饰挂绳结',
          },
        ],
      },
    ],
  },
  {
    id: '双半结',
    source: {
      name: '双半结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
      englishName: 'Two Half Hitches',
      englishAliases: ['Clove Hitch Over Itself'],
      englishUrl: 'https://knots3d.com/en/two-half-hitches-knot',
      englishSlug: 'two-half-hitches-knot',
      aliases: [],
      abok: ['1710'],
      activityIds: ['scouting', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E5%8D%8A%E7%BB%93.webp',
      relatedIds: ['营钉结', '双套结-绳端', '帆脚结', '环编双重半套钩结', '水中称人结', '锚结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索系到支撑物',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：杆与围栏柱是系附对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：树是系附对象',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：码头环是系船连接物，未假定材质',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：帐篷绳的固定用途',
          },
        ],
      },
      {
        id: 'guyline',
        name: '营绳与地钉',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：帐篷绳系到桩或锚',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：吊床或秋千是悬挂对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：船是固定对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：软管是吊运对象',
          },
        ],
      },
      {
        id: 'bag',
        name: '包',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：背包是装备固定载体',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：工具是吊运对象',
          },
        ],
      },
    ],
  },
  {
    id: '双反手环-结',
    source: {
      name: '双反手环',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8F%8D%E6%89%8B%E7%8E%AF-%E7%BB%93',
      englishName: "Surgeon's Loop",
      englishAliases: ['Double Loop', 'Double Overhand Loop'],
      englishUrl: 'https://knots3d.com/en/surgeons-loop-knot',
      englishSlug: 'surgeons-loop-knot',
      aliases: ['外科环'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E5%8F%8D%E6%89%8B%E7%8E%AF-%E7%BB%93.webp',
      relatedIds: ['双重单结', '外科结', '络头结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8F%8D%E6%89%8B%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索形成固定环',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8F%8D%E6%89%8B%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：细绳形成固定环',
          },
        ],
      },
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8F%8D%E6%89%8B%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：前导线末端制环',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8F%8D%E6%89%8B%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：鱼钩是环圈连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '双反手结',
    source: {
      name: '双反手结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8F%8D%E6%89%8B%E7%BB%93',
      englishName: 'Double Overhand Knot',
      englishAliases: ['Blood Knot'],
      englishUrl: 'https://knots3d.com/en/double-overhand-knot',
      englishSlug: 'double-overhand-knot',
      aliases: ['双单结'],
      abok: ['516'],
      activityIds: ['climbing', 'fire-rescue', 'boating'],
      typeId: 'stoppers',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E5%8F%8D%E6%89%8B%E7%BB%93.webp',
      relatedIds: ['反手结', '三重反手结', '多重反手结', '双渔人结', '双圈索结', '压绑结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8F%8D%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：防止绳索穿过孔',
          },
        ],
      },
      {
        id: 'shoelace',
        name: '鞋带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8F%8D%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：用于鞋带末端',
          },
        ],
      },
      {
        id: 'clothing',
        name: '服装',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8F%8D%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：用于连帽衫拉绳配件，未声称捆绑整件衣物',
          },
        ],
      },
    ],
  },
  {
    id: '双圈索结',
    source: {
      name: '双圈索结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%9C%88%E7%B4%A2%E7%BB%93',
      englishName: "Poacher's Knot",
      englishAliases: [
        'Double Overhand Sliding Loop',
        'Double Overhand Noose',
        'Strangle Snare',
        'Two-Turn Scaffold Knot',
        "Surveyor's Knot",
        'Barrel Knot',
        'DONK',
        'Evans Knot',
        'One Knot',
        'Tenkara One Knot',
      ],
      englishUrl: 'https://knots3d.com/en/poachers-knot',
      englishSlug: 'poachers-knot',
      aliases: ['主线双联结', '偷猎者结', '双反手滑套结', 'DON结'],
      abok: ['409'],
      activityIds: ['climbing', 'arborist', 'fishing'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E5%9C%88%E7%B4%A2%E7%BB%93.webp',
      relatedIds: ['绞架结', '𢃇缆结', '双反手结', '瓦尔多斯坦结', '施瓦本结', '迪斯特尔结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%9C%88%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索是连接材料',
          },
        ],
      },
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%9C%88%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：前导线连接毛钩或鱼线',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%9C%88%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：与铁锁并列的环为外接对象，未假定金属',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%9C%88%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：铁锁是连接对象',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%9C%88%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：毛钩是连接对象',
          },
        ],
      },
      {
        id: 'bedding',
        name: '睡袋与铺盖垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%9C%88%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：睡袋或充气垫是压缩对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%9C%88%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：卷起的装备是收紧对象',
          },
        ],
      },
    ],
  },
  {
    id: '双套滑结',
    source: {
      name: '双套滑结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E6%BB%91%E7%BB%93',
      englishName: 'Slipped Clove Hitch',
      englishAliases: ['Quick Release Clove Hitch', 'Slippery Hitch'],
      englishUrl: 'https://knots3d.com/en/slipped-clove-hitch-knot',
      englishSlug: 'slipped-clove-hitch-knot',
      aliases: ['快解双套结'],
      abok: [],
      activityIds: ['arborist', 'boating', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E5%A5%97%E6%BB%91%E7%BB%93.webp',
      relatedIds: ['双套结-绳端', '滑收缩结', '滑米勒结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E6%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索临时连接柱子',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E6%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱子是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '双套结-双环',
    source: {
      name: '双套结（双环）',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E5%8F%8C%E7%8E%AF',
      englishName: 'Clove Hitch (Two Loop)',
      englishAliases: ["Builder's Knot", 'Clove Hitch in the Bight'],
      englishUrl: 'https://knots3d.com/en/clove-hitch-two-loop-knot',
      englishSlug: 'clove-hitch-two-loop-knot',
      aliases: ['丁香结'],
      abok: ['1245'],
      activityIds: ['military', 'caving', 'climbing', 'fire-rescue'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E5%A5%97%E7%BB%93-%E5%8F%8C%E7%8E%AF.webp',
      relatedIds: ['双套结-绳端', '双套结-绳中', '双半结', '单环结', '收缩结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E5%8F%8C%E7%8E%AF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：将绳索扣到铁锁，否定仅指不使用绳端',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E5%8F%8C%E7%8E%AF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：铁锁是扣接对象',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E5%8F%8C%E7%8E%AF',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：在保护站连接锚点',
          },
        ],
      },
    ],
  },
  {
    id: '双套结-绳中',
    source: {
      name: '双套结（绳中）',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E4%B8%AD',
      englishName: 'Clove Hitch on a Bight',
      englishAliases: ["Builder's Knot", 'Clove Hitch in the Bight'],
      englishUrl: 'https://knots3d.com/en/clove-hitch-on-a-bight-knot',
      englishSlug: 'clove-hitch-on-a-bight-knot',
      aliases: ['丁香结'],
      abok: ['1245'],
      activityIds: ['pioneering', 'military', 'theater-film', 'scouting', 'boating', 'camping'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E4%B8%AD.webp',
      relatedIds: ['双套结-绳端', '双套结-双环', '双半结', '收缩结-绳中'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索连接柱子，否定仅指不需要绳端',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：系柱或围栏柱是套接对象',
          },
        ],
      },
    ],
  },
  {
    id: '双套结-绳端',
    source: {
      name: '双套结（绳端）',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF',
      englishName: 'Clove Hitch',
      englishAliases: ["Builder's Knot"],
      englishUrl: 'https://knots3d.com/en/clove-hitch-knot',
      englishSlug: 'clove-hitch-knot',
      aliases: ['酒瓶结', '斜卷结', '卷结', '丁香结'],
      abok: ['1245'],
      activityIds: [
        'essentials',
        'pioneering',
        'military',
        'theater-film',
        'caving',
        'climbing',
        'arborist',
        'fire-rescue',
        'scouting',
        'boating',
        'camping',
      ],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF.webp',
      relatedIds: [
        '双套滑结',
        '双套结-绳中',
        '双套结-双环',
        '收缩结',
        '天线袋口结',
        '秋千结',
        '帆杆结',
        '相依套钩结',
        '双半结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索系到支撑物',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱或杆是系附对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：树是系附对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：护舷是系挂对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：消防水带是吊运对象',
          },
        ],
      },
      {
        id: 'decorative-item',
        name: '装饰挂件与灯饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 9,
            note: '逐条语义核对：装饰物是悬挂对象',
          },
        ],
      },
      {
        id: 'stretcher',
        name: '担架与吊带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 8,
            note: '逐条语义核对：绳与杆用于搭建临时担架',
          },
        ],
      },
      {
        id: 'stage',
        name: '舞台布景与配重沙袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：舞台布景是支撑对象',
          },
        ],
      },
      {
        id: 'lighting',
        name: '灯具',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 9,
            note: '逐条语义核对：装饰灯是悬挂对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：梯级是绳索固定对象',
          },
        ],
      },
    ],
  },
  {
    id: '双戴维结',
    source: {
      name: '双戴维结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%88%B4%E7%BB%B4%E7%BB%93',
      englishName: 'Double Davy',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/double-davy-knot',
      englishSlug: 'double-davy-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E6%88%B4%E7%BB%B4%E7%BB%93.webp',
      relatedIds: ['戴维结', '特里林结', '拉帕拉结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%88%B4%E7%BB%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：前导线是连接材料',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%88%B4%E7%BB%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：毛钩是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '双接绳结',
    source: {
      name: '双接绳结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%8E%A5%E7%BB%B3%E7%BB%93',
      englishName: 'Double Sheet Bend',
      englishAliases: ['Double Becket Bend', 'Inside Double Sheet Bend'],
      englishUrl: 'https://knots3d.com/en/double-sheet-bend-knot',
      englishSlug: 'double-sheet-bend-knot',
      aliases: [],
      abok: ['1434'],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E6%8E%A5%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['接绳结', '桑索姆连接结', '三重接绳结', '捆扎结', '双龙连接结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条不同粗细绳索',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：细绳是连接一端',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：粗绳是连接一端',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：防水布或网的角环是系接物',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：防水布的角环是系绳用途',
          },
        ],
      },
    ],
  },
  {
    id: '双渔人结',
    source: {
      name: '双渔人结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%B8%94%E4%BA%BA%E7%BB%93',
      englishName: "Double Fisherman's Knot",
      englishAliases: [
        'Grapevine Knot',
        "Double Englishman's Knot",
        'Double English Knot',
        'Tilley Hat Knot',
        'Necklace Knot',
      ],
      englishUrl: 'https://knots3d.com/en/double-fishermans-knot',
      englishSlug: 'double-fishermans-knot',
      aliases: ['葡萄藤结'],
      abok: ['294'],
      activityIds: ['essentials', 'caving', 'climbing', 'arborist', 'fire-rescue', 'camping'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E6%B8%94%E4%BA%BA%E7%BB%93.webp',
      relatedIds: ['渔人结', '普鲁士抓结', '双反手结', '双圈索结', '三重渔人结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条攀登绳',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：细绳是闭合环材料',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：制成闭合绳环',
          },
        ],
      },
      {
        id: 'bracelet',
        name: '手链与腕带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：制作可调节手链',
          },
        ],
      },
      {
        id: 'necklace',
        name: '项链与吊坠',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：制作可调节项链',
          },
        ],
      },
      {
        id: 'clothing',
        name: '服装',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：用于泳衣或比基尼系带',
          },
        ],
      },
    ],
  },
  {
    id: '双称人结',
    source: {
      name: '双称人结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: 'Double Bowline',
      englishAliases: ['Round Turn Bowline', 'Double-Knotted Bowline'],
      englishUrl: 'https://knots3d.com/en/double-bowline-knot',
      englishSlug: 'double-bowline-knot',
      aliases: ['双布林结'],
      abok: ['1013'],
      activityIds: ['climbing'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: [
        '称人结',
        '双接绳结',
        '双称人结-绳中',
        '水中称人结',
        '双称人结-回穿',
        '八字套结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳端制成环',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳环系入安全带',
          },
        ],
      },
      {
        id: 'harness',
        name: '安全带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：安全带是系入对象',
          },
        ],
      },
    ],
  },
  {
    id: '双称人结-回穿',
    source: {
      name: '双称人结（回穿）',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%9B%9E%E7%A9%BF',
      englishName: 'Rethreaded Bowline',
      englishAliases: ['Retraced Bowline', 'Bowline Follow Through'],
      englishUrl: 'https://knots3d.com/en/rethreaded-bowline-knot',
      englishSlug: 'rethreaded-bowline-knot',
      aliases: [],
      abok: ['1080'],
      activityIds: ['climbing', 'fire-rescue'],
      typeId: 'multi-loop',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%9B%9E%E7%A9%BF.webp',
      relatedIds: [
        '称人结',
        '双称人结-绳中',
        '双称人结',
        '八字返穿结',
        '水中称人结',
        '约塞米蒂称人结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%9B%9E%E7%A9%BF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：攀登绳是系入材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%9B%9E%E7%A9%BF',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：柱是绕系对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%9B%9E%E7%A9%BF',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：树是绕系对象',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%9B%9E%E7%A9%BF',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：圆环是固定绳环连接的外部对象',
          },
        ],
      },
      {
        id: 'harness',
        name: '安全带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%9B%9E%E7%A9%BF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：安全带是系入对象',
          },
        ],
      },
    ],
  },
  {
    id: '双称人结-绳中',
    source: {
      name: '双称人结（绳中）',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E7%BB%B3%E4%B8%AD',
      englishName: 'Bowline on a Bight',
      englishAliases: ["Bosun's Chair", 'Y-Hang', 'Bowline upon the Bight', 'Two Loop Bowline'],
      englishUrl: 'https://knots3d.com/en/bowline-on-a-bight-knot',
      englishSlug: 'bowline-on-a-bight-knot',
      aliases: ['双环称人结'],
      abok: ['1080'],
      activityIds: ['caving', 'climbing', 'arborist', 'fire-rescue', 'boating'],
      typeId: 'multi-loop',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E7%BB%B3%E4%B8%AD.webp',
      relatedIds: ['称人结', '水中称人结', '双称人结', '兔耳结', '双称人结-回穿', '葡萄牙称人结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：在绳索中间制环',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成两个绳环',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：两个锚点是分载对象',
          },
        ],
      },
      {
        id: 'stretcher',
        name: '担架与吊带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E7%A7%B0%E4%BA%BA%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：制作紧急救援吊带',
          },
        ],
      },
    ],
  },
  {
    id: '双简西蒙结-上',
    source: {
      name: '双简西蒙结（上）',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8A',
      englishName: 'Double Simon (Over)',
      englishAliases: [
        'Double Simple Simon',
        'Double Crossed Simon Bend',
        'Double Simple Simon Over',
        'Double Simon Over Bend',
      ],
      englishUrl: 'https://knots3d.com/en/double-simon-over-knot',
      englishSlug: 'double-simon-over-knot',
      aliases: [],
      abok: [],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8A.webp',
      relatedIds: ['简西蒙结-下', '简西蒙结-上', '双简西蒙结-下', '对称简西蒙结', '双接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8A',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条绳索',
          },
        ],
      },
    ],
  },
  {
    id: '双简西蒙结-下',
    source: {
      name: '双简西蒙结（下）',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8B',
      englishName: 'Double Simon (Under)',
      englishAliases: [
        'Double Simple Simon',
        'Double Crossed Simon Bend',
        'Double Simple Simon Under',
        'Double Simon Under Bend',
      ],
      englishUrl: 'https://knots3d.com/en/double-simon-under-knot',
      englishSlug: 'double-simon-under-knot',
      aliases: [],
      abok: [],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8B.webp',
      relatedIds: ['简西蒙结-下', '简西蒙结-上', '双简西蒙结-上', '对称简西蒙结', '双接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8B',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条绳索',
          },
        ],
      },
    ],
  },
  {
    id: '双邓肯环-结',
    source: {
      name: '双邓肯环',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
      englishName: 'Uni-to-Uni Knot',
      englishAliases: ['Double Uni Knot', 'Double Grinner Knot'],
      englishUrl: 'https://knots3d.com/en/uni-to-uni-knot',
      englishSlug: 'uni-to-uni-knot',
      aliases: ['双万能结'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93.webp',
      relatedIds: ['邓肯环-结', '手足结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条鱼线',
          },
        ],
      },
    ],
  },
  {
    id: '双重单结',
    source: {
      name: '双重单结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E5%8D%95%E7%BB%93',
      englishName: 'Loop Knot',
      englishAliases: ['Overhand Loop', 'Double Overhand'],
      englishUrl: 'https://knots3d.com/en/loop-knot',
      englishSlug: 'loop-knot',
      aliases: ['反手结绳耳'],
      abok: ['1046'],
      activityIds: ['caving'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E9%87%8D%E5%8D%95%E7%BB%93.webp',
      relatedIds: ['反手结', '双反手环-结', '阿尔卑斯蝴蝶结', '反手连接结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E5%8D%95%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：在绳索末端或中间制环',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E5%8D%95%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：绳环用作拉链头或拉片',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E5%8D%95%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：登山扣是环的连接物',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E5%8D%95%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：钩子与夹子登山扣并列，非专指鱼钩',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E5%8D%95%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：制作拉链头',
          },
        ],
      },
    ],
  },
  {
    id: '双重收缩结',
    source: {
      name: '双重收缩结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E6%94%B6%E7%BC%A9%E7%BB%93',
      englishName: 'Double Constrictor',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/double-constrictor-knot',
      englishSlug: 'double-constrictor-knot',
      aliases: [],
      abok: ['1252'],
      activityIds: ['rope-care', 'camping'],
      typeId: 'binding',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E9%87%8D%E6%94%B6%E7%BC%A9%E7%BB%93.webp',
      relatedIds: ['收缩结', '双套结-绳端', '帆杆结', '收缩结-绳中'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：光滑或打蜡绳索是捆绑对象',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：杆是捆绑对象',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：木材是捆扎对象',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：袋口是封闭对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：橡胶管是夹紧对象',
          },
        ],
      },
      {
        id: 'cable',
        name: '电线与线缆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%87%8D%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：电缆或电线是捆扎对象',
          },
        ],
      },
    ],
  },
  {
    id: '双钱结',
    source: {
      name: '双钱结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%92%B1%E7%BB%93',
      englishName: 'Double Coin Knot',
      englishAliases: ['Josephine Knot', 'Wake Knot', 'Pretzel Knot'],
      englishUrl: 'https://knots3d.com/en/double-coin-knot',
      englishSlug: 'double-coin-knot',
      aliases: [],
      abok: ['1428'],
      activityIds: ['decorative'],
      typeId: 'special',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E9%92%B1%E7%BB%93.webp',
      relatedIds: ['大绳接结', '凯尔特结', '卡里克垫结'],
    },
    objects: [
      {
        id: 'jewelry',
        name: '珠宝与首饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%92%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：珠宝是装饰性平结用途，未推定具体首饰',
          },
        ],
      },
      {
        id: 'clothing',
        name: '服装',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%92%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：服装是点缀对象',
          },
        ],
      },
      {
        id: 'bag',
        name: '包',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%92%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：包是点缀对象，属于名词并列',
          },
        ],
      },
    ],
  },
  {
    id: '双马具连接结',
    source: {
      name: '双马具连接结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%A9%AC%E5%85%B7%E8%BF%9E%E6%8E%A5%E7%BB%93',
      englishName: 'Double Harness Bend',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/double-harness-bend-knot',
      englishSlug: 'double-harness-bend-knot',
      aliases: [],
      abok: ['1421'],
      activityIds: ['camping'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E9%A9%AC%E5%85%B7%E8%BF%9E%E6%8E%A5%E7%BB%93.webp',
      relatedIds: ['里弗结', '反复结', '接绳结', '阿尔卑斯中间衔接结', '手足结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%8F%8C%E9%A9%AC%E5%85%B7%E8%BF%9E%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条绳索',
          },
        ],
      },
    ],
  },
  {
    id: '双龙结',
    source: {
      name: '双龙结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%BE%99%E7%BB%93',
      englishName: 'Double Dragon',
      englishAliases: ['Double Dragon Loop'],
      englishUrl: 'https://knots3d.com/en/double-dragon-knot',
      englishSlug: 'double-dragon-knot',
      aliases: [],
      abok: [],
      activityIds: ['boating', 'camping'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E9%BE%99%E7%BB%93.webp',
      relatedIds: ['双龙连接结', '络头结', '称人结', '双称人结', '汉森圈结', '齐柏林环-结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%BE%99%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：在绳端制环',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%BE%99%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成固定绳环',
          },
        ],
      },
    ],
  },
  {
    id: '双龙连接结',
    source: {
      name: '双龙连接结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%BE%99%E8%BF%9E%E6%8E%A5%E7%BB%93',
      englishName: 'Double Dragon Bend',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/double-dragon-bend-knot',
      englishSlug: 'double-dragon-bend-knot',
      aliases: ['双龙结'],
      abok: [],
      activityIds: ['camping'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8C%E9%BE%99%E8%BF%9E%E6%8E%A5%E7%BB%93.webp',
      relatedIds: ['双龙结', '双接绳结', '单向接绳结', '接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8C%E9%BE%99%E8%BF%9E%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条绳索',
          },
        ],
      },
    ],
  },
  {
    id: '反复结',
    source: {
      name: '反复结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8D%E5%A4%8D%E7%BB%93',
      englishName: 'Vice Versa',
      englishAliases: ['Vice Versa Bend'],
      englishUrl: 'https://knots3d.com/en/vice-versa-knot',
      englishSlug: 'vice-versa-knot',
      aliases: [],
      abok: [],
      activityIds: [],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8D%E5%A4%8D%E7%BB%93.webp',
      relatedIds: ['里弗结', '简西蒙结-下', '简西蒙结-上', '双马具连接结', '接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8D%E5%A4%8D%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接合成绳索',
          },
        ],
      },
    ],
  },
  {
    id: '反手结',
    source: {
      name: '反手结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8D%E6%89%8B%E7%BB%93',
      englishName: 'Overhand Knot',
      englishAliases: ['Thumb Knot', 'Stafford Knot'],
      englishUrl: 'https://knots3d.com/en/overhand-knot',
      englishSlug: 'overhand-knot',
      aliases: ['单结', '拇指结', '半结'],
      abok: ['4'],
      activityIds: ['military', 'fire-rescue'],
      typeId: 'stoppers',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8D%E6%89%8B%E7%BB%93.webp',
      relatedIds: [
        '双反手结',
        '三重反手结',
        '多重反手结',
        '半扣结',
        '水结',
        '双重单结',
        '渔人结',
        '三叶结',
        '反手连接结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8D%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：处理绳端防散开',
          },
        ],
      },
    ],
  },
  {
    id: '反手连接结',
    source: {
      name: '反手连接结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8D%E6%89%8B%E8%BF%9E%E6%8E%A5%E7%BB%93',
      englishName: 'Flat Overhand Bend',
      englishAliases: [
        'EDK',
        'Euro Death Knot',
        'Offset Water Knot',
        'One-Sided Overhand Bend',
        'Thumb Bend',
        'Thumb Knot',
        'Openhand Knot',
        "Creeler's Knot",
        'European Death Knot',
      ],
      englishUrl: 'https://knots3d.com/en/flat-overhand-bend-knot',
      englishSlug: 'flat-overhand-bend-knot',
      aliases: ['普通绳头结', 'EDK'],
      abok: ['1410'],
      activityIds: ['climbing'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%8D%E6%89%8B%E8%BF%9E%E6%8E%A5%E7%BB%93.webp',
      relatedIds: ['反手结', '水结', '扁八字连接结', '接绳结', '八字连接结', '双重单结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8D%E6%89%8B%E8%BF%9E%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条下降绳',
          },
        ],
      },
    ],
  },
  {
    id: '反穿结',
    source: {
      name: '反穿结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%8D%E7%A9%BF%E7%BB%93',
      englishName: 'Back Splice',
      englishAliases: ['End Splice'],
      englishUrl: 'https://knots3d.com/en/back-splice-knot',
      englishSlug: 'back-splice-knot',
      aliases: ['倒织结', '绳端织结'],
      abok: [],
      activityIds: ['pioneering', 'scouting'],
      typeId: 'splices',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%8F%8D%E7%A9%BF%E7%BB%93.webp',
      relatedIds: ['皇冠结', '惯用绳端结', '西部绳端结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%8D%E7%A9%BF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：处理绳索末端',
          },
        ],
      },
    ],
  },
  {
    id: '可调节绳结',
    source: {
      name: '可调节绳结',
      url: 'https://knots3d.com/zh-CN/%E5%8F%AF%E8%B0%83%E8%8A%82%E7%BB%B3%E7%BB%93',
      englishName: 'Adjustable Grip Hitch',
      englishAliases: ['Adjustable Loop', 'Cawley Adjustable Hitch'],
      englishUrl: 'https://knots3d.com/en/adjustable-grip-hitch-knot',
      englishSlug: 'adjustable-grip-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['essentials', 'camping'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%8F%AF%E8%B0%83%E8%8A%82%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['营钉结', '塔巴克结', '舵副结'],
    },
    objects: [
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%AF%E8%B0%83%E8%8A%82%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成可调绳环',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%AF%E8%B0%83%E8%8A%82%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：调节帐篷或防水布拉绳',
          },
        ],
      },
      {
        id: 'guyline',
        name: '营绳与地钉',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%AF%E8%B0%83%E8%8A%82%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：防水布风绳系到地钉',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%8F%AF%E8%B0%83%E8%8A%82%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：张紧吊床脊绳',
          },
        ],
      },
    ],
  },
  {
    id: '吊床结',
    source: {
      name: '吊床结',
      url: 'https://knots3d.com/zh-CN/%E5%90%8A%E5%BA%8A%E7%BB%93',
      englishName: 'Becket Hitch (Slipped)',
      englishAliases: ['Hammock Knot', 'Quick Release Becket Hitch', 'Becket Hitch'],
      englishUrl: 'https://knots3d.com/en/becket-hitch-slipped-knot',
      englishSlug: 'becket-hitch-slipped-knot',
      aliases: [],
      abok: ['298'],
      activityIds: ['camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%90%8A%E5%BA%8A%E7%BB%93.webp',
      relatedIds: ['贝克特结', '接绳结', '滑接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8A%E5%BA%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索连接到环',
          },
        ],
      },
      {
        id: 'webbing',
        name: '扁带与织带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8A%E5%BA%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：织带是吊床悬挂材料',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8A%E5%BA%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：两棵树是悬挂支撑',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8A%E5%BA%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳环是吊床悬挂材料',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8A%E5%BA%8A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：吊床是悬挂对象',
          },
        ],
      },
    ],
  },
  {
    id: '吊桶结',
    source: {
      name: '吊桶结',
      url: 'https://knots3d.com/zh-CN/%E5%90%8A%E6%A1%B6%E7%BB%93',
      englishName: 'Barrel Hitch',
      englishAliases: ['Barrel Sling'],
      englishUrl: 'https://knots3d.com/en/barrel-hitch-knot',
      englishSlug: 'barrel-hitch-knot',
      aliases: ['桶结'],
      abok: ['2176'],
      activityIds: ['scouting'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%90%8A%E6%A1%B6%E7%BB%93.webp',
      relatedIds: ['反手结', '牛索结', '称人结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8A%E6%A1%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是吊装材料',
          },
        ],
      },
      {
        id: 'bottle',
        name: '瓶、罐与桶',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8A%E6%A1%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：木桶铁桶是吊装对象',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8A%E6%A1%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：制成搬运水罐水瓶的绳索手柄',
          },
        ],
      },
    ],
  },
  {
    id: '吊装结',
    source: {
      name: '吊装结',
      url: 'https://knots3d.com/zh-CN/%E5%90%8A%E8%A3%85%E7%BB%93',
      englishName: 'Lifting Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/lifting-hitch-knot',
      englishSlug: 'lifting-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['pioneering', 'boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%90%8A%E8%A3%85%E7%BB%93.webp',
      relatedIds: ['系木结', '石锚结', '冰柱结', '无张力结'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8A%E8%A3%85%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：柱子是拔起对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8A%E8%A3%85%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：管子是竖直吊起对象',
          },
        ],
      },
    ],
  },
  {
    id: '同心结',
    source: {
      name: '同心结',
      url: 'https://knots3d.com/zh-CN/%E5%90%8C%E5%BF%83%E7%BB%93',
      englishName: "True Lover's Knot",
      englishAliases: ['True Love Knot', 'Two Cord Lanyard Knot'],
      englishUrl: 'https://knots3d.com/en/true-lovers-knot',
      englishSlug: 'true-lovers-knot',
      aliases: [],
      abok: ['2418'],
      activityIds: [],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%90%8C%E5%BF%83%E7%BB%93.webp',
      relatedIds: ['反手结', '万字结', '渔人结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8C%E5%BF%83%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索是礼品饰物制作材料',
          },
        ],
      },
      {
        id: 'necklace',
        name: '项链与吊坠',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8C%E5%BF%83%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：项链绳承载戒指',
          },
        ],
      },
      {
        id: 'jewelry',
        name: '珠宝与首饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8C%E5%BF%83%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：明确珠宝用途，未推定具体首饰',
          },
        ],
      },
    ],
  },
  {
    id: '后手套结',
    source: {
      name: '后手套结',
      url: 'https://knots3d.com/zh-CN/%E5%90%8E%E6%89%8B%E5%A5%97%E7%BB%93',
      englishName: 'Backhand Hitch',
      englishAliases: ['High Tie', 'High Safety Knot'],
      englishUrl: 'https://knots3d.com/en/backhand-hitch-knot',
      englishSlug: 'backhand-hitch-knot',
      aliases: ['高位套结'],
      abok: ['1852'],
      activityIds: ['theater-film', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%90%8E%E6%89%8B%E5%A5%97%E7%BB%93.webp',
      relatedIds: ['单环结', '双半结', '环编双重半套钩结', '驳船结', '秋千结', '刺网套钩结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8E%E6%89%8B%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索连接到支撑物',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8E%E6%89%8B%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：杆是系附对象',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8E%E6%89%8B%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：圆木是临时连接对象',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%90%8E%E6%89%8B%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：货物是运输固定对象',
          },
        ],
      },
    ],
  },
  {
    id: '哥萨克结',
    source: {
      name: '哥萨克结',
      url: 'https://knots3d.com/zh-CN/%E5%93%A5%E8%90%A8%E5%85%8B%E7%BB%93',
      englishName: 'Inuit Bowline',
      englishAliases: [
        'Sitka Loop',
        'Cossack Knot',
        'Anti-Bowline',
        'Boas Bowline',
        'Eskimo Bowline',
      ],
      englishUrl: 'https://knots3d.com/en/inuit-bowline-knot',
      englishSlug: 'inuit-bowline-knot',
      aliases: ['爱斯基摩称人结'],
      abok: [],
      activityIds: ['camping'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%93%A5%E8%90%A8%E5%85%8B%E7%BB%93.webp',
      relatedIds: ['卡尔梅克结', '称人结', '接绳结'],
    },
    objects: [
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%93%A5%E8%90%A8%E5%85%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：在合成绳上形成固定绳环',
          },
        ],
      },
    ],
  },
  {
    id: '四方编结',
    source: {
      name: '四方编结',
      url: 'https://knots3d.com/zh-CN/%E5%9B%9B%E6%96%B9%E7%BC%96%E7%BB%93',
      englishName: 'Square Lashing',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/square-lashing-knot',
      englishSlug: 'square-lashing-knot',
      aliases: ['方回结'],
      abok: ['2114'],
      activityIds: ['pioneering', 'scouting'],
      typeId: 'lashings',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%9B%9B%E6%96%B9%E7%BC%96%E7%BB%93.webp',
      relatedIds: ['日本四方编结', '十字编结', '横梁结', '双套结-绳端'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%9B%9B%E6%96%B9%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：两根杆直角绑定',
          },
        ],
      },
      {
        id: 'stretcher',
        name: '担架与吊带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%9B%9B%E6%96%B9%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：用杆绳搭建临时担架',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%9B%9B%E6%96%B9%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：梯子是杆件绑扎的制成物',
          },
        ],
      },
    ],
  },
  {
    id: '圆周编结',
    source: {
      name: '圆周编结',
      url: 'https://knots3d.com/zh-CN/%E5%9C%86%E5%91%A8%E7%BC%96%E7%BB%93',
      englishName: 'Round Lashing',
      englishAliases: ['Vertical Lashing'],
      englishUrl: 'https://knots3d.com/en/round-lashing-knot',
      englishSlug: 'round-lashing-knot',
      aliases: [],
      abok: ['2103'],
      activityIds: ['pioneering', 'scouting'],
      typeId: 'lashings',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%9C%86%E5%91%A8%E7%BC%96%E7%BB%93.webp',
      relatedIds: ['双套结-绳端', '剪立编结', '西南部拉绳结'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%9C%86%E5%91%A8%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：两根杆首尾连接',
          },
        ],
      },
    ],
  },
  {
    id: '土耳其头垫结-3l5b',
    source: {
      name: '土耳其头垫结（3L5B）',
      url: 'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-3l5b',
      englishName: "Turk's Head Mat (3L5B)",
      englishAliases: [
        "Turk's Head 3 Lead 5 Bight",
        'THK',
        "Turk's Head in the Flat",
        "Sailor's Knot",
      ],
      englishUrl: 'https://knots3d.com/en/turks-head-mat-3l5b-knot',
      englishSlug: 'turks-head-mat-3l5b-knot',
      aliases: ['三股五耳土耳其头结', '土耳其头结'],
      abok: ['1306'],
      activityIds: ['decorative'],
      typeId: 'mats',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-3l5b.webp',
      relatedIds: [
        '凯尔特结',
        '领圈结',
        '辫子结',
        '三叶结',
        '卡里克垫结',
        '海洋垫结',
        '土耳其头垫结-5l4b',
        '土耳其头垫结-6l4b',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-3l5b',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索是垫子制作材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-3l5b',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：细绳是垫子制作材料',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-3l5b',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：船只是航海装饰的使用载体',
          },
        ],
      },
      {
        id: 'mat',
        name: '绳垫、杯垫与装饰垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-3l5b',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：制成扁平装饰垫',
          },
        ],
      },
      {
        id: 'curtain',
        name: '窗帘与挂毯',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-3l5b',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：窗帘绑带是装饰对象',
          },
        ],
      },
    ],
  },
  {
    id: '土耳其头垫结-5l4b',
    source: {
      name: '土耳其头垫结（5L4B）',
      url: 'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-5l4b',
      englishName: "Turk's Head Mat (5L4B)",
      englishAliases: ["Turk's Head 5 Lead 4 Bight", "Turk's Head in the Flat", 'THK'],
      englishUrl: 'https://knots3d.com/en/turks-head-mat-5l4b-knot',
      englishSlug: 'turks-head-mat-5l4b-knot',
      aliases: ['五股四耳土耳其头结', '平面土耳其头结', '土耳其头结'],
      abok: [],
      activityIds: ['decorative'],
      typeId: 'mats',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-5l4b.webp',
      relatedIds: ['土耳其头垫结-3l5b', '领圈结', '卡里克垫结', '海洋垫结', '土耳其头垫结-6l4b'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-5l4b',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索搁靠处是被保护表面',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-5l4b',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：圆杆搁靠处是被保护表面',
          },
        ],
      },
      {
        id: 'mat',
        name: '绳垫、杯垫与装饰垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-5l4b',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：制成圆形装饰垫',
          },
        ],
      },
    ],
  },
  {
    id: '土耳其头垫结-6l4b',
    source: {
      name: '土耳其头垫结（6L4B）',
      url: 'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-6l4b',
      englishName: "Turk's Head Mat (6L4B)",
      englishAliases: [
        "Turk's Head 6 Lead 4 Bight",
        "Two-Strand Turk's Head Mat",
        "Turk's Head in the Flat",
        'THK',
      ],
      englishUrl: 'https://knots3d.com/en/turks-head-mat-6l4b-knot',
      englishSlug: 'turks-head-mat-6l4b-knot',
      aliases: ['六股四耳土耳其头结', '双绳土耳其头垫结', '平面土耳其头结', '土耳其头结'],
      abok: [],
      activityIds: ['decorative'],
      typeId: 'mats',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-6l4b.webp',
      relatedIds: ['土耳其头垫结-5l4b', '土耳其头垫结-3l5b', '卡里克垫结', '领圈结', '海洋垫结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-6l4b',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：两根绳索是双色垫制作材料',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-6l4b',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：制成保护小船船舷的护舷',
          },
        ],
      },
      {
        id: 'mat',
        name: '绳垫、杯垫与装饰垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%9F%E8%80%B3%E5%85%B6%E5%A4%B4%E5%9E%AB%E7%BB%93-6l4b',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：制成圆形装饰垫',
          },
        ],
      },
    ],
  },
  {
    id: '圣地亚哥锁结',
    source: {
      name: '圣地亚哥锁结',
      url: 'https://knots3d.com/zh-CN/%E5%9C%A3%E5%9C%B0%E4%BA%9A%E5%93%A5%E9%94%81%E7%BB%93',
      englishName: 'San Diego Jam',
      englishAliases: ['Heiliger Knot', 'Reverse Clinch Knot'],
      englishUrl: 'https://knots3d.com/en/san-diego-jam-knot',
      englishSlug: 'san-diego-jam-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%9C%A3%E5%9C%B0%E4%BA%9A%E5%93%A5%E9%94%81%E7%BB%93.webp',
      relatedIds: ['皮岑结', '拉帕拉结', '改进的扭抱结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%A3%E5%9C%B0%E4%BA%9A%E5%93%A5%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线是连接材料',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%A3%E5%9C%B0%E4%BA%9A%E5%93%A5%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼钩是连接对象',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%A3%E5%9C%B0%E4%BA%9A%E5%93%A5%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：拟饵是连接对象',
          },
        ],
      },
      {
        id: 'swivel',
        name: '转环',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9C%A3%E5%9C%B0%E4%BA%9A%E5%93%A5%E9%94%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：转环是固定到鱼线的对象',
          },
        ],
      },
    ],
  },
  {
    id: '埃斯塔止索结',
    source: {
      name: '埃斯塔止索结',
      url: 'https://knots3d.com/zh-CN/%E5%9F%83%E6%96%AF%E5%A1%94%E6%AD%A2%E7%B4%A2%E7%BB%93',
      englishName: 'Estar Stopper Knot',
      englishAliases: ['E-Star Stopper'],
      englishUrl: 'https://knots3d.com/en/estar-stopper-knot',
      englishSlug: 'estar-stopper-knot',
      aliases: [],
      abok: [],
      activityIds: ['climbing', 'boating', 'camping'],
      typeId: 'stoppers',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%9F%83%E6%96%AF%E5%A1%94%E6%AD%A2%E7%B4%A2%E7%BB%93.webp',
      relatedIds: ['阿什利止索结', '帆脚结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%9F%83%E6%96%AF%E5%A1%94%E6%AD%A2%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：阻止绳索穿过孔槽',
          },
        ],
      },
    ],
  },
  {
    id: '塔巴克结',
    source: {
      name: '塔巴克结',
      url: 'https://knots3d.com/zh-CN/%E5%A1%94%E5%B7%B4%E5%85%8B%E7%BB%93',
      englishName: 'Tarbuck Knot',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/tarbuck-knot',
      englishSlug: 'tarbuck-knot',
      aliases: [],
      abok: [],
      activityIds: ['camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%A1%94%E5%B7%B4%E5%85%8B%E7%BB%93.webp',
      relatedIds: ['双半结', '营钉结', '可调节绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A1%94%E5%B7%B4%E5%85%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：绳索是调张力对象',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A1%94%E5%B7%B4%E5%85%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：调节帐篷绳或天幕脊绳',
          },
        ],
      },
      {
        id: 'guyline',
        name: '营绳与地钉',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A1%94%E5%B7%B4%E5%85%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：帐篷绳天幕脊绳是张紧对象',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A1%94%E5%B7%B4%E5%85%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：吊床悬挂绳是调节对象',
          },
        ],
      },
    ],
  },
  {
    id: '外科结',
    source: {
      name: '外科结',
      url: 'https://knots3d.com/zh-CN/%E5%A4%96%E7%A7%91%E7%BB%93',
      englishName: "Surgeon's Knot",
      englishAliases: ['Ligature Knot'],
      englishUrl: 'https://knots3d.com/en/surgeons-knot',
      englishSlug: 'surgeons-knot',
      aliases: [],
      abok: ['461'],
      activityIds: [],
      typeId: 'binding',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%A4%96%E7%A7%91%E7%BB%93.webp',
      relatedIds: ['平结', '双反手环-结', '外科结-钓鱼'],
    },
    objects: [
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A4%96%E7%A7%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：包裹或包装是捆扎对象',
          },
        ],
      },
    ],
  },
  {
    id: '外科结-钓鱼',
    source: {
      name: '外科结（钓鱼）',
      url: 'https://knots3d.com/zh-CN/%E5%A4%96%E7%A7%91%E7%BB%93-%E9%92%93%E9%B1%BC',
      englishName: "Surgeon's Knot (Fishing)",
      englishAliases: ['Double Overhand Bend', "Double Surgeon's Knot"],
      englishUrl: 'https://knots3d.com/en/surgeons-knot-fishing',
      englishSlug: 'surgeons-knot-fishing',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%A4%96%E7%A7%91%E7%BB%93-%E9%92%93%E9%B1%BC.webp',
      relatedIds: ['外科结', '双反手环-结', '反手连接结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A4%96%E7%A7%91%E7%BB%93-%E9%92%93%E9%B1%BC',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两段前导线',
          },
        ],
      },
    ],
  },
  {
    id: '多重反手结',
    source: {
      name: '多重反手结',
      url: 'https://knots3d.com/zh-CN/%E5%A4%9A%E9%87%8D%E5%8F%8D%E6%89%8B%E7%BB%93',
      englishName: 'Multiple Overhand Knot',
      englishAliases: [
        'Heaving Line Knot',
        'Multi-fold Overhand Knot',
        'French Knot',
        'Quipu',
        'Khipu',
      ],
      englishUrl: 'https://knots3d.com/en/multiple-overhand-knot',
      englishSlug: 'multiple-overhand-knot',
      aliases: ['桶结', '血结'],
      abok: [],
      activityIds: ['boating', 'decorative'],
      typeId: 'stoppers',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%A4%9A%E9%87%8D%E5%8F%8D%E6%89%8B%E7%BB%93.webp',
      relatedIds: ['反手结', '双反手结', '三重反手结', '乌利结', '抛绳结', '猴拳结', '完美绳端结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A4%9A%E9%87%8D%E5%8F%8D%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索上增加装饰凸起',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A4%9A%E9%87%8D%E5%8F%8D%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：挂绳上增加装饰凸起',
          },
        ],
      },
    ],
  },
  {
    id: '大皇后克拉拉结',
    source: {
      name: '大皇后克拉拉结',
      url: 'https://knots3d.com/zh-CN/%E5%A4%A7%E7%9A%87%E5%90%8E%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
      englishName: 'Great Queen Clara Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/great-queen-clara-hitch-knot',
      englishSlug: 'great-queen-clara-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%A4%A7%E7%9A%87%E5%90%8E%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93.webp',
      relatedIds: ['克拉拉结', '抓紧克拉拉结', '皇后克拉拉结', '冰柱结', '三套结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%A4%A7%E7%9A%87%E5%90%8E%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：粗大绳索或缆绳是纵向受力对象',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%A4%A7%E7%9A%87%E5%90%8E%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：光滑圆杆是拖拉对象',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%A4%A7%E7%9A%87%E5%90%8E%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：明确包括上漆木材圆杆',
          },
        ],
      },
    ],
  },
  {
    id: '大绳接结',
    source: {
      name: '大绳接结',
      url: 'https://knots3d.com/zh-CN/%E5%A4%A7%E7%BB%B3%E6%8E%A5%E7%BB%93',
      englishName: 'Carrick Bend',
      englishAliases: ['Pretzel Knot'],
      englishUrl: 'https://knots3d.com/en/carrick-bend-knot',
      englishSlug: 'carrick-bend-knot',
      aliases: ['单花联结', '卡里克结'],
      abok: ['1439'],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%A4%A7%E7%BB%B3%E6%8E%A5%E7%BB%93.webp',
      relatedIds: [
        '双钱结',
        '接绳结',
        '钻石结',
        '对称缆绳连接结-上',
        '对称缆绳连接结-下',
        '卡里克垫结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A4%A7%E7%BB%B3%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条粗绳索或缆绳',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A4%A7%E7%BB%B3%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：明确超粗绳索',
          },
        ],
      },
      {
        id: 'mat',
        name: '绳垫、杯垫与装饰垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A4%A7%E7%BB%B3%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：装饰结用于垫子',
          },
        ],
      },
    ],
  },
  {
    id: '天线袋口滑结',
    source: {
      name: '天线袋口滑结',
      url: 'https://knots3d.com/zh-CN/%E5%A4%A9%E7%BA%BF%E8%A2%8B%E5%8F%A3%E6%BB%91%E7%BB%93',
      englishName: 'Slipped Ground-line Hitch',
      englishAliases: [
        'Slipped Spar Hitch',
        'Fender Knot',
        "Miller's Knot",
        'Sack Knot',
        'Bag Knot',
      ],
      englishUrl: 'https://knots3d.com/en/slipped-ground-line-hitch-knot',
      englishSlug: 'slipped-ground-line-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: [],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%A4%A9%E7%BA%BF%E8%A2%8B%E5%8F%A3%E6%BB%91%E7%BB%93.webp',
      relatedIds: ['天线袋口结', '双套滑结', '滑收缩结', '滑米勒结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%A4%A9%E7%BA%BF%E8%A2%8B%E5%8F%A3%E6%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是连接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%A4%A9%E7%BA%BF%E8%A2%8B%E5%8F%A3%E6%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：杆或柱是连接对象',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%A4%A9%E7%BA%BF%E8%A2%8B%E5%8F%A3%E6%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：袋口麻袋口是速解封闭对象',
          },
        ],
      },
    ],
  },
  {
    id: '天线袋口结',
    source: {
      name: '天线袋口结',
      url: 'https://knots3d.com/zh-CN/%E5%A4%A9%E7%BA%BF%E8%A2%8B%E5%8F%A3%E7%BB%93',
      englishName: 'Ground-line Hitch',
      englishAliases: [
        'Spar Hitch',
        'Picket-line Hitch',
        'Fender Knot',
        "Miller's Knot",
        'Sack Knot',
        'Bag Knot',
      ],
      englishUrl: 'https://knots3d.com/en/ground-line-hitch-knot',
      englishSlug: 'ground-line-hitch-knot',
      aliases: [],
      abok: ['1680'],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%A4%A9%E7%BA%BF%E8%A2%8B%E5%8F%A3%E7%BB%93.webp',
      relatedIds: [
        '天线袋口滑结',
        '米勒结',
        '压绑结',
        '帆杆结',
        '收缩结',
        '相依套钩结',
        '刺网套钩结',
        '领圈结',
        '卡里克垫结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A4%A9%E7%BA%BF%E8%A2%8B%E5%8F%A3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索系到杆柱',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A4%A9%E7%BA%BF%E8%A2%8B%E5%8F%A3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：较粗绳索是并排连接对象',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A4%A9%E7%BA%BF%E8%A2%8B%E5%8F%A3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：杆柱是系附对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A4%A9%E7%BA%BF%E8%A2%8B%E5%8F%A3%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：护舷是系挂对象',
          },
        ],
      },
    ],
  },
  {
    id: '奥尔布赖特结',
    source: {
      name: '奥尔布赖特结',
      url: 'https://knots3d.com/zh-CN/%E5%A5%A5%E5%B0%94%E5%B8%83%E8%B5%96%E7%89%B9%E7%BB%93',
      englishName: 'Albright Special',
      englishAliases: ['Albright Knot'],
      englishUrl: 'https://knots3d.com/en/albright-special-knot',
      englishSlug: 'albright-special-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%A5%A5%E5%B0%94%E5%B8%83%E8%B5%96%E7%89%B9%E7%BB%93.webp',
      relatedIds: ['尤卡坦结', '阿尔贝托结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%A5%A5%E5%B0%94%E5%B8%83%E8%B5%96%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接不同粗细鱼线',
          },
        ],
      },
    ],
  },
  {
    id: '奥维斯结',
    source: {
      name: '奥维斯结',
      url: 'https://knots3d.com/zh-CN/%E5%A5%A5%E7%BB%B4%E6%96%AF%E7%BB%93',
      englishName: 'Orvis Knot',
      englishAliases: ['Becker Knot'],
      englishUrl: 'https://knots3d.com/en/orvis-knot',
      englishSlug: 'orvis-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%A5%A5%E7%BB%B4%E6%96%AF%E7%BB%93.webp',
      relatedIds: ['改进的扭抱结', '拉帕拉结', '戴维结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A5%A5%E7%BB%B4%E6%96%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：鱼线是连接材料',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A5%A5%E7%BB%B4%E6%96%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：鱼钩是连接对象',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A5%A5%E7%BB%B4%E6%96%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：毛钩是系接对象',
          },
        ],
      },
      {
        id: 'swivel',
        name: '转环',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%A5%A5%E7%BB%B4%E6%96%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：转环是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '完美绳端结',
    source: {
      name: '完美绳端结',
      url: 'https://knots3d.com/zh-CN/%E5%AE%8C%E7%BE%8E%E7%BB%B3%E7%AB%AF%E7%BB%93',
      englishName: 'Perfect Whipping',
      englishAliases: ['Perfected Whipping', 'Improved Whipping'],
      englishUrl: 'https://knots3d.com/en/perfect-whipping-knot',
      englishSlug: 'perfect-whipping-knot',
      aliases: ['完美绳头结', '完善绳头结', '改进绳头结'],
      abok: [],
      activityIds: ['rope-care'],
      typeId: 'whipping',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%AE%8C%E7%BE%8E%E7%BB%B3%E7%AB%AF%E7%BB%93.webp',
      relatedIds: [
        '惯用绳端结',
        '压绑结',
        '西部绳端结',
        '平尾结-方法三',
        '平尾结-方法二',
        '多重反手结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%AE%8C%E7%BE%8E%E7%BB%B3%E7%AB%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳端是缠扎对象',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%AE%8C%E7%BE%8E%E7%BB%B3%E7%AB%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳是缠扎材料',
          },
        ],
      },
    ],
  },
  {
    id: '对称简西蒙结',
    source: {
      name: '对称简西蒙结',
      url: 'https://knots3d.com/zh-CN/%E5%AF%B9%E7%A7%B0%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93',
      englishName: 'Symmetric Simple Simon',
      englishAliases: ['SSS', 'Triple S', 'Symmetric Simple Simon (Over/Over)'],
      englishUrl: 'https://knots3d.com/en/symmetric-simple-simon-knot',
      englishSlug: 'symmetric-simple-simon-knot',
      aliases: [],
      abok: [],
      activityIds: [],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%AF%B9%E7%A7%B0%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93.webp',
      relatedIds: [
        '简西蒙结-上',
        '简西蒙结-下',
        '双简西蒙结-上',
        '双简西蒙结-下',
        '接绳结',
        '平结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%AF%B9%E7%A7%B0%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接合成绳索',
          },
        ],
      },
    ],
  },
  {
    id: '对称缆绳连接结-上',
    source: {
      name: '对称缆绳连接结（上）',
      url: 'https://knots3d.com/zh-CN/%E5%AF%B9%E7%A7%B0%E7%BC%86%E7%BB%B3%E8%BF%9E%E6%8E%A5%E7%BB%93-%E4%B8%8A',
      englishName: 'Symmetric Hawser Bend (Over)',
      englishAliases: ['Symmetric Hawser Bend I', 'Hawser Bend (Over)'],
      englishUrl: 'https://knots3d.com/en/symmetric-hawser-bend-over-knot',
      englishSlug: 'symmetric-hawser-bend-over-knot',
      aliases: ['上对称缆绳连接结'],
      abok: [],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%AF%B9%E7%A7%B0%E7%BC%86%E7%BB%B3%E8%BF%9E%E6%8E%A5%E7%BB%93-%E4%B8%8A.webp',
      relatedIds: ['对称缆绳连接结-下', '大绳接结', '齐柏林结', '单套衔接结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%AF%B9%E7%A7%B0%E7%BC%86%E7%BB%B3%E8%BF%9E%E6%8E%A5%E7%BB%93-%E4%B8%8A',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：连接两条绳索',
          },
        ],
      },
    ],
  },
  {
    id: '对称缆绳连接结-下',
    source: {
      name: '对称缆绳连接结（下）',
      url: 'https://knots3d.com/zh-CN/%E5%AF%B9%E7%A7%B0%E7%BC%86%E7%BB%B3%E8%BF%9E%E6%8E%A5%E7%BB%93-%E4%B8%8B',
      englishName: 'Symmetric Hawser Bend (Under)',
      englishAliases: ['Symmetric Hawser Bend II', 'Hawser Bend (Under)'],
      englishUrl: 'https://knots3d.com/en/symmetric-hawser-bend-under-knot',
      englishSlug: 'symmetric-hawser-bend-under-knot',
      aliases: ['下对称缆绳连接结'],
      abok: [],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%AF%B9%E7%A7%B0%E7%BC%86%E7%BB%B3%E8%BF%9E%E6%8E%A5%E7%BB%93-%E4%B8%8B.webp',
      relatedIds: ['对称缆绳连接结-上', '大绳接结', '齐柏林结', '单套衔接结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%AF%B9%E7%A7%B0%E7%BC%86%E7%BB%B3%E8%BF%9E%E6%8E%A5%E7%BB%93-%E4%B8%8B',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：连接不同制法绳索',
          },
        ],
      },
    ],
  },
  {
    id: '尤卡坦结',
    source: {
      name: '尤卡坦结',
      url: 'https://knots3d.com/zh-CN/%E5%B0%A4%E5%8D%A1%E5%9D%A6%E7%BB%93',
      englishName: 'Yucatan Knot',
      englishAliases: ['Worm Knot', 'Reverse Albright Knot', 'Reverse Knot'],
      englishUrl: 'https://knots3d.com/en/yucatan-knot',
      englishSlug: 'yucatan-knot',
      aliases: ['尤卡坦半岛结'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%B0%A4%E5%8D%A1%E5%9D%A6%E7%BB%93.webp',
      relatedIds: ['奥尔布赖特结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B0%A4%E5%8D%A1%E5%9D%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：编织鱼线与粗重前导线是连接双方',
          },
        ],
      },
    ],
  },
  {
    id: '布罗奇连接结',
    source: {
      name: '布罗奇连接结',
      url: 'https://knots3d.com/zh-CN/%E5%B8%83%E7%BD%97%E5%A5%87%E8%BF%9E%E6%8E%A5%E7%BB%93',
      englishName: 'Broach Bend',
      englishAliases: ["Asher's Broach Bend"],
      englishUrl: 'https://knots3d.com/en/broach-bend-knot',
      englishSlug: 'broach-bend-knot',
      aliases: [],
      abok: [],
      activityIds: ['boating', 'camping'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%B8%83%E7%BD%97%E5%A5%87%E8%BF%9E%E6%8E%A5%E7%BB%93.webp',
      relatedIds: ['齐柏林结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%B8%83%E7%BD%97%E5%A5%87%E8%BF%9E%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：连接两条绳索',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%B8%83%E7%BD%97%E5%A5%87%E8%BF%9E%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：船是绳索连接用途的场景载体',
          },
        ],
      },
    ],
  },
  {
    id: '布莱克氏结',
    source: {
      name: '布莱克氏结',
      url: 'https://knots3d.com/zh-CN/%E5%B8%83%E8%8E%B1%E5%85%8B%E6%B0%8F%E7%BB%93',
      englishName: "Blake's Hitch",
      englishAliases: ['Swicero', 'Suicero', 'Verones Knot', 'Prohaska Hitch'],
      englishUrl: 'https://knots3d.com/en/blakes-hitch-knot',
      englishSlug: 'blakes-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['arborist', 'camping'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%B8%83%E8%8E%B1%E5%85%8B%E6%B0%8F%E7%BB%93.webp',
      relatedIds: ['普鲁士抓结', '营钉结', '八字结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%83%E8%8E%B1%E5%85%8B%E6%B0%8F%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是滑动抓握对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%83%E8%8E%B1%E5%85%8B%E6%B0%8F%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：树木是修剪作业对象，未推断该结直接绑树',
          },
        ],
      },
    ],
  },
  {
    id: '帆杆结',
    source: {
      name: '帆杆结',
      url: 'https://knots3d.com/zh-CN/%E5%B8%86%E6%9D%86%E7%BB%93',
      englishName: 'Boom Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/boom-hitch-knot',
      englishSlug: 'boom-hitch-knot',
      aliases: [],
      abok: ['1687'],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%B8%86%E6%9D%86%E7%BB%93.webp',
      relatedIds: ['双套结-绳端', '天线袋口结', '相依套钩结', '收缩结', '冰柱结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E6%9D%86%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索系到帆杆',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E6%9D%86%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：杆是系附对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E6%9D%86%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：帆船是帆杆所属载体',
          },
        ],
      },
      {
        id: 'sail-rigging',
        name: '帆具与帆索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E6%9D%86%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：帆杆是系附对象',
          },
        ],
      },
    ],
  },
  {
    id: '帆脚滑结',
    source: {
      name: '帆脚滑结',
      url: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E6%BB%91%E7%BB%93',
      englishName: 'Slipped Buntline Hitch',
      englishAliases: ['Quick Release Buntline'],
      englishUrl: 'https://knots3d.com/en/slipped-buntline-hitch-knot',
      englishSlug: 'slipped-buntline-hitch-knot',
      aliases: ['快解帆脚结'],
      abok: ['397'],
      activityIds: ['boating', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%B8%86%E8%84%9A%E6%BB%91%E7%BB%93.webp',
      relatedIds: ['帆脚结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E6%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是连接材料',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E6%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：圆环是外接物',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E6%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：钩环是旗绳系接对象',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E6%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：与圆环并列的钩为通用外接物',
          },
        ],
      },
    ],
  },
  {
    id: '帆脚结',
    source: {
      name: '帆脚结',
      url: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E7%BB%93',
      englishName: 'Buntline Hitch',
      englishAliases: ['Inside Clove Hitch', 'Studding Sail Tack Bend'],
      englishUrl: 'https://knots3d.com/en/buntline-hitch-knot',
      englishSlug: 'buntline-hitch-knot',
      aliases: ['拢帆索套钩结'],
      abok: ['55'],
      activityIds: ['arborist', 'boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%B8%86%E8%84%9A%E7%BB%93.webp',
      relatedIds: ['帆脚滑结', '双半结', '𢃇缆结', '锚结', '蚊虫结', '埃斯塔止索结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是连接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：旗杆是旗杆夹的所属载体，未声称直接绕杆',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：索环是系接对象',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：卸扣是升降索连接对象',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：钩是通用小配件连接物',
          },
        ],
      },
      {
        id: 'sail-rigging',
        name: '帆具与帆索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：帆或帆配件是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '帕洛玛结',
    source: {
      name: '帕洛玛结',
      url: 'https://knots3d.com/zh-CN/%E5%B8%95%E6%B4%9B%E7%8E%9B%E7%BB%93',
      englishName: 'Palomar Knot',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/palomar-knot',
      englishSlug: 'palomar-knot',
      aliases: ['帕洛马结'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%B8%95%E6%B4%9B%E7%8E%9B%E7%BB%93.webp',
      relatedIds: ['双重单结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%95%E6%B4%9B%E7%8E%9B%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：绳子绳索是小五金件连接材料',
          },
        ],
      },
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%95%E6%B4%9B%E7%8E%9B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线是鱼钩连接材料',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%95%E6%B4%9B%E7%8E%9B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼钩是连接对象',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%95%E6%B4%9B%E7%8E%9B%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：拟饵是系接对象',
          },
        ],
      },
      {
        id: 'swivel',
        name: '转环',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B8%95%E6%B4%9B%E7%8E%9B%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：转环是系接对象',
          },
        ],
      },
    ],
  },
  {
    id: '平尾结-方法一',
    source: {
      name: '平尾结（方法一）',
      url: 'https://knots3d.com/zh-CN/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%B8%80',
      englishName: 'Spade Hook Knot (Method 1)',
      englishAliases: [
        'Easy Spade Hook Knot',
        'Spade End Knot',
        'Spade End Hook Knot',
        'Pallet Hook Knot',
        'Paddle Hook Knot',
      ],
      englishUrl: 'https://knots3d.com/en/spade-hook-knot-method-1',
      englishSlug: 'spade-hook-knot-method-1',
      aliases: ['铲尾结', '鱼钩结', '平尾钩结'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%B8%80.webp',
      relatedIds: ['平尾结-方法二', '内跨结', '改进的扭抱结', '惯用绳端结', '平尾结-方法三'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%B8%80',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线直接系钩',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%B8%80',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：无眼鱼钩是系接对象',
          },
        ],
      },
    ],
  },
  {
    id: '平尾结-方法三',
    source: {
      name: '平尾结（方法三）',
      url: 'https://knots3d.com/zh-CN/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%B8%89',
      englishName: 'Spade Hook Knot (Method 3)',
      englishAliases: [
        'Inner Snell Knot',
        'Spade End Knot',
        'Spade End Hook Knot',
        'Pallet Hook Knot',
        'Paddle Hook Knot',
      ],
      englishUrl: 'https://knots3d.com/en/spade-hook-knot-method-3',
      englishSlug: 'spade-hook-knot-method-3',
      aliases: ['内挂结', '铲尾结', '鱼钩结', '平尾钩结'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%B8%89.webp',
      relatedIds: ['平尾结-方法一', '平尾结-方法二', '完美绳端结', '压绑结', '内跨结', '邓肯环-结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%B8%89',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线直接系钩',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%B8%89',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：平尾鱼钩是系接对象',
          },
        ],
      },
    ],
  },
  {
    id: '平尾结-方法二',
    source: {
      name: '平尾结（方法二）',
      url: 'https://knots3d.com/zh-CN/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%BA%8C',
      englishName: 'Spade Hook Knot (Method 2)',
      englishAliases: [
        'Domhof Knot',
        'Spade End Knot',
        'Spade End Hook Knot',
        'Pallet Hook Knot',
        'Paddle Hook Knot',
      ],
      englishUrl: 'https://knots3d.com/en/spade-hook-knot-method-2',
      englishSlug: 'spade-hook-knot-method-2',
      aliases: ['多姆霍夫结', '铲尾结', '鱼钩结', '平尾钩结'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%BA%8C.webp',
      relatedIds: ['平尾结-方法一', '内跨结', '改进的扭抱结', '惯用绳端结', '平尾结-方法三'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%BA%8C',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线直接系钩',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%B9%B3%E5%B0%BE%E7%BB%93-%E6%96%B9%E6%B3%95%E4%BA%8C',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：无眼鱼钩是系接对象',
          },
        ],
      },
    ],
  },
  {
    id: '平结',
    source: {
      name: '平结',
      url: 'https://knots3d.com/zh-CN/%E5%B9%B3%E7%BB%93',
      englishName: 'Square Knot',
      englishAliases: ['Reef Knot', 'Hercules Knot'],
      englishUrl: 'https://knots3d.com/en/square-knot',
      englishSlug: 'square-knot',
      aliases: ['索帆结'],
      abok: ['1204'],
      activityIds: [
        'essentials',
        'military',
        'theater-film',
        'diving',
        'scouting',
        'boating',
        'decorative',
        'camping',
      ],
      typeId: 'binding',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E5%B9%B3%E7%BB%93.webp',
      relatedIds: ['外科结', '贼结', '祖母结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B9%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：细绳是捆扎材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B9%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：明确细绳捆扎',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B9%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：篷布是卷起固定对象',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B9%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：包裹货物是捆扎对象',
          },
        ],
      },
      {
        id: 'sail-rigging',
        name: '帆具与帆索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B9%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 8,
            note: '逐条语义核对：帆布绑到帆桁以收帆',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B9%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：潜水软管是快挂扣系接对象',
          },
        ],
      },
      {
        id: 'bracelet',
        name: '手链与腕带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%B9%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：用于开始友谊手链项目',
          },
        ],
      },
    ],
  },
  {
    id: '并蒂单套衔接结',
    source: {
      name: '并蒂单套衔接结',
      url: 'https://knots3d.com/zh-CN/%E5%B9%B6%E8%92%82%E5%8D%95%E5%A5%97%E8%A1%94%E6%8E%A5%E7%BB%93',
      englishName: 'Twin Bowline Bend',
      englishAliases: ['Twin Bowline', 'Twinned Bowline', 'Yin-Yang Bowline'],
      englishUrl: 'https://knots3d.com/en/twin-bowline-bend-knot',
      englishSlug: 'twin-bowline-bend-knot',
      aliases: ['阴阳称人结'],
      abok: ['1454'],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%B9%B6%E8%92%82%E5%8D%95%E5%A5%97%E8%A1%94%E6%8E%A5%E7%BB%93.webp',
      relatedIds: ['单套衔接结', '称人结', '大绳接结', '接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%B9%B6%E8%92%82%E5%8D%95%E5%A5%97%E8%A1%94%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：连接两条绳索',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%B9%B6%E8%92%82%E5%8D%95%E5%A5%97%E8%A1%94%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：互锁绳环是连接结构，未误作金属环',
          },
        ],
      },
    ],
  },
  {
    id: '弗拉芒扁螺旋-结',
    source: {
      name: '弗拉芒扁螺旋',
      url: 'https://knots3d.com/zh-CN/%E5%BC%97%E6%8B%89%E8%8A%92%E6%89%81%E8%9E%BA%E6%97%8B-%E7%BB%93',
      englishName: 'Flemish Flake',
      englishAliases: ['Cheese'],
      englishUrl: 'https://knots3d.com/en/flemish-flake-knot',
      englishSlug: 'flemish-flake-knot',
      aliases: [],
      abok: ['3102'],
      activityIds: ['rope-care', 'boating'],
      typeId: 'coiling',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%BC%97%E6%8B%89%E8%8A%92%E6%89%81%E8%9E%BA%E6%97%8B-%E7%BB%93.webp',
      relatedIds: [],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%BC%97%E6%8B%89%E8%8A%92%E6%89%81%E8%9E%BA%E6%97%8B-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索盘成平螺旋',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%BC%97%E6%8B%89%E8%8A%92%E6%89%81%E8%9E%BA%E6%97%8B-%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：粗绳是整理存放对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E5%BC%97%E6%8B%89%E8%8A%92%E6%89%81%E8%9E%BA%E6%97%8B-%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：船是系泊绳整理展示的场景载体',
          },
        ],
      },
    ],
  },
  {
    id: '快解称人结',
    source: {
      name: '快解称人结',
      url: 'https://knots3d.com/zh-CN/%E5%BF%AB%E8%A7%A3%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: 'Slipped Bowline',
      englishAliases: ['Quick Release Bowline'],
      englishUrl: 'https://knots3d.com/en/slipped-bowline-knot',
      englishSlug: 'slipped-bowline-knot',
      aliases: [],
      abok: [],
      activityIds: ['scouting', 'boating', 'camping'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%BF%AB%E8%A7%A3%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: ['称人结', '卡尔梅克结', '滑结', '滑接绳结'],
    },
    objects: [
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%BF%AB%E8%A7%A3%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：制作便于解开的绳环',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%BF%AB%E8%A7%A3%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：小船是系泊对象',
          },
        ],
      },
      {
        id: 'bottle',
        name: '瓶、罐与桶',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%BF%AB%E8%A7%A3%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：水桶是悬挂对象',
          },
        ],
      },
    ],
  },
  {
    id: '快速车夫结',
    source: {
      name: '快速车夫结',
      url: 'https://knots3d.com/zh-CN/%E5%BF%AB%E9%80%9F%E8%BD%A6%E5%A4%AB%E7%BB%93',
      englishName: 'Truckie Hitch',
      englishAliases: [
        'Dolly Knot',
        'Dolly Hitch',
        "Waggoner's Hitch",
        "Lorry Driver's Hitch",
        'Wakos Transport Knot',
        "Sheepshank Style Trucker's Hitch",
      ],
      englishUrl: 'https://knots3d.com/en/truckie-hitch-knot',
      englishSlug: 'truckie-hitch-knot',
      aliases: ['车夫结'],
      abok: [],
      activityIds: [],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%BF%AB%E9%80%9F%E8%BD%A6%E5%A4%AB%E7%BB%93.webp',
      relatedIds: ['车夫结', '自锁车夫结', '敲钟人结', '波尔多滑轮结', '伏都结', '缩短结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%BF%AB%E9%80%9F%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：绳索是收紧对象',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%BF%AB%E9%80%9F%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：篷布是拉紧覆盖物',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%BF%AB%E9%80%9F%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：货物是运输固定对象',
          },
        ],
      },
      {
        id: 'bag',
        name: '包',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%BF%AB%E9%80%9F%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：背包是绑在货架上的对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%BF%AB%E9%80%9F%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：装备是捆扎对象',
          },
        ],
      },
    ],
  },
  {
    id: '快速连接结',
    source: {
      name: '快速连接结',
      url: 'https://knots3d.com/zh-CN/%E5%BF%AB%E9%80%9F%E8%BF%9E%E6%8E%A5%E7%BB%93',
      englishName: 'Quick Hitch',
      englishAliases: ['Slipped Lapp Knot'],
      englishUrl: 'https://knots3d.com/en/quick-hitch-knot',
      englishSlug: 'quick-hitch-knot',
      aliases: ['速套结', '滑拉普结'],
      abok: [],
      activityIds: ['arborist'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E5%BF%AB%E9%80%9F%E8%BF%9E%E6%8E%A5%E7%BB%93.webp',
      relatedIds: ['滑拉普结', '活索结', '滑接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E5%BF%AB%E9%80%9F%E8%BF%9E%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：牵引绳与另一根绳索连接',
          },
        ],
      },
    ],
  },
  {
    id: '悲伤结',
    source: {
      name: '悲伤结',
      url: 'https://knots3d.com/zh-CN/%E6%82%B2%E4%BC%A4%E7%BB%93',
      englishName: 'Grief Knot',
      englishAliases: ['Whatnot', 'Grass Bend', 'Reeving Line Bend'],
      englishUrl: 'https://knots3d.com/en/grief-knot',
      englishSlug: 'grief-knot',
      aliases: [],
      abok: ['1208'],
      activityIds: [],
      typeId: 'special',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%82%B2%E4%BC%A4%E7%BB%93.webp',
      relatedIds: ['平结', '贼结', '祖母结'],
    },
    objects: [],
  },
  {
    id: '惯用绳端结',
    source: {
      name: '惯用绳端结',
      url: 'https://knots3d.com/zh-CN/%E6%83%AF%E7%94%A8%E7%BB%B3%E7%AB%AF%E7%BB%93',
      englishName: 'Common Whipping',
      englishAliases: ['Plain Whipping', 'Ordinary Whipping', 'Wolf Whipping'],
      englishUrl: 'https://knots3d.com/en/common-whipping-knot',
      englishSlug: 'common-whipping-knot',
      aliases: ['通用绳头结'],
      abok: ['3442'],
      activityIds: ['scouting', 'rope-care'],
      typeId: 'whipping',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%83%AF%E7%94%A8%E7%BB%B3%E7%AB%AF%E7%BB%93.webp',
      relatedIds: ['西部绳端结', '反穿结', '平尾结-方法一', '平尾结-方法二', '完美绳端结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%83%AF%E7%94%A8%E7%BB%B3%E7%AB%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳端是缠绕对象',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%83%AF%E7%94%A8%E7%BB%B3%E7%AB%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳是缠绕材料',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%83%AF%E7%94%A8%E7%BB%B3%E7%AB%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：刀柄是保护缠绕对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%83%AF%E7%94%A8%E7%BB%B3%E7%AB%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：工具是保护缠绕对象',
          },
        ],
      },
    ],
  },
  {
    id: '戴维结',
    source: {
      name: '戴维结',
      url: 'https://knots3d.com/zh-CN/%E6%88%B4%E7%BB%B4%E7%BB%93',
      englishName: 'Davy Knot',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/davy-knot',
      englishSlug: 'davy-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%88%B4%E7%BB%B4%E7%BB%93.webp',
      relatedIds: ['双戴维结', '特里林结', '拉帕拉结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%88%B4%E7%BB%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：前导线是毛钩连接材料',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%88%B4%E7%BB%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：毛钩是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '扁八字连接结',
    source: {
      name: '扁八字连接结',
      url: 'https://knots3d.com/zh-CN/%E6%89%81%E5%85%AB%E5%AD%97%E8%BF%9E%E6%8E%A5%E7%BB%93',
      englishName: 'Offset Figure Eight Bend',
      englishAliases: ['Abnormal Figure 8 Bend', 'Double Figure Eight', 'Flat Figure Eight Bend'],
      englishUrl: 'https://knots3d.com/en/offset-figure-eight-bend-knot',
      englishSlug: 'offset-figure-eight-bend-knot',
      aliases: [],
      abok: [],
      activityIds: [],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%89%81%E5%85%AB%E5%AD%97%E8%BF%9E%E6%8E%A5%E7%BB%93.webp',
      relatedIds: ['八字结', '八字连接结', '反手连接结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%89%81%E5%85%AB%E5%AD%97%E8%BF%9E%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：原文讨论绳索连接并明确不推荐；物品关联不代表适用性认可',
          },
        ],
      },
    ],
  },
  {
    id: '手足结',
    source: {
      name: '手足结',
      url: 'https://knots3d.com/zh-CN/%E6%89%8B%E8%B6%B3%E7%BB%93',
      englishName: 'Blood Knot',
      englishAliases: ['Barrel Knot'],
      englishUrl: 'https://knots3d.com/en/blood-knot',
      englishSlug: 'blood-knot',
      aliases: ['血结'],
      abok: ['1413'],
      activityIds: ['fishing'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%89%8B%E8%B6%B3%E7%BB%93.webp',
      relatedIds: ['双邓肯环-结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%89%8B%E8%B6%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条鱼线',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%89%8B%E8%B6%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：毛钩或拟饵是支线连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '手铐结',
    source: {
      name: '手铐结',
      url: 'https://knots3d.com/zh-CN/%E6%89%8B%E9%93%90%E7%BB%93',
      englishName: 'Handcuff Knot',
      englishAliases: ['Hobble Knot'],
      englishUrl: 'https://knots3d.com/en/handcuff-knot',
      englishSlug: 'handcuff-knot',
      aliases: [],
      abok: ['1140'],
      activityIds: ['fire-rescue'],
      typeId: 'multi-loop',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%89%8B%E9%93%90%E7%BB%93.webp',
      relatedIds: ['消防员椅结', '瓶口结-绳端', '桅顶结'],
    },
    objects: [
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%89%8B%E9%93%90%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成两个可调绳环',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%89%8B%E9%93%90%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：双环手柄是制成物',
          },
        ],
      },
    ],
  },
  {
    id: '抓紧克拉拉结',
    source: {
      name: '抓紧克拉拉结',
      url: 'https://knots3d.com/zh-CN/%E6%8A%93%E7%B4%A7%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
      englishName: 'Clinging Clara Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/clinging-clara-hitch-knot',
      englishSlug: 'clinging-clara-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%8A%93%E7%B4%A7%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93.webp',
      relatedIds: ['克拉拉结', '皇后克拉拉结', '大皇后克拉拉结', '冰柱结', '三套结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%8A%93%E7%B4%A7%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接细绳与较粗绳索',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%8A%93%E7%B4%A7%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳是连接材料',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%8A%93%E7%B4%A7%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：粗绳是被连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '抛绳结',
    source: {
      name: '抛绳结',
      url: 'https://knots3d.com/zh-CN/%E6%8A%9B%E7%BB%B3%E7%BB%93',
      englishName: 'Heaving Line Knot',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/heaving-line-knot',
      englishSlug: 'heaving-line-knot',
      aliases: [],
      abok: ['538'],
      activityIds: ['boating'],
      typeId: 'stoppers',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%8A%9B%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['乌利结', '猴拳结', '多重反手结', '捆扎结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8A%9B%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳端是加重对象',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8A%9B%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：细绳是跨越引绳',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8A%9B%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：树枝是抛绳跨越支撑',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8A%9B%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：防熊袋是悬挂对象',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8A%9B%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：秋千是悬挂对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8A%9B%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：船是抛绳的起终点载体',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8A%9B%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：加重手柄是制成物',
          },
        ],
      },
    ],
  },
  {
    id: '拉帕拉结',
    source: {
      name: '拉帕拉结',
      url: 'https://knots3d.com/zh-CN/%E6%8B%89%E5%B8%95%E6%8B%89%E7%BB%93',
      englishName: 'Rapala Knot',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/rapala-knot',
      englishSlug: 'rapala-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%8B%89%E5%B8%95%E6%8B%89%E7%BB%93.webp',
      relatedIds: ['改进的扭抱结', '特里林结', '邓肯环-结', '克雷圆环结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8B%89%E5%B8%95%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：鱼线是连接材料',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8B%89%E5%B8%95%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：拟饵是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '拉普结',
    source: {
      name: '拉普结',
      url: 'https://knots3d.com/zh-CN/%E6%8B%89%E6%99%AE%E7%BB%93',
      englishName: 'Lapp Knot',
      englishAliases: ['Lapp Bend', 'False Sheet Bend', 'Lap Knot', 'Girdle Knot'],
      englishUrl: 'https://knots3d.com/en/lapp-knot',
      englishSlug: 'lapp-knot',
      aliases: [],
      abok: ['1224'],
      activityIds: [],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%8B%89%E6%99%AE%E7%BB%93.webp',
      relatedIds: ['滑拉普结', '接绳结', '哥萨克结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8B%89%E6%99%AE%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两根绳索',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8B%89%E6%99%AE%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：细绳是连接材料',
          },
        ],
      },
      {
        id: 'shoelace',
        name: '鞋带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8B%89%E6%99%AE%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：鞋带是连接材料',
          },
        ],
      },
    ],
  },
  {
    id: '捆扎结',
    source: {
      name: '捆扎结',
      url: 'https://knots3d.com/zh-CN/%E6%8D%86%E6%89%8E%E7%BB%93',
      englishName: 'Racking Bend',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/racking-bend-knot',
      englishSlug: 'racking-bend-knot',
      aliases: [],
      abok: ['1462'],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%8D%86%E6%89%8E%E7%BB%93.webp',
      relatedIds: ['双接绳结', '接绳结', '抛绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8D%86%E6%89%8E%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：连接不同粗细绳索',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8D%86%E6%89%8E%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳是连接一端',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8D%86%E6%89%8E%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：粗绳是连接一端',
          },
        ],
      },
    ],
  },
  {
    id: '捕兽结',
    source: {
      name: '捕兽结',
      url: 'https://knots3d.com/zh-CN/%E6%8D%95%E5%85%BD%E7%BB%93',
      englishName: "Fisherman's Eye",
      englishAliases: [
        "Middleman's Knot",
        "Fisherman's Loop",
        "Englishman's Loop",
        "True Lover's Knot",
      ],
      englishUrl: 'https://knots3d.com/en/fishermans-eye-knot',
      englishSlug: 'fishermans-eye-knot',
      aliases: ['络头结', '中间人结'],
      abok: ['1038'],
      activityIds: ['fishing'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%8D%95%E5%85%BD%E7%BB%93.webp',
      relatedIds: ['渔人结', '络头结', '阿尔卑斯蝴蝶结', '反手结', '滑结', '同心结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8D%95%E5%85%BD%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索中间形成环',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8D%95%E5%85%BD%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成固定绳环',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8D%95%E5%85%BD%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：装备是中段连接点用途',
          },
        ],
      },
    ],
  },
  {
    id: '接绳结',
    source: {
      name: '接绳结',
      url: 'https://knots3d.com/zh-CN/%E6%8E%A5%E7%BB%B3%E7%BB%93',
      englishName: 'Sheet Bend',
      englishAliases: ["Weaver's Knot", 'Becket Bend'],
      englishUrl: 'https://knots3d.com/en/sheet-bend-knot',
      englishSlug: 'sheet-bend-knot',
      aliases: ['单编结'],
      abok: ['1'],
      activityIds: [
        'essentials',
        'theater-film',
        'arborist',
        'diving',
        'scouting',
        'boating',
        'camping',
      ],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%8E%A5%E7%BB%B3%E7%BB%93.webp',
      relatedIds: [
        '滑接绳结',
        '双接绳结',
        '三重接绳结',
        '单向接绳结',
        '三向接绳结',
        '拉普结',
        '桑索姆连接结',
        '齐柏林结',
        '称人结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两根绳索',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：连接两段细绳',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：篷布帆布角环是连接对象；未采用第1条否定的金属扣眼',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：无金属扣眼篷布也可系绳',
          },
        ],
      },
    ],
  },
  {
    id: '握手结',
    source: {
      name: '握手结',
      url: 'https://knots3d.com/zh-CN/%E6%8F%A1%E6%89%8B%E7%BB%93',
      englishName: 'Shake Hands Bend',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/shake-hands-bend-knot',
      englishSlug: 'shake-hands-bend-knot',
      aliases: [],
      abok: [],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%8F%A1%E6%89%8B%E7%BB%93.webp',
      relatedIds: ['反手结', '齐柏林结', '亨特结', '阿什利结', '阿尔卑斯中间衔接结', '接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%8F%A1%E6%89%8B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两根绳索',
          },
        ],
      },
    ],
  },
  {
    id: '收缩结',
    source: {
      name: '收缩结',
      url: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93',
      englishName: 'Constrictor Knot',
      englishAliases: ["Gunner's Knot", 'Whip Knot', 'Timber Knot'],
      englishUrl: 'https://knots3d.com/en/constrictor-knot',
      englishSlug: 'constrictor-knot',
      aliases: ['缩紧结'],
      abok: ['1249'],
      activityIds: ['essentials', 'caving', 'camping'],
      typeId: 'binding',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%94%B6%E7%BC%A9%E7%BB%93.webp',
      relatedIds: [
        '滑收缩结',
        '横梁结',
        '双重收缩结',
        '帆杆结',
        '米勒结',
        '压绑结',
        '双套结-绳端',
        '收缩结-绳中',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳端是临时绑扎对象',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：杆是覆盖物固定载体',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：两块木头是固定对象',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：袋口是封闭对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：软管是夹紧对象',
          },
        ],
      },
      {
        id: 'cable',
        name: '电线与线缆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：电缆电线是捆扎对象',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：手柄是缠绕物固定载体',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：工具是捆扎对象',
          },
        ],
      },
    ],
  },
  {
    id: '收缩结-绳中',
    source: {
      name: '收缩结（绳中）',
      url: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93-%E7%BB%B3%E4%B8%AD',
      englishName: 'Constrictor in the Bight',
      englishAliases: ['Constrictor Knot in the Bight'],
      englishUrl: 'https://knots3d.com/en/constrictor-in-the-bight-knot',
      englishSlug: 'constrictor-in-the-bight-knot',
      aliases: [],
      abok: ['1251'],
      activityIds: ['caving', 'camping'],
      typeId: 'binding',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%94%B6%E7%BC%A9%E7%BB%93-%E7%BB%B3%E4%B8%AD.webp',
      relatedIds: ['收缩结', '滑收缩结', '双重收缩结', '双套结-绳中'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：使用绳索中段捆绑，否定仅指无需接触端部',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱子栏杆是捆绑对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：管子是套结对象',
          },
        ],
      },
    ],
  },
  {
    id: '改良牛索结',
    source: {
      name: '改良牛索结',
      url: 'https://knots3d.com/zh-CN/%E6%94%B9%E8%89%AF%E7%89%9B%E7%B4%A2%E7%BB%93',
      englishName: 'Pedigree Cow Hitch',
      englishAliases: ['Cow Hitch Variant', 'Improved Cow Hitch', "Asher's Cow Hitch"],
      englishUrl: 'https://knots3d.com/en/pedigree-cow-hitch-knot',
      englishSlug: 'pedigree-cow-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['climbing', 'fire-rescue', 'boating'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%94%B9%E8%89%AF%E7%89%9B%E7%B4%A2%E7%BB%93.webp',
      relatedIds: ['牛索结', '牛眼结-绳端', '皮维奇结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B9%E8%89%AF%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是系接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B9%E8%89%AF%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱是系接对象',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B9%E8%89%AF%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：固定环或索眼是外接对象',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B9%E8%89%AF%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：钩子是悬挂支撑，未专指鱼钩',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%94%B9%E8%89%AF%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：挂绳是系接对象',
          },
        ],
      },
    ],
  },
  {
    id: '改进的扭抱结',
    source: {
      name: '改进的扭抱结',
      url: 'https://knots3d.com/zh-CN/%E6%94%B9%E8%BF%9B%E7%9A%84%E6%89%AD%E6%8A%B1%E7%BB%93',
      englishName: 'Clinch Knot (Improved)',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/clinch-knot-improved',
      englishSlug: 'clinch-knot-improved',
      aliases: ['改进的克林奇结'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%94%B9%E8%BF%9B%E7%9A%84%E6%89%AD%E6%8A%B1%E7%BB%93.webp',
      relatedIds: [
        '特里林结',
        '拉帕拉结',
        '改进邓肯环-结',
        '奥维斯结',
        '皮岑结',
        '平尾结-方法一',
        '平尾结-方法二',
      ],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%94%B9%E8%BF%9B%E7%9A%84%E6%89%AD%E6%8A%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线是系钩材料',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%94%B9%E8%BF%9B%E7%9A%84%E6%89%AD%E6%8A%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼钩是系接对象',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%94%B9%E8%BF%9B%E7%9A%84%E6%89%AD%E6%8A%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：拟饵是连接对象',
          },
        ],
      },
      {
        id: 'swivel',
        name: '转环',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%94%B9%E8%BF%9B%E7%9A%84%E6%89%AD%E6%8A%B1%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：转环是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '改进邓肯环-结',
    source: {
      name: '改进邓肯环',
      url: 'https://knots3d.com/zh-CN/%E6%94%B9%E8%BF%9B%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
      englishName: 'Fish-N-Fool',
      englishAliases: ['Improved Uni Knot', 'Improved Duncan Loop', 'Improved Grinner Knot'],
      englishUrl: 'https://knots3d.com/en/fish-n-fool-knot',
      englishSlug: 'fish-n-fool-knot',
      aliases: ['改进万能结'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%94%B9%E8%BF%9B%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93.webp',
      relatedIds: ['邓肯环-结', '手足结', '改进的扭抱结', '圣地亚哥锁结', '帕洛玛结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%94%B9%E8%BF%9B%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：编织鱼线是连接材料',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%94%B9%E8%BF%9B%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：拟饵是连接对象',
          },
        ],
      },
      {
        id: 'swivel',
        name: '转环',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%94%B9%E8%BF%9B%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：转环是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '敲钟人结',
    source: {
      name: '敲钟人结',
      url: 'https://knots3d.com/zh-CN/%E6%95%B2%E9%92%9F%E4%BA%BA%E7%BB%93',
      englishName: "Bell Ringer's Knot",
      englishAliases: ['Half Sheepshank'],
      englishUrl: 'https://knots3d.com/en/bell-ringers-knot',
      englishSlug: 'bell-ringers-knot',
      aliases: [],
      abok: ['1147'],
      activityIds: ['rope-care'],
      typeId: 'special',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%95%B2%E9%92%9F%E4%BA%BA%E7%BB%93.webp',
      relatedIds: ['缩短结', '快速车夫结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%95%B2%E9%92%9F%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：缩短悬挂绳索',
          },
        ],
      },
    ],
  },
  {
    id: '斯科特锁定称人结',
    source: {
      name: '斯科特锁定称人结',
      url: 'https://knots3d.com/zh-CN/%E6%96%AF%E7%A7%91%E7%89%B9%E9%94%81%E5%AE%9A%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: "Scott's Locked Bowline",
      englishAliases: ['Secured Bowline'],
      englishUrl: 'https://knots3d.com/en/scotts-locked-bowline-knot',
      englishSlug: 'scotts-locked-bowline-knot',
      aliases: ['安全称人结'],
      abok: [],
      activityIds: ['climbing', 'fire-rescue'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%96%AF%E7%A7%91%E7%89%B9%E9%94%81%E5%AE%9A%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: [
        '称人结',
        '牛仔称人结',
        '约塞米蒂称人结',
        '爱德华兹称人结',
        '双称人结',
        '水中称人结',
        '汉森圈结',
      ],
    },
    objects: [
      {
        id: 'harness',
        name: '安全带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%96%AF%E7%A7%91%E7%89%B9%E9%94%81%E5%AE%9A%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：安全带是绑入对象',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%96%AF%E7%A7%91%E7%89%B9%E9%94%81%E5%AE%9A%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：固定环用于锚点系统',
          },
        ],
      },
    ],
  },
  {
    id: '施瓦本结',
    source: {
      name: '施瓦本结',
      url: 'https://knots3d.com/zh-CN/%E6%96%BD%E7%93%A6%E6%9C%AC%E7%BB%93',
      englishName: 'Schwabisch',
      englishAliases: [
        'Asymmetric Prusik',
        'Schwabisch Hitch',
        'Schwabisch Prusik',
        'Schwabish',
        'Schwäbisch',
      ],
      englishUrl: 'https://knots3d.com/en/schwabisch-knot',
      englishSlug: 'schwabisch-knot',
      aliases: [],
      abok: [],
      activityIds: ['arborist'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%96%BD%E7%93%A6%E6%9C%AC%E7%BB%93.webp',
      relatedIds: ['迪斯特尔结', '瓦尔多斯坦结', '克氏抓结', '米却肯结', '普鲁士抓结', '双圈索结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%96%BD%E7%93%A6%E6%9C%AC%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是抓握对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%96%BD%E7%93%A6%E6%9C%AC%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：爬树是明示用途场景，未推定结直接绑树',
          },
        ],
      },
    ],
  },
  {
    id: '无张力结',
    source: {
      name: '无张力结',
      url: 'https://knots3d.com/zh-CN/%E6%97%A0%E5%BC%A0%E5%8A%9B%E7%BB%93',
      englishName: 'Tensionless Hitch',
      englishAliases: ['No-Knot', 'Tensionless Anchor'],
      englishUrl: 'https://knots3d.com/en/tensionless-hitch-knot',
      englishSlug: 'tensionless-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['fire-rescue'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%97%A0%E5%BC%A0%E5%8A%9B%E7%BB%93.webp',
      relatedIds: ['驳船结', '八字套结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%97%A0%E5%BC%A0%E5%8A%9B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是固定材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%97%A0%E5%BC%A0%E5%8A%9B%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：柱是绕系对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%97%A0%E5%BC%A0%E5%8A%9B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：树是固定对象',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%97%A0%E5%BC%A0%E5%8A%9B%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：树上搭建攀登锚点',
          },
        ],
      },
    ],
  },
  {
    id: '日本四方编结',
    source: {
      name: '日本四方编结',
      url: 'https://knots3d.com/zh-CN/%E6%97%A5%E6%9C%AC%E5%9B%9B%E6%96%B9%E7%BC%96%E7%BB%93',
      englishName: 'Japanese Square Lashing',
      englishAliases: ['Mark II Square Lashing', 'Japanese Mark II Square Lashing'],
      englishUrl: 'https://knots3d.com/en/japanese-square-lashing-knot',
      englishSlug: 'japanese-square-lashing-knot',
      aliases: [],
      abok: [],
      activityIds: ['pioneering'],
      typeId: 'lashings',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%97%A5%E6%9C%AC%E5%9B%9B%E6%96%B9%E7%BC%96%E7%BB%93.webp',
      relatedIds: ['四方编结', '林地扎带编结', '平结'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%97%A5%E6%9C%AC%E5%9B%9B%E6%96%B9%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：两根杆是直角绑扎对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%97%A5%E6%9C%AC%E5%9B%9B%E6%96%B9%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：梯子是绑扎成品',
          },
        ],
      },
    ],
  },
  {
    id: '普鲁士抓结',
    source: {
      name: '普鲁士抓结',
      url: 'https://knots3d.com/zh-CN/%E6%99%AE%E9%B2%81%E5%A3%AB%E6%8A%93%E7%BB%93',
      englishName: 'Prusik',
      englishAliases: ['Prusik Hitch', 'Middle of the Rope Prusik'],
      englishUrl: 'https://knots3d.com/en/prusik-knot',
      englishSlug: 'prusik-knot',
      aliases: ['普鲁士结'],
      abok: ['1763'],
      activityIds: [
        'essentials',
        'military',
        'theater-film',
        'caving',
        'climbing',
        'arborist',
        'fire-rescue',
      ],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%99%AE%E9%B2%81%E5%A3%AB%E6%8A%93%E7%BB%93.webp',
      relatedIds: ['普鲁士结-绳尾', '双渔人结', '雀头结', '克氏抓结', '三重渔人结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%99%AE%E9%B2%81%E5%A3%AB%E6%8A%93%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索是双向抓握对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%99%AE%E9%B2%81%E5%A3%AB%E6%8A%93%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：树间架绳是悬挂场景，未推定该结直接绑树',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%99%AE%E9%B2%81%E5%A3%AB%E6%8A%93%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：铁锁是锁定吊床防水布的物件',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%99%AE%E9%B2%81%E5%A3%AB%E6%8A%93%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：防水布或庇护所绳索是调节对象',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%99%AE%E9%B2%81%E5%A3%AB%E6%8A%93%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：明确调整吊床防水布',
          },
        ],
      },
      {
        id: 'cleat',
        name: '系缆桩、船锚与锚链',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%99%AE%E9%B2%81%E5%A3%AB%E6%8A%93%E7%BB%93',
            field: 'common-uses',
            useIndex: 9,
            note: '逐条语义核对：锚链是缓冲绳连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '普鲁士结-绳尾',
    source: {
      name: '普鲁士结（绳尾）',
      url: 'https://knots3d.com/zh-CN/%E6%99%AE%E9%B2%81%E5%A3%AB%E7%BB%93-%E7%BB%B3%E5%B0%BE',
      englishName: 'Prusik (End-line)',
      englishAliases: ['Prusik Hitch', 'End of the Rope Prusik', 'End-line Prusik'],
      englishUrl: 'https://knots3d.com/en/prusik-end-line-knot',
      englishSlug: 'prusik-end-line-knot',
      aliases: [],
      abok: ['1763'],
      activityIds: ['military', 'climbing'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%99%AE%E9%B2%81%E5%A3%AB%E7%BB%93-%E7%BB%B3%E5%B0%BE.webp',
      relatedIds: ['普鲁士抓结', '牛索结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%99%AE%E9%B2%81%E5%A3%AB%E7%BB%93-%E7%BB%B3%E5%B0%BE',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳系到绳索上',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%99%AE%E9%B2%81%E5%A3%AB%E7%BB%93-%E7%BB%B3%E5%B0%BE',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：单股细绳是摩擦结材料',
          },
        ],
      },
    ],
  },
  {
    id: '束帆收绳结',
    source: {
      name: '束帆收绳结',
      url: 'https://knots3d.com/zh-CN/%E6%9D%9F%E5%B8%86%E6%94%B6%E7%BB%B3%E7%BB%93',
      englishName: 'Gasket Coil',
      englishAliases: ['Buntline Coil'],
      englishUrl: 'https://knots3d.com/en/gasket-coil-knot',
      englishSlug: 'gasket-coil-knot',
      aliases: ['捆绑绳圈'],
      abok: ['3089'],
      activityIds: ['theater-film', 'climbing', 'fire-rescue', 'rope-care', 'boating'],
      typeId: 'coiling',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%9D%9F%E5%B8%86%E6%94%B6%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['消防员收绳结', '水手收绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%9D%9F%E5%B8%86%E6%94%B6%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是盘绕存放对象',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%9D%9F%E5%B8%86%E6%94%B6%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：钩子是收绳后的悬挂物',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%9D%9F%E5%B8%86%E6%94%B6%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：船是整理绳索的场景载体',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%9D%9F%E5%B8%86%E6%94%B6%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：软管是整理防缠绕对象',
          },
        ],
      },
    ],
  },
  {
    id: '林地扎带结',
    source: {
      name: '林地扎带结',
      url: 'https://knots3d.com/zh-CN/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BB%93',
      englishName: 'Woodland Zip-tie',
      englishAliases: ['Bedroll Knot', 'Cow Hitch Lock Knot'],
      englishUrl: 'https://knots3d.com/en/woodland-zip-tie-knot',
      englishSlug: 'woodland-zip-tie-knot',
      aliases: ['铺盖卷结'],
      abok: [],
      activityIds: ['camping'],
      typeId: 'binding',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BB%93.webp',
      relatedIds: ['林地扎带编结', '加拿大锁结', '雀头结', '牛索结'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：木棍或杆是束紧对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：树枝是束紧对象',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：箱子货物是车架绑载对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：管子是束紧对象',
          },
        ],
      },
      {
        id: 'bag',
        name: '包',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：包与箱货并列为绑载物',
          },
        ],
      },
      {
        id: 'bedding',
        name: '睡袋与铺盖垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：睡袋气垫铺盖卷是压缩对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：装备是捆扎固定对象',
          },
        ],
      },
    ],
  },
  {
    id: '林地扎带编结',
    source: {
      name: '林地扎带编结',
      url: 'https://knots3d.com/zh-CN/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BC%96%E7%BB%93',
      englishName: 'Woodland Zip-tie Lashing',
      englishAliases: ['Cow Hitch Square Lashing'],
      englishUrl: 'https://knots3d.com/en/woodland-zip-tie-lashing-knot',
      englishSlug: 'woodland-zip-tie-lashing-knot',
      aliases: [],
      abok: [],
      activityIds: ['pioneering'],
      typeId: 'lashings',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BC%96%E7%BB%93.webp',
      relatedIds: ['横梁结', '日本四方编结', '四方编结', '林地扎带结', '平结'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：两根杆是直角绑扎对象',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%9E%97%E5%9C%B0%E6%89%8E%E5%B8%A6%E7%BC%96%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：遮蔽物框架是搭建目标',
          },
        ],
      },
    ],
  },
  {
    id: '桅顶结',
    source: {
      name: '桅顶结',
      url: 'https://knots3d.com/zh-CN/%E6%A1%85%E9%A1%B6%E7%BB%93',
      englishName: 'Jury Mast Knot',
      englishAliases: ['Masthead Knot', 'Pitcher Knot'],
      englishUrl: 'https://knots3d.com/en/jury-mast-knot',
      englishSlug: 'jury-mast-knot',
      aliases: ['旗杆结'],
      abok: ['1167'],
      activityIds: ['boating', 'decorative'],
      typeId: 'multi-loop',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%A1%85%E9%A1%B6%E7%BB%93.webp',
      relatedIds: ['手铐结', '万字结', '瓶口结-绳端'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A1%85%E9%A1%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：三根绳索是牵拉材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A1%85%E9%A1%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：桅杆是牵拉固定对象',
          },
        ],
      },
      {
        id: 'mat',
        name: '绳垫、杯垫与装饰垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A1%85%E9%A1%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳垫是装饰结成品',
          },
        ],
      },
    ],
  },
  {
    id: '桑索姆连接结',
    source: {
      name: '桑索姆连接结',
      url: 'https://knots3d.com/zh-CN/%E6%A1%91%E7%B4%A2%E5%A7%86%E8%BF%9E%E6%8E%A5%E7%BB%93',
      englishName: 'Sansome Bend',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/sansome-bend-knot',
      englishSlug: 'sansome-bend-knot',
      aliases: [],
      abok: [],
      activityIds: [],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%A1%91%E7%B4%A2%E5%A7%86%E8%BF%9E%E6%8E%A5%E7%BB%93.webp',
      relatedIds: ['接绳结', '双接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%A1%91%E7%B4%A2%E5%A7%86%E8%BF%9E%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两根绳索',
          },
        ],
      },
    ],
  },
  {
    id: '桩结',
    source: {
      name: '桩结',
      url: 'https://knots3d.com/zh-CN/%E6%A1%A9%E7%BB%93',
      englishName: 'Pile Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/pile-hitch-knot',
      englishSlug: 'pile-hitch-knot',
      aliases: [],
      abok: ['1815'],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%A1%A9%E7%BB%93.webp',
      relatedIds: ['驳船结', '羊角结', '冰柱结', '环编双重半套钩结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A1%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索是系接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A1%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：开口柱或桩是系接对象',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A1%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳环套在柱上',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A1%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：船是系泊对象',
          },
        ],
      },
      {
        id: 'cleat',
        name: '系缆桩、船锚与锚链',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A1%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：码头柱是系泊绳环套接物',
          },
        ],
      },
    ],
  },
  {
    id: '横梁结',
    source: {
      name: '横梁结',
      url: 'https://knots3d.com/zh-CN/%E6%A8%AA%E6%A2%81%E7%BB%93',
      englishName: 'Transom Knot',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/transom-knot',
      englishSlug: 'transom-knot',
      aliases: [],
      abok: ['1255'],
      activityIds: ['pioneering'],
      typeId: 'lashings',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%A8%AA%E6%A2%81%E7%BB%93.webp',
      relatedIds: ['收缩结', '四方编结', '日本四方编结', '林地扎带编结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A8%AA%E6%A2%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：细绳是棚架绑扎材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A8%AA%E6%A2%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：明确使用细绳',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A8%AA%E6%A2%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：两根木棍直角绑扎',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%A8%AA%E6%A2%81%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：圆木棒或木棍是手工材料',
          },
        ],
      },
    ],
  },
  {
    id: '水中称人结',
    source: {
      name: '水中称人结',
      url: 'https://knots3d.com/zh-CN/%E6%B0%B4%E4%B8%AD%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: 'Water Bowline',
      englishAliases: ['Clove Hitch Bowline'],
      englishUrl: 'https://knots3d.com/en/water-bowline-knot',
      englishSlug: 'water-bowline-knot',
      aliases: ['水上称人结'],
      abok: ['1012'],
      activityIds: ['boating'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%B0%B4%E4%B8%AD%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: ['称人结', '双套结-绳端', '双称人结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B0%B4%E4%B8%AD%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：潮湿绳索是制环材料',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B0%B4%E4%B8%AD%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：船只小艇是拖拽对象',
          },
        ],
      },
    ],
  },
  {
    id: '水手收绳结',
    source: {
      name: '水手收绳结',
      url: 'https://knots3d.com/zh-CN/%E6%B0%B4%E6%89%8B%E6%94%B6%E7%BB%B3%E7%BB%93',
      englishName: "Sailor's Coil",
      englishAliases: ['Ground-line Coil'],
      englishUrl: 'https://knots3d.com/en/sailors-coil-knot',
      englishSlug: 'sailors-coil-knot',
      aliases: ['水手收绳圈'],
      abok: ['3098'],
      activityIds: ['rope-care', 'boating'],
      typeId: 'coiling',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%B0%B4%E6%89%8B%E6%94%B6%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['束帆收绳结', '消防员收绳结', '天线袋口结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B0%B4%E6%89%8B%E6%94%B6%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是盘绕对象',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B0%B4%E6%89%8B%E6%94%B6%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：钩是盘绳悬挂物',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B0%B4%E6%89%8B%E6%94%B6%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：船是存放绳索的场景载体',
          },
        ],
      },
    ],
  },
  {
    id: '水结',
    source: {
      name: '水结',
      url: 'https://knots3d.com/zh-CN/%E6%B0%B4%E7%BB%93',
      englishName: 'Water Knot',
      englishAliases: ['Tape Knot', 'Grass Knot', 'Ring Bend', 'Rewoven Overhand Knot'],
      englishUrl: 'https://knots3d.com/en/water-knot',
      englishSlug: 'water-knot',
      aliases: ['环固结'],
      abok: ['296'],
      activityIds: ['military', 'caving', 'climbing', 'arborist', 'fire-rescue'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%B0%B4%E7%BB%93.webp',
      relatedIds: ['反手结', '八字连接结', '反手连接结'],
    },
    objects: [
      {
        id: 'webbing',
        name: '扁带与织带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B0%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：扁带两端是连接材料',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B0%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：扁带用于搭建走绳锚点',
          },
        ],
      },
      {
        id: 'stretcher',
        name: '担架与吊带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B0%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：制成应急扁带吊带',
          },
        ],
      },
    ],
  },
  {
    id: '汉森圈结',
    source: {
      name: '汉森圈结',
      url: 'https://knots3d.com/zh-CN/%E6%B1%89%E6%A3%AE%E5%9C%88%E7%BB%93',
      englishName: 'Hanson Loop',
      englishAliases: ['Hanson Knot'],
      englishUrl: 'https://knots3d.com/en/hanson-loop-knot',
      englishSlug: 'hanson-loop-knot',
      aliases: [],
      abok: [],
      activityIds: ['scouting'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%B1%89%E6%A3%AE%E5%9C%88%E7%BB%93.webp',
      relatedIds: ['称人结', '络头结', '双龙结', '斯科特锁定称人结', '齐柏林环-结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B1%89%E6%A3%AE%E5%9C%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳端制成环',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B1%89%E6%A3%AE%E5%9C%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成固定绳环',
          },
        ],
      },
    ],
  },
  {
    id: '法里蒙德摩擦结',
    source: {
      name: '法里蒙德摩擦结',
      url: 'https://knots3d.com/zh-CN/%E6%B3%95%E9%87%8C%E8%92%99%E5%BE%B7%E6%91%A9%E6%93%A6%E7%BB%93',
      englishName: 'Farrimond Friction Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/farrimond-friction-hitch-knot',
      englishSlug: 'farrimond-friction-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['camping'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%B3%95%E9%87%8C%E8%92%99%E5%BE%B7%E6%91%A9%E6%93%A6%E7%BB%93.webp',
      relatedIds: ['营钉结', '塔巴克结', '普鲁士抓结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B3%95%E9%87%8C%E8%92%99%E5%BE%B7%E6%91%A9%E6%93%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：受力绳索是固定对象',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B3%95%E9%87%8C%E8%92%99%E5%BE%B7%E6%91%A9%E6%93%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：无需穿过全长不否定细绳存在；细绳仍是打结材料',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B3%95%E9%87%8C%E8%92%99%E5%BE%B7%E6%91%A9%E6%93%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 8,
            note: '逐条语义核对：两棵树之间架晾衣绳',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B3%95%E9%87%8C%E8%92%99%E5%BE%B7%E6%91%A9%E6%93%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：形成可调绳环',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B3%95%E9%87%8C%E8%92%99%E5%BE%B7%E6%91%A9%E6%93%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：露营遮蔽物绳是张紧用途',
          },
        ],
      },
      {
        id: 'guyline',
        name: '营绳与地钉',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B3%95%E9%87%8C%E8%92%99%E5%BE%B7%E6%91%A9%E6%93%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 7,
            note: '逐条语义核对：防水布风绳系到地钉',
          },
        ],
      },
    ],
  },
  {
    id: '波尔多滑轮结',
    source: {
      name: '波尔多滑轮结',
      url: 'https://knots3d.com/zh-CN/%E6%B3%A2%E5%B0%94%E5%A4%9A%E6%BB%91%E8%BD%AE%E7%BB%93',
      englishName: 'Poldo Tackle',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/poldo-tackle-knot',
      englishSlug: 'poldo-tackle-knot',
      aliases: ['波尔多索结', '波尔多系统'],
      abok: [],
      activityIds: ['fire-rescue', 'camping'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%B3%A2%E5%B0%94%E5%A4%9A%E6%BB%91%E8%BD%AE%E7%BB%93.webp',
      relatedIds: ['车夫结', '快速车夫结', '伏都结', '称人结', '八字套结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B3%A2%E5%B0%94%E5%A4%9A%E6%BB%91%E8%BD%AE%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是张紧对象',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B3%A2%E5%B0%94%E5%A4%9A%E6%BB%91%E8%BD%AE%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：柱子是晾衣绳支撑物',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B3%A2%E5%B0%94%E5%A4%9A%E6%BB%91%E8%BD%AE%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：树是晾衣绳支撑物',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B3%A2%E5%B0%94%E5%A4%9A%E6%BB%91%E8%BD%AE%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：防水布或庇护所绳索是收紧对象',
          },
        ],
      },
    ],
  },
  {
    id: '活称人结',
    source: {
      name: '活称人结',
      url: 'https://knots3d.com/zh-CN/%E6%B4%BB%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: 'Running Bowline',
      englishAliases: ['Running Bowling Knot'],
      englishUrl: 'https://knots3d.com/en/running-bowline-knot',
      englishSlug: 'running-bowline-knot',
      aliases: [],
      abok: ['1117'],
      activityIds: ['arborist', 'boating'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%B4%BB%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: ['称人结', '滑结', '牧童结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B4%BB%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：绳索是吊起拖拽材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B4%BB%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：柱或桩是套取对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B4%BB%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：成捆树枝是收紧搬运对象',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B4%BB%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 8,
            note: '逐条语义核对：秋千是悬挂对象',
          },
        ],
      },
    ],
  },
  {
    id: '活索结',
    source: {
      name: '活索结',
      url: 'https://knots3d.com/zh-CN/%E6%B4%BB%E7%B4%A2%E7%BB%93',
      englishName: 'Mooring Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/mooring-hitch-knot',
      englishSlug: 'mooring-hitch-knot',
      aliases: ['码头索'],
      abok: [],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%B4%BB%E7%B4%A2%E7%BB%93.webp',
      relatedIds: ['缰绳套钩结', '马槽结', '西伯利亚套结', '活称人结', '牛索结', '马贼索-结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B4%BB%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索系在栏杆柱上',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B4%BB%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：栏杆或柱是系附对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B4%BB%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：船是临时系泊对象',
          },
        ],
      },
      {
        id: 'cleat',
        name: '系缆桩、船锚与锚链',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B4%BB%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：码头柱是系泊固定物',
          },
        ],
      },
    ],
  },
  {
    id: '海洋垫结',
    source: {
      name: '海洋垫结',
      url: 'https://knots3d.com/zh-CN/%E6%B5%B7%E6%B4%8B%E5%9E%AB%E7%BB%93',
      englishName: 'Ocean Plait',
      englishAliases: ['Ocean Plat', 'Ocean Braid Mat', 'Ocean Mat', 'Ocean Plait Mat'],
      englishUrl: 'https://knots3d.com/en/ocean-plait-knot',
      englishSlug: 'ocean-plait-knot',
      aliases: ['海洋垫', '浪花辫状结', '海洋褶垫'],
      abok: ['2243'],
      activityIds: ['decorative'],
      typeId: 'mats',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%B5%B7%E6%B4%8B%E5%9E%AB%E7%BB%93.webp',
      relatedIds: ['卡里克垫结', '凯尔特结', '土耳其头垫结-3l5b', '土耳其头垫结-5l4b'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B5%B7%E6%B4%8B%E5%9E%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：较粗绳索是门垫编织材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B5%B7%E6%B4%8B%E5%9E%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳是垫子编织材料',
          },
        ],
      },
      {
        id: 'sail-rigging',
        name: '帆具与帆索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B5%B7%E6%B4%8B%E5%9E%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：磨损帆脚索是改制材料，非新帆的系附用途',
          },
        ],
      },
      {
        id: 'mat',
        name: '绳垫、杯垫与装饰垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B5%B7%E6%B4%8B%E5%9E%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：桌垫杯垫隔热垫是成品',
          },
        ],
      },
    ],
  },
  {
    id: '消防员收绳结',
    source: {
      name: '消防员收绳结',
      url: 'https://knots3d.com/zh-CN/%E6%B6%88%E9%98%B2%E5%91%98%E6%94%B6%E7%BB%B3%E7%BB%93',
      englishName: "Fireman's Coil",
      englishAliases: ['Fireman Coil'],
      englishUrl: 'https://knots3d.com/en/firemans-coil-knot',
      englishSlug: 'firemans-coil-knot',
      aliases: ['双滑绳圈'],
      abok: ['3094'],
      activityIds: ['fire-rescue', 'rope-care'],
      typeId: 'coiling',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%B6%88%E9%98%B2%E5%91%98%E6%94%B6%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['束帆收绳结', '水手收绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B6%88%E9%98%B2%E5%91%98%E6%94%B6%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是盘绕储存对象',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B6%88%E9%98%B2%E5%91%98%E6%94%B6%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：钩子是盘绳存放支撑',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E6%B6%88%E9%98%B2%E5%91%98%E6%94%B6%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：船是绳索整理的场景载体',
          },
        ],
      },
    ],
  },
  {
    id: '消防员椅结',
    source: {
      name: '消防员椅结',
      url: 'https://knots3d.com/zh-CN/%E6%B6%88%E9%98%B2%E5%91%98%E6%A4%85%E7%BB%93',
      englishName: "Fireman's Chair",
      englishAliases: ['Chair Knot', 'Man-o-War Sheepshank'],
      englishUrl: 'https://knots3d.com/en/firemans-chair-knot',
      englishSlug: 'firemans-chair-knot',
      aliases: ['椅结'],
      abok: ['1157'],
      activityIds: ['fire-rescue'],
      typeId: 'multi-loop',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E6%B6%88%E9%98%B2%E5%91%98%E6%A4%85%E7%BB%93.webp',
      relatedIds: ['手铐结', '缩短结', '西班牙称人结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B6%88%E9%98%B2%E5%91%98%E6%A4%85%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：绳索是救援座椅或担架材料',
          },
        ],
      },
      {
        id: 'stretcher',
        name: '担架与吊带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B6%88%E9%98%B2%E5%91%98%E6%A4%85%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：制成应急吊带',
          },
        ],
      },
    ],
  },
  {
    id: '渔人结',
    source: {
      name: '渔人结',
      url: 'https://knots3d.com/zh-CN/%E6%B8%94%E4%BA%BA%E7%BB%93',
      englishName: "Fisherman's Knot",
      englishAliases: [
        "Waterman's Knot",
        "Angler's Knot",
        "Englishman's Knot",
        'English Knot',
        'Halibut Knot',
      ],
      englishUrl: 'https://knots3d.com/en/fishermans-knot',
      englishSlug: 'fishermans-knot',
      aliases: ['拖曳结', '英人结', '英式结', '单渔人结'],
      abok: ['293'],
      activityIds: ['fishing'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%B8%94%E4%BA%BA%E7%BB%93.webp',
      relatedIds: ['双渔人结', '捕兽结', '手足结', '反手结', '三重渔人结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：连接两条绳索',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：连接两条细绳',
          },
        ],
      },
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条鱼线',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：项链手链细绳组成闭合绳环',
          },
        ],
      },
      {
        id: 'bracelet',
        name: '手链与腕带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：用于可调节手链',
          },
        ],
      },
      {
        id: 'necklace',
        name: '项链与吊坠',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：用于可调节项链',
          },
        ],
      },
      {
        id: 'jewelry',
        name: '珠宝与首饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B8%94%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：明确制作编织首饰',
          },
        ],
      },
    ],
  },
  {
    id: '温莎结',
    source: {
      name: '温莎结',
      url: 'https://knots3d.com/zh-CN/%E6%B8%A9%E8%8E%8E%E7%BB%93',
      englishName: 'Windsor',
      englishAliases: ['Full Windsor', 'Double Windsor'],
      englishUrl: 'https://knots3d.com/en/windsor-knot',
      englishSlug: 'windsor-knot',
      aliases: ['全温莎结', '双温莎结'],
      abok: [],
      activityIds: ['neckties'],
      typeId: 'special',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%B8%A9%E8%8E%8E%E7%BB%93.webp',
      relatedIds: ['半温莎结'],
    },
    objects: [
      {
        id: 'tie',
        name: '领带、领巾与围巾',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%B8%A9%E8%8E%8E%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：明确系领带',
          },
        ],
      },
    ],
  },
  {
    id: '滑八字结',
    source: {
      name: '滑八字结',
      url: 'https://knots3d.com/zh-CN/%E6%BB%91%E5%85%AB%E5%AD%97%E7%BB%93',
      englishName: 'Slip Figure Eight',
      englishAliases: ['Slipped Figure Eight Knot'],
      englishUrl: 'https://knots3d.com/en/slip-figure-eight-knot',
      englishSlug: 'slip-figure-eight-knot',
      aliases: ['活八字结'],
      abok: [],
      activityIds: ['military'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%BB%91%E5%85%AB%E5%AD%97%E7%BB%93.webp',
      relatedIds: ['滑结', '八字结', '西伯利亚套结'],
    },
    objects: [],
  },
  {
    id: '滑拉普结',
    source: {
      name: '滑拉普结',
      url: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%8B%89%E6%99%AE%E7%BB%93',
      englishName: 'Slipped Lapp Knot',
      englishAliases: [
        'Slipped Lapp Bend',
        'Adjustable Drawstring Knot',
        'Gym Shorts Knot',
        'Quick Hitch',
      ],
      englishUrl: 'https://knots3d.com/en/slipped-lapp-knot',
      englishSlug: 'slipped-lapp-knot',
      aliases: [],
      abok: ['1224'],
      activityIds: [],
      typeId: 'binding',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%BB%91%E6%8B%89%E6%99%AE%E7%BB%93.webp',
      relatedIds: ['拉普结', '快速连接结', '活索结', '滑接绳结', '接绳结', '哥萨克结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%8B%89%E6%99%AE%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索围绕物体收紧',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%8B%89%E6%99%AE%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：包裹或货物是捆绑对象',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%8B%89%E6%99%AE%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：抽绳袋麻袋是封闭对象',
          },
        ],
      },
    ],
  },
  {
    id: '滑接绳结',
    source: {
      name: '滑接绳结',
      url: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%8E%A5%E7%BB%B3%E7%BB%93',
      englishName: 'Slipped Sheet Bend',
      englishAliases: ["Tiller's Hitch", 'Quick Release Sheet Bend', 'Slipped Becket Bend'],
      englishUrl: 'https://knots3d.com/en/slipped-sheet-bend-knot',
      englishSlug: 'slipped-sheet-bend-knot',
      aliases: [],
      abok: [],
      activityIds: ['arborist', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%BB%91%E6%8E%A5%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['接绳结', '吊床结', '滑拉普结', '快速连接结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两根绳索',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：篷布角环是连接物',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%8E%A5%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：篷布是系绳对象',
          },
        ],
      },
    ],
  },
  {
    id: '滑收缩结',
    source: {
      name: '滑收缩结',
      url: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%94%B6%E7%BC%A9%E7%BB%93',
      englishName: 'Slipped Constrictor Knot',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/slipped-constrictor-knot',
      englishSlug: 'slipped-constrictor-knot',
      aliases: [],
      abok: ['1250'],
      activityIds: ['camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%BB%91%E6%94%B6%E7%BC%A9%E7%BB%93.webp',
      relatedIds: ['收缩结', '天线袋口滑结', '滑米勒结', '双套滑结', '收缩结-绳中'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：木棍是捆扎对象',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：捆包是捆扎对象',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：袋子是捆扎对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E6%94%B6%E7%BC%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：软管管子是临时夹紧对象',
          },
        ],
      },
    ],
  },
  {
    id: '滑米勒结',
    source: {
      name: '滑米勒结',
      url: 'https://knots3d.com/zh-CN/%E6%BB%91%E7%B1%B3%E5%8B%92%E7%BB%93',
      englishName: "Slipped Miller's Knot",
      englishAliases: ['Slipped Sack Knot', 'Slipped Bag Knot'],
      englishUrl: 'https://knots3d.com/en/slipped-millers-knot',
      englishSlug: 'slipped-millers-knot',
      aliases: ['滑磨坊结', '滑袋口结'],
      abok: [],
      activityIds: ['camping'],
      typeId: 'binding',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%BB%91%E7%B1%B3%E5%8B%92%E7%BB%93.webp',
      relatedIds: ['米勒结', '天线袋口滑结', '滑收缩结'],
    },
    objects: [
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E7%B1%B3%E5%8B%92%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：袋口麻袋口是封闭对象',
          },
        ],
      },
    ],
  },
  {
    id: '滑结',
    source: {
      name: '滑结',
      url: 'https://knots3d.com/zh-CN/%E6%BB%91%E7%BB%93',
      englishName: 'Simple Overhand Noose',
      englishAliases: ['Slipped Overhand Knot', 'Slip Knot', 'Running Knot', 'Simple Noose'],
      englishUrl: 'https://knots3d.com/en/simple-overhand-noose-knot',
      englishSlug: 'simple-overhand-noose-knot',
      aliases: ['活结', '简单的活索'],
      abok: ['1114'],
      activityIds: ['essentials', 'theater-film', 'arborist'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E6%BB%91%E7%BB%93.webp',
      relatedIds: ['锁链结', '反手结', '牧童结'],
    },
    objects: [
      {
        id: 'pet-lead',
        name: '动物牵绳与缰绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E6%BB%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：制成狗用牵引绳或训练牵绳',
          },
        ],
      },
    ],
  },
  {
    id: '点滴环结',
    source: {
      name: '点滴环结',
      url: 'https://knots3d.com/zh-CN/%E7%82%B9%E6%BB%B4%E7%8E%AF%E7%BB%93',
      englishName: 'Dropper Loop',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/dropper-loop-knot',
      englishSlug: 'dropper-loop-knot',
      aliases: ['子线环结', '血圈结', '滴管环结'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%82%B9%E6%BB%B4%E7%8E%AF%E7%BB%93.webp',
      relatedIds: ['手足结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%82%B9%E6%BB%B4%E7%8E%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线是支钩的载体',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%82%B9%E6%BB%B4%E7%8E%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：钓线上的独立绳环为线制圈，非外接硬环',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%82%B9%E6%BB%B4%E7%8E%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：毛钩是增加的钓具',
          },
        ],
      },
    ],
  },
  {
    id: '爱德华兹称人结',
    source: {
      name: '爱德华兹称人结',
      url: 'https://knots3d.com/zh-CN/%E7%88%B1%E5%BE%B7%E5%8D%8E%E5%85%B9%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: 'Edwards Bowline',
      englishAliases: ["Butler's Bowline", "Harry Butler's Yosemite Bowline"],
      englishUrl: 'https://knots3d.com/en/edwards-bowline-knot',
      englishSlug: 'edwards-bowline-knot',
      aliases: [],
      abok: [],
      activityIds: ['climbing'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%88%B1%E5%BE%B7%E5%8D%8E%E5%85%B9%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: [
        '称人结',
        '牛仔称人结',
        '约塞米蒂称人结',
        '斯科特锁定称人结',
        '双称人结',
        '水中称人结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%88%B1%E5%BE%B7%E5%8D%8E%E5%85%B9%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳端制成环',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%88%B1%E5%BE%B7%E5%8D%8E%E5%85%B9%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成固定绳环',
          },
        ],
      },
      {
        id: 'harness',
        name: '安全带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%88%B1%E5%BE%B7%E5%8D%8E%E5%85%B9%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：安全带是系入对象',
          },
        ],
      },
    ],
  },
  {
    id: '牛仔称人结',
    source: {
      name: '牛仔称人结',
      url: 'https://knots3d.com/zh-CN/%E7%89%9B%E4%BB%94%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: 'Cowboy Bowline',
      englishAliases: [
        'Left-hand Bowline',
        'Dutch Bowline',
        'Dutch Marine Bowline',
        'Winter Bowline',
      ],
      englishUrl: 'https://knots3d.com/en/cowboy-bowline-knot',
      englishSlug: 'cowboy-bowline-knot',
      aliases: ['荷兰称人结'],
      abok: ['1034.5'],
      activityIds: ['climbing', 'boating'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%89%9B%E4%BB%94%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: [
        '称人结',
        '水中称人结',
        '斯科特锁定称人结',
        '约塞米蒂称人结',
        '爱德华兹称人结',
        '称人结-快速',
        '双称人结',
        '活称人结',
        '接绳结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E4%BB%94%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳端制成环',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E4%BB%94%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：树干是吊索环绕对象',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E4%BB%94%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成固定绳环',
          },
        ],
      },
    ],
  },
  {
    id: '牛眼结-绳中',
    source: {
      name: '牛眼结（绳中）',
      url: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E4%B8%AD',
      englishName: 'Bull Hitch (Bight)',
      englishAliases: ['Cow Hitch Variant'],
      englishUrl: 'https://knots3d.com/en/bull-hitch-bight-knot',
      englishSlug: 'bull-hitch-bight-knot',
      aliases: [],
      abok: [],
      activityIds: ['climbing', 'boating', 'decorative', 'camping'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E4%B8%AD.webp',
      relatedIds: ['牛眼结-绳端', '牛索结', '皮维奇结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索连接柱或环',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：细绳是系接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：杆是工艺项目起始支撑',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：绳环是挂绳连接对象',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：与杆并列的环为外接支撑物',
          },
        ],
      },
      {
        id: 'necklace',
        name: '项链与吊坠',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：项链吊坠是成品用途',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：钥匙链是成品用途',
          },
        ],
      },
      {
        id: 'decorative-item',
        name: '装饰挂件与灯饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：挂饰是悬挂对象；此处为首饰小挂件',
          },
        ],
      },
    ],
  },
  {
    id: '牛眼结-绳端',
    source: {
      name: '牛眼结（绳端）',
      url: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E7%AB%AF',
      englishName: 'Bull Hitch (End)',
      englishAliases: ['Cow Hitch Variant'],
      englishUrl: 'https://knots3d.com/en/bull-hitch-end-knot',
      englishSlug: 'bull-hitch-end-knot',
      aliases: [],
      abok: [],
      activityIds: ['climbing', 'boating', 'decorative', 'camping'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E7%AB%AF.webp',
      relatedIds: ['牛眼结-绳中', '牛索结', '改良牛索结', '皮维奇结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索连接柱或环',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：细绳是挂饰连接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：栏杆或杆是固定对象',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱或环为外接物',
          },
        ],
      },
      {
        id: 'necklace',
        name: '项链与吊坠',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：吊坠是系接对象',
          },
        ],
      },
      {
        id: 'jewelry',
        name: '珠宝与首饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：首饰是成品用途',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：挂绳系到环或配件',
          },
        ],
      },
      {
        id: 'decorative-item',
        name: '装饰挂件与灯饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%9C%BC%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：挂饰是系接对象；此处为首饰小挂件',
          },
        ],
      },
    ],
  },
  {
    id: '牛索结',
    source: {
      name: '牛索结',
      url: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
      englishName: 'Cow Hitch',
      englishAliases: [
        "Lark's Head",
        "Lark's Foot",
        'Reverse Double Half Hitch',
        'Double Stitch',
        'Girth Hitch',
        'Deadeye Hitch',
      ],
      englishUrl: 'https://knots3d.com/en/cow-hitch-knot',
      englishSlug: 'cow-hitch-knot',
      aliases: ['雀头结', '双合结'],
      abok: ['1673'],
      activityIds: ['decorative'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%89%9B%E7%B4%A2%E7%BB%93.webp',
      relatedIds: ['雀头结', '改良牛索结', '钩结', '普鲁士抓结', '牛眼结-绳中', '皮维奇结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：绳索系到杆',
          },
        ],
      },
      {
        id: 'webbing',
        name: '扁带与织带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 10,
            note: '逐条语义核对：扁带环是攀登用套接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱是绳环连接物',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 10,
            note: '逐条语义核对：树是扁带环套接物',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳环是连接材料',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：与钩柱并列的环为外接物',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 12,
            note: '逐条语义核对：卸扣是绳索系接对象',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：钩子是物品悬挂支撑',
          },
        ],
      },
      {
        id: 'necklace',
        name: '项链与吊坠',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：项链绳承载戒指',
          },
        ],
      },
      {
        id: 'bag',
        name: '包',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 11,
            note: '逐条语义核对：背包是装备固定载体',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：挂绳环连接电子设备或工具',
          },
        ],
      },
      {
        id: 'tag',
        name: '徽章与标牌',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：行李牌是系挂物',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：把手是行李牌或钥匙环系接对象',
          },
        ],
      },
      {
        id: 'curtain',
        name: '窗帘与挂毯',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 8,
            note: '逐条语义核对：窗帘或剧场幕布是系挂对象',
          },
        ],
      },
      {
        id: 'decorative-item',
        name: '装饰挂件与灯饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 14,
            note: '逐条语义核对：挂饰是项链制作中的系接物',
          },
        ],
      },
      {
        id: 'pet-lead',
        name: '动物牵绳与缰绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：动物牵引绳是系接对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%9B%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：电子设备或工具是挂绳连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '牧童结',
    source: {
      name: '牧童结',
      url: 'https://knots3d.com/zh-CN/%E7%89%A7%E7%AB%A5%E7%BB%93',
      englishName: 'Lariat Loop',
      englishAliases: ['Honda Knot', 'Bowstring Knot'],
      englishUrl: 'https://knots3d.com/en/lariat-loop-knot',
      englishSlug: 'lariat-loop-knot',
      aliases: ['本田结', '套索结'],
      abok: ['1024'],
      activityIds: [],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%89%A7%E7%AB%A5%E7%BB%93.webp',
      relatedIds: ['活称人结', '滑结', '反手结'],
    },
    objects: [
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%A7%E7%AB%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：制成牧场工作用滑动绳环',
          },
        ],
      },
    ],
  },
  {
    id: '特里林结',
    source: {
      name: '特里林结',
      url: 'https://knots3d.com/zh-CN/%E7%89%B9%E9%87%8C%E6%9E%97%E7%BB%93',
      englishName: 'Trilene Knot',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/trilene-knot',
      englishSlug: 'trilene-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%89%B9%E9%87%8C%E6%9E%97%E7%BB%93.webp',
      relatedIds: ['改进的扭抱结', '拉帕拉结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%B9%E9%87%8C%E6%9E%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线是连接材料',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%B9%E9%87%8C%E6%9E%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼钩是连接对象',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%B9%E9%87%8C%E6%9E%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：拟饵是连接对象',
          },
        ],
      },
      {
        id: 'swivel',
        name: '转环',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%89%B9%E9%87%8C%E6%9E%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：转环是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '猴拳结',
    source: {
      name: '猴拳结',
      url: 'https://knots3d.com/zh-CN/%E7%8C%B4%E6%8B%B3%E7%BB%93',
      englishName: "Monkey's Fist",
      englishAliases: ["Monkey's Paw", 'Slungshot'],
      englishUrl: 'https://knots3d.com/en/monkeys-fist-knot',
      englishSlug: 'monkeys-fist-knot',
      aliases: ['猴掌结', '猴子拳头结'],
      abok: ['2202'],
      activityIds: ['decorative'],
      typeId: 'stoppers',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%8C%B4%E6%8B%B3%E7%BB%93.webp',
      relatedIds: ['抛绳结', '乌利结', '多重反手结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%8C%B4%E6%8B%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳端是加重对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%8C%B4%E6%8B%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：树枝是抛绳跨越支撑',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%8C%B4%E6%8B%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：防熊袋是悬挂对象',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%8C%B4%E6%8B%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：秋千是悬挂对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%8C%B4%E6%8B%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 9,
            note: '逐条语义核对：船是抛绳起终点的场景载体',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%8C%B4%E6%8B%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：钥匙扣或拉链头是球结成品用途',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%8C%B4%E6%8B%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：抽屉把手是加重结使用对象',
          },
        ],
      },
      {
        id: 'curtain',
        name: '窗帘与挂毯',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%8C%B4%E6%8B%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：制成窗帘束带或拉绳',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'inferred',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%8C%B4%E6%8B%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '语义待定：此处指流星锤自卫用途；通用工具装备组是否包含此类成品未定义',
          },
        ],
      },
    ],
  },
  {
    id: '环编双重半套钩结',
    source: {
      name: '环编双重半套钩结',
      url: 'https://knots3d.com/zh-CN/%E7%8E%AF%E7%BC%96%E5%8F%8C%E9%87%8D%E5%8D%8A%E5%A5%97%E9%92%A9%E7%BB%93',
      englishName: 'Round Turn & Two Half Hitches',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/round-turn-two-half-hitches-knot',
      englishSlug: 'round-turn-two-half-hitches-knot',
      aliases: ['旋圆双半结', '旋圆两半结'],
      abok: ['1720'],
      activityIds: ['essentials', 'military', 'diving', 'boating'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%8E%AF%E7%BC%96%E5%8F%8C%E9%87%8D%E5%8D%8A%E5%A5%97%E9%92%A9%E7%BB%93.webp',
      relatedIds: ['双半结', '后手套结', '锚结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%8E%AF%E7%BC%96%E5%8F%8C%E9%87%8D%E5%8D%8A%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索是系接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%8E%AF%E7%BC%96%E5%8F%8C%E9%87%8D%E5%8D%8A%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：杆或围栏柱是系接对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%8E%AF%E7%BC%96%E5%8F%8C%E9%87%8D%E5%8D%8A%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：树是系接对象',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%8E%AF%E7%BC%96%E5%8F%8C%E9%87%8D%E5%8D%8A%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：链环或金属环是外接物',
          },
        ],
      },
      {
        id: 'metal-ring',
        name: '金属环',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%8E%AF%E7%BC%96%E5%8F%8C%E9%87%8D%E5%8D%8A%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：原文明确金属环材质',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%8E%AF%E7%BC%96%E5%8F%8C%E9%87%8D%E5%8D%8A%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：货物是固定对象',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%8E%AF%E7%BC%96%E5%8F%8C%E9%87%8D%E5%8D%8A%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：秋千吊床是悬挂对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%8E%AF%E7%BC%96%E5%8F%8C%E9%87%8D%E5%8D%8A%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：船是系泊对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%8E%AF%E7%BC%96%E5%8F%8C%E9%87%8D%E5%8D%8A%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：梯子横档是安全绳固定物',
          },
        ],
      },
    ],
  },
  {
    id: '瑞士腰胯结',
    source: {
      name: '瑞士腰胯结',
      url: 'https://knots3d.com/zh-CN/%E7%91%9E%E5%A3%AB%E8%85%B0%E8%83%AF%E7%BB%93',
      englishName: 'Swiss Seat',
      englishAliases: ['Rappel Seat'],
      englishUrl: 'https://knots3d.com/en/swiss-seat-knot',
      englishSlug: 'swiss-seat-knot',
      aliases: ['简易绳降安全结', '绳降腰胯结', '瑞士座椅', '座位席结'],
      abok: [],
      activityIds: ['military', 'caving', 'climbing', 'arborist', 'fire-rescue'],
      typeId: 'special',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%91%9E%E5%A3%AB%E8%85%B0%E8%83%AF%E7%BB%93.webp',
      relatedIds: [],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%91%9E%E5%A3%AB%E8%85%B0%E8%83%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是应急安全带材料',
          },
        ],
      },
      {
        id: 'harness',
        name: '安全带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%91%9E%E5%A3%AB%E8%85%B0%E8%83%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：制成应急安全带，未因缺少成品带而否定自制带',
          },
        ],
      },
      {
        id: 'stretcher',
        name: '担架与吊带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%91%9E%E5%A3%AB%E8%85%B0%E8%83%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：椅式吊带是人员下放载体',
          },
        ],
      },
    ],
  },
  {
    id: '瓦尔多斯坦结',
    source: {
      name: '瓦尔多斯坦结',
      url: 'https://knots3d.com/zh-CN/%E7%93%A6%E5%B0%94%E5%A4%9A%E6%96%AF%E5%9D%A6%E7%BB%93',
      englishName: 'Valdotain Tresse',
      englishAliases: ['VT', 'Vallard Tresse', 'Valdôtain Tresse'],
      englishUrl: 'https://knots3d.com/en/valdotain-tresse-knot',
      englishSlug: 'valdotain-tresse-knot',
      aliases: ['瓦尔多坦结'],
      abok: [],
      activityIds: ['arborist'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%93%A6%E5%B0%94%E5%A4%9A%E6%96%AF%E5%9D%A6%E7%BB%93.webp',
      relatedIds: ['迪斯特尔结', '施瓦本结', '克氏抓结', '米却肯结', '布莱克氏结', '双圈索结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%93%A6%E5%B0%94%E5%A4%9A%E6%96%AF%E5%9D%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：绳索是位置调节对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%93%A6%E5%B0%94%E5%A4%9A%E6%96%AF%E5%9D%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：树是攀爬作业对象，未推定结直接绑树',
          },
        ],
      },
    ],
  },
  {
    id: '瓶口结-绳中',
    source: {
      name: '瓶口结（绳中）',
      url: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E4%B8%AD',
      englishName: 'Jar Sling Knot (bight method)',
      englishAliases: [
        'Bottle Sling Knot',
        'Jug Sling',
        'Spanish Hackamore',
        'Bridle Knot',
        "Moonshiner's Knot",
        'Scoutcraft Knot',
      ],
      englishUrl: 'https://knots3d.com/en/jar-sling-knot-bight-method',
      englishSlug: 'jar-sling-knot-bight-method',
      aliases: ['瓶吊结'],
      abok: ['1142'],
      activityIds: ['camping'],
      typeId: 'binding',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E4%B8%AD.webp',
      relatedIds: ['瓶口结-绳端', '桅顶结', '平结'],
    },
    objects: [
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：树枝是容器悬挂支撑',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳套是绳把手结构材料',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：钩子是容器悬挂支撑',
          },
        ],
      },
      {
        id: 'bottle',
        name: '瓶、罐与桶',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：罐瓶水壶是搬运对象',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：制成搬运用绳把手',
          },
        ],
      },
      {
        id: 'pet-lead',
        name: '动物牵绳与缰绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E4%B8%AD',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：制成马用无嚼子缰绳',
          },
        ],
      },
    ],
  },
  {
    id: '瓶口结-绳端',
    source: {
      name: '瓶口结（绳端）',
      url: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E7%AB%AF',
      englishName: 'Jar Sling Knot (end method)',
      englishAliases: [
        'Bottle Sling Knot',
        'Jug Sling',
        'Spanish Hackamore',
        'Bridle Knot',
        "Moonshiner's Knot",
        'Scoutcraft Knot',
      ],
      englishUrl: 'https://knots3d.com/en/jar-sling-knot-end-method',
      englishSlug: 'jar-sling-knot-end-method',
      aliases: ['瓶吊结'],
      abok: ['1142'],
      activityIds: ['decorative', 'camping'],
      typeId: 'binding',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E7%AB%AF.webp',
      relatedIds: ['瓶口结-绳中', '桅顶结', '平结'],
    },
    objects: [
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：树枝是容器悬挂支撑',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：钩子是容器悬挂支撑',
          },
        ],
      },
      {
        id: 'bottle',
        name: '瓶、罐与桶',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：罐瓶水壶是搬运对象',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：制成搬运用绳把手',
          },
        ],
      },
      {
        id: 'pet-lead',
        name: '动物牵绳与缰绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%93%B6%E5%8F%A3%E7%BB%93-%E7%BB%B3%E7%AB%AF',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：制成马用无嚼子缰绳',
          },
        ],
      },
    ],
  },
  {
    id: '电工结',
    source: {
      name: '电工结',
      url: 'https://knots3d.com/zh-CN/%E7%94%B5%E5%B7%A5%E7%BB%93',
      englishName: "Underwriter's Knot",
      englishAliases: ["Electrician's Knot", 'Two-strand Wall Knot'],
      englishUrl: 'https://knots3d.com/en/underwriters-knot',
      englishSlug: 'underwriters-knot',
      aliases: [],
      abok: ['237'],
      activityIds: [],
      typeId: 'stoppers',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%94%B5%E5%B7%A5%E7%BB%93.webp',
      relatedIds: [],
    },
    objects: [
      {
        id: 'cable',
        name: '电线与线缆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%94%B5%E5%B7%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：电线是应力释放结材料',
          },
        ],
      },
      {
        id: 'lighting',
        name: '灯具',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%94%B5%E5%B7%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：灯具是电源线止端所在设备',
          },
        ],
      },
    ],
  },
  {
    id: '皇冠结',
    source: {
      name: '皇冠结',
      url: 'https://knots3d.com/zh-CN/%E7%9A%87%E5%86%A0%E7%BB%93',
      englishName: 'Crown Knot',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/crown-knot',
      englishSlug: 'crown-knot',
      aliases: ['冠结'],
      abok: [],
      activityIds: ['scouting'],
      typeId: 'special',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%9A%87%E5%86%A0%E7%BB%93.webp',
      relatedIds: ['反穿结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9A%87%E5%86%A0%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳端是防散开处理对象',
          },
        ],
      },
    ],
  },
  {
    id: '皇后克拉拉结',
    source: {
      name: '皇后克拉拉结',
      url: 'https://knots3d.com/zh-CN/%E7%9A%87%E5%90%8E%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
      englishName: 'Queen Clara Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/queen-clara-hitch-knot',
      englishSlug: 'queen-clara-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%9A%87%E5%90%8E%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93.webp',
      relatedIds: ['克拉拉结', '抓紧克拉拉结', '大皇后克拉拉结', '冰柱结', '三套结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%9A%87%E5%90%8E%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是系接与受力对象',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%9A%87%E5%90%8E%E5%85%8B%E6%8B%89%E6%8B%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：圆杆是纵向受力系接物',
          },
        ],
      },
    ],
  },
  {
    id: '皮岑结',
    source: {
      name: '皮岑结',
      url: 'https://knots3d.com/zh-CN/%E7%9A%AE%E5%B2%91%E7%BB%93',
      englishName: 'Pitzen Knot',
      englishAliases: ['Eugene Bend', '16-20 Knot', 'Sixteen-Twenty Knot'],
      englishUrl: 'https://knots3d.com/en/pitzen-knot',
      englishSlug: 'pitzen-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%9A%AE%E5%B2%91%E7%BB%93.webp',
      relatedIds: ['圣地亚哥锁结', '改进的扭抱结', '拉帕拉结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9A%AE%E5%B2%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线是系接材料',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9A%AE%E5%B2%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼钩是系接对象',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9A%AE%E5%B2%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：拟饵是系接对象',
          },
        ],
      },
      {
        id: 'swivel',
        name: '转环',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9A%AE%E5%B2%91%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：转环是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '皮维奇结',
    source: {
      name: '皮维奇结',
      url: 'https://knots3d.com/zh-CN/%E7%9A%AE%E7%BB%B4%E5%A5%87%E7%BB%93',
      englishName: 'Piwich',
      englishAliases: ['Cow Hitch Variant'],
      englishUrl: 'https://knots3d.com/en/piwich-knot',
      englishSlug: 'piwich-knot',
      aliases: [],
      abok: [],
      activityIds: ['decorative'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%9A%AE%E7%BB%B4%E5%A5%87%E7%BB%93.webp',
      relatedIds: ['牛眼结-绳中', '牛眼结-绳端', '牛索结', '改良牛索结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9A%AE%E7%BB%B4%E5%A5%87%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是连接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9A%AE%E7%BB%B4%E5%A5%87%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：杆是系接对象',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9A%AE%E7%BB%B4%E5%A5%87%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：与杆并列的环为外接物',
          },
        ],
      },
      {
        id: 'necklace',
        name: '项链与吊坠',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9A%AE%E7%BB%B4%E5%A5%87%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：吊坠是悬挂对象',
          },
        ],
      },
      {
        id: 'decorative-item',
        name: '装饰挂件与灯饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9A%AE%E7%BB%B4%E5%A5%87%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：挂饰是悬挂对象',
          },
        ],
      },
    ],
  },
  {
    id: '相依套钩结',
    source: {
      name: '相依套钩结',
      url: 'https://knots3d.com/zh-CN/%E7%9B%B8%E4%BE%9D%E5%A5%97%E9%92%A9%E7%BB%93',
      englishName: 'Snuggle Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/snuggle-hitch-knot',
      englishSlug: 'snuggle-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['arborist', 'boating', 'camping'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%9B%B8%E4%BE%9D%E5%A5%97%E9%92%A9%E7%BB%93.webp',
      relatedIds: ['双套结-绳端', '天线袋口结', '帆杆结', '刺网套钩结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9B%B8%E4%BE%9D%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是连接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9B%B8%E4%BE%9D%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：杆或柱是系接对象',
          },
        ],
      },
    ],
  },
  {
    id: '石锚结',
    source: {
      name: '石锚结',
      url: 'https://knots3d.com/zh-CN/%E7%9F%B3%E9%94%9A%E7%BB%93',
      englishName: 'Killick Hitch',
      englishAliases: ['Kelleg Hitch'],
      englishUrl: 'https://knots3d.com/en/killick-hitch-knot',
      englishSlug: 'killick-hitch-knot',
      aliases: ['圆材结'],
      abok: [],
      activityIds: ['arborist', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%9F%B3%E9%94%9A%E7%BB%93.webp',
      relatedIds: ['系木结', '吊装结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9F%B3%E9%94%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索系在石头或重物上',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9F%B3%E9%94%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：杆子是纵向拖拽对象',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9F%B3%E9%94%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：原木是纵向拖拽对象',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%9F%B3%E9%94%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：管道是纵向拖拽对象',
          },
        ],
      },
    ],
  },
  {
    id: '祖母结',
    source: {
      name: '祖母结',
      url: 'https://knots3d.com/zh-CN/%E7%A5%96%E6%AF%8D%E7%BB%93',
      englishName: 'Granny Knot',
      englishAliases: [
        'False Knot',
        "Lubber's Knot",
        'Calf Knot',
        'Booby Knot',
        'Garden Knot',
        'Bourchier Knot',
      ],
      englishUrl: 'https://knots3d.com/en/granny-knot',
      englishSlug: 'granny-knot',
      aliases: ['外行平结'],
      abok: ['1206'],
      activityIds: [],
      typeId: 'binding',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%A5%96%E6%AF%8D%E7%BB%93.webp',
      relatedIds: ['平结', '悲伤结', '贼结', '双半结'],
    },
    objects: [],
  },
  {
    id: '秋千结',
    source: {
      name: '秋千结',
      url: 'https://knots3d.com/zh-CN/%E7%A7%8B%E5%8D%83%E7%BB%93',
      englishName: 'Swing Hitch',
      englishAliases: ['Rope Swing Knot', 'Tire Swing Knot'],
      englishUrl: 'https://knots3d.com/en/swing-hitch-knot',
      englishSlug: 'swing-hitch-knot',
      aliases: [],
      abok: ['1693'],
      activityIds: [],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%A7%8B%E5%8D%83%E7%BB%93.webp',
      relatedIds: ['双套结-绳端', '后手套结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%8B%E5%8D%83%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索是系接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%8B%E5%8D%83%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：水平杆是悬挂支撑',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%8B%E5%8D%83%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：树枝是秋千悬挂支撑',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%8B%E5%8D%83%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：秋千是悬挂对象',
          },
        ],
      },
    ],
  },
  {
    id: '称人结',
    source: {
      name: '称人结',
      url: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: 'Bowline',
      englishAliases: ['Boling Knot', 'Standing Bowline', 'Bowling Knot'],
      englishUrl: 'https://knots3d.com/en/bowline-knot',
      englishSlug: 'bowline-knot',
      aliases: ['帆索结', '布林结', '单套结'],
      abok: ['1010'],
      activityIds: [
        'essentials',
        'military',
        'theater-film',
        'caving',
        'climbing',
        'arborist',
        'fire-rescue',
        'diving',
        'scouting',
        'boating',
      ],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: [
        '称人结-快速',
        '牛仔称人结',
        '水中称人结',
        '斯科特锁定称人结',
        '约塞米蒂称人结',
        '双称人结-绳中',
        '双称人结',
        '三重称人结',
        '接绳结',
        '单套衔接结',
        '并蒂单套衔接结',
        '快解称人结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳端形成环',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：柱是系接对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：两棵树是悬挂支撑',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成固定绳环',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：与柱并列的环为外接物',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：防水布角是连接对象',
          },
        ],
      },
      {
        id: 'ground-anchor',
        name: '地锚',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：地锚是飞机系固物',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：吊床是悬挂对象',
          },
        ],
      },
      {
        id: 'sail-rigging',
        name: '帆具与帆索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：帆角是绳索连接物',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 12,
            note: '逐条语义核对：水平管道是固定物',
          },
        ],
      },
      {
        id: 'decorative-item',
        name: '装饰挂件与灯饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：装饰灯是悬挂物',
          },
        ],
      },
      {
        id: 'pet-lead',
        name: '动物牵绳与缰绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 11,
            note: '逐条语义核对：制成绳索狗绳',
          },
        ],
      },
      {
        id: 'stage',
        name: '舞台布景与配重沙袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 9,
            note: '逐条语义核对：布景是吊起对象',
          },
        ],
      },
      {
        id: 'lighting',
        name: '灯具',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 9,
            note: '逐条语义核对：灯具是吊起对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 9,
            note: '逐条语义核对：舞台设备是吊起对象',
          },
        ],
      },
    ],
  },
  {
    id: '称人结-快速',
    source: {
      name: '称人结（快速）',
      url: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%BF%AB%E9%80%9F',
      englishName: 'Snap Bowline',
      englishAliases: [
        'Quick Bowline',
        'Bowline',
        'Boling Knot',
        'Bowling Knot',
        'Standing Bowline',
      ],
      englishUrl: 'https://knots3d.com/en/snap-bowline-knot',
      englishSlug: 'snap-bowline-knot',
      aliases: ['称人结', '帆索结', '布林结', '单套结'],
      abok: ['1010'],
      activityIds: [
        'military',
        'caving',
        'climbing',
        'arborist',
        'fire-rescue',
        'diving',
        'boating',
      ],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%BF%AB%E9%80%9F.webp',
      relatedIds: [
        '称人结',
        '牛仔称人结',
        '水中称人结',
        '斯科特锁定称人结',
        '约塞米蒂称人结',
        '爱德华兹称人结',
        '双称人结-绳中',
        '双称人结',
        '活称人结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%BF%AB%E9%80%9F',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索末端形成固定环',
          },
        ],
      },
      {
        id: 'ground-anchor',
        name: '地锚',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%BF%AB%E9%80%9F',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：地面锚点是飞机系固物',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%A7%B0%E4%BA%BA%E7%BB%93-%E5%BF%AB%E9%80%9F',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：明确地面锚点，未推断为攀登保护站',
          },
        ],
      },
    ],
  },
  {
    id: '简西蒙结-上',
    source: {
      name: '简西蒙结（上）',
      url: 'https://knots3d.com/zh-CN/%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8A',
      englishName: 'Simple Simon (Over)',
      englishAliases: ['Simple Simon Bend', 'Simple Simon Over Bend'],
      englishUrl: 'https://knots3d.com/en/simple-simon-over-knot',
      englishSlug: 'simple-simon-over-knot',
      aliases: ['上简西蒙结'],
      abok: [],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8A.webp',
      relatedIds: [
        '简西蒙结-下',
        '双简西蒙结-上',
        '双简西蒙结-下',
        '对称简西蒙结',
        '接绳结',
        '平结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8A',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两根绳索',
          },
        ],
      },
    ],
  },
  {
    id: '简西蒙结-下',
    source: {
      name: '简西蒙结（下）',
      url: 'https://knots3d.com/zh-CN/%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8B',
      englishName: 'Simple Simon (Under)',
      englishAliases: ['Simple Simon Bend', 'Simple Simon Under Bend'],
      englishUrl: 'https://knots3d.com/en/simple-simon-under-knot',
      englishSlug: 'simple-simon-under-knot',
      aliases: ['下简西蒙结'],
      abok: [],
      activityIds: ['boating'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8B.webp',
      relatedIds: [
        '简西蒙结-上',
        '双简西蒙结-上',
        '双简西蒙结-下',
        '对称简西蒙结',
        '接绳结',
        '平结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%AE%80%E8%A5%BF%E8%92%99%E7%BB%93-%E4%B8%8B',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两根绳索',
          },
        ],
      },
    ],
  },
  {
    id: '米勒结',
    source: {
      name: '米勒结',
      url: 'https://knots3d.com/zh-CN/%E7%B1%B3%E5%8B%92%E7%BB%93',
      englishName: "Miller's Knot",
      englishAliases: ['Sack Knot', 'Bag Knot'],
      englishUrl: 'https://knots3d.com/en/millers-knot',
      englishSlug: 'millers-knot',
      aliases: ['磨坊结', '袋口结'],
      abok: ['1241'],
      activityIds: ['camping'],
      typeId: 'binding',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%B1%B3%E5%8B%92%E7%BB%93.webp',
      relatedIds: ['滑米勒结', '天线袋口结', '收缩结', '压绑结'],
    },
    objects: [
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%B1%B3%E5%8B%92%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：袋口麻袋口是封闭对象',
          },
        ],
      },
    ],
  },
  {
    id: '米却肯结',
    source: {
      name: '米却肯结',
      url: 'https://knots3d.com/zh-CN/%E7%B1%B3%E5%8D%B4%E8%82%AF%E7%BB%93',
      englishName: 'Michoacan',
      englishAliases: [
        'Michoacán',
        'Meech',
        'Michoacan Friction Hitch',
        'Michoacan Climbing Hitch',
        'Martin Hitch',
      ],
      englishUrl: 'https://knots3d.com/en/michoacan-knot',
      englishSlug: 'michoacan-knot',
      aliases: [],
      abok: [],
      activityIds: ['arborist'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%B1%B3%E5%8D%B4%E8%82%AF%E7%BB%93.webp',
      relatedIds: ['迪斯特尔结', '施瓦本结', '瓦尔多斯坦结', '布莱克氏结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%B1%B3%E5%8D%B4%E8%82%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是抓握对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%B1%B3%E5%8D%B4%E8%82%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：攀树是明示作业场景，未推定该结直接绑树',
          },
        ],
      },
    ],
  },
  {
    id: '系木结',
    source: {
      name: '系木结',
      url: 'https://knots3d.com/zh-CN/%E7%B3%BB%E6%9C%A8%E7%BB%93',
      englishName: 'Timber Hitch',
      englishAliases: ["Bowyer's Knot", "Lumberman's Knot", "Countryman's Knot"],
      englishUrl: 'https://knots3d.com/en/timber-hitch-knot',
      englishSlug: 'timber-hitch-knot',
      aliases: ['圆材结'],
      abok: ['1665'],
      activityIds: ['essentials', 'pioneering', 'arborist', 'fire-rescue', 'scouting', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%B3%BB%E6%9C%A8%E7%BB%93.webp',
      relatedIds: ['石锚结', '十字编结', '吊装结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%B3%BB%E6%9C%A8%E7%BB%93',
            field: 'common-uses',
            useIndex: 8,
            note: '逐条语义核对：绳索是拖拽材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%B3%BB%E6%9C%A8%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：杆是拖拽对象',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%B3%BB%E6%9C%A8%E7%BB%93',
            field: 'common-uses',
            useIndex: 9,
            note: '逐条语义核对：圆木是系绳拉动对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%B3%BB%E6%9C%A8%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：两棵树是晾衣绳或脊绳架设支撑',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%B3%BB%E6%9C%A8%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：管子是拖拽对象',
          },
        ],
      },
    ],
  },
  {
    id: '约塞米蒂称人结',
    source: {
      name: '约塞米蒂称人结',
      url: 'https://knots3d.com/zh-CN/%E7%BA%A6%E5%A1%9E%E7%B1%B3%E8%92%82%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: 'Yosemite Bowline',
      englishAliases: ['Bowline with Yosemite Finish', 'Retraced Bowline', 'Tucked Bowline'],
      englishUrl: 'https://knots3d.com/en/yosemite-bowline-knot',
      englishSlug: 'yosemite-bowline-knot',
      aliases: ['约塞米蒂布林结'],
      abok: [],
      activityIds: ['caving', 'climbing', 'arborist'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%BA%A6%E5%A1%9E%E7%B1%B3%E8%92%82%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: [
        '称人结',
        '八字返穿结',
        '斯科特锁定称人结',
        '双称人结',
        '爱德华兹称人结',
        '双称人结-回穿',
      ],
    },
    objects: [
      {
        id: 'harness',
        name: '安全带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E7%BA%A6%E5%A1%9E%E7%B1%B3%E8%92%82%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：安全带是系入对象',
          },
        ],
      },
    ],
  },
  {
    id: '络头结',
    source: {
      name: '络头结',
      url: 'https://knots3d.com/zh-CN/%E7%BB%9C%E5%A4%B4%E7%BB%93',
      englishName: 'Perfection Loop',
      englishAliases: ["Angler's Loop"],
      englishUrl: 'https://knots3d.com/en/perfection-loop-knot',
      englishSlug: 'perfection-loop-knot',
      aliases: ['完美环'],
      abok: ['1017'],
      activityIds: ['fishing'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%BB%9C%E5%A4%B4%E7%BB%93.webp',
      relatedIds: ['双龙结', '称人结', '双反手环-结', '汉森圈结', '齐柏林环-结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%9C%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：绳索是末端环材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%9C%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：细绳是末端环材料',
          },
        ],
      },
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%9C%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线前导末端形成环',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%9C%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：拟饵是系接对象',
          },
        ],
      },
    ],
  },
  {
    id: '绞架结',
    source: {
      name: '绞架结',
      url: 'https://knots3d.com/zh-CN/%E7%BB%9E%E6%9E%B6%E7%BB%93',
      englishName: 'Scaffold Knot',
      englishAliases: ['Triple Overhand Noose'],
      englishUrl: 'https://knots3d.com/en/scaffold-knot',
      englishSlug: 'scaffold-knot',
      aliases: ['三重反手套索结'],
      abok: ['1120'],
      activityIds: ['climbing', 'boating'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%BB%9E%E6%9E%B6%E7%BB%93.webp',
      relatedIds: ['双圈索结', '三重反手结', '𢃇缆结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%9E%E6%9E%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是连接材料',
          },
        ],
      },
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%9E%E6%9E%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：鱼线是鱼钩连接材料',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%9E%E6%9E%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：圆环是外接物',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%9E%E6%9E%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：钩环是绳索连接物',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%9E%E6%9E%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：此条为绳索五金连接，钩不局限于次条鱼钩',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%9E%E6%9E%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：鱼钩是钓线连接对象',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%9E%E6%9E%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：拟饵是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '绳针结',
    source: {
      name: '绳针结',
      url: 'https://knots3d.com/zh-CN/%E7%BB%B3%E9%92%88%E7%BB%93',
      englishName: 'Marlinspike Hitch',
      englishAliases: ['Marlingspike Hitch', 'Boat Knot', 'Rope Ladder Knot'],
      englishUrl: 'https://knots3d.com/en/marlinspike-hitch-knot',
      englishSlug: 'marlinspike-hitch-knot',
      aliases: ['索针结', '绳梯结'],
      abok: ['1789'],
      activityIds: ['boating', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%BB%B3%E9%92%88%E7%BB%93.webp',
      relatedIds: ['滑结', '反手结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%B3%E9%92%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是临时把手制作材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%B3%E9%92%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：木棒或杆穿入环',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%B3%E9%92%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：树是吊床悬挂支撑',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%B3%E9%92%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：登山扣用作穿结插销',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%B3%E9%92%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：吊床是悬挂对象',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%B3%E9%92%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：制成临时把手',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BB%B3%E9%92%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：工具作为收紧杠杆',
          },
        ],
      },
    ],
  },
  {
    id: '缩短结',
    source: {
      name: '缩短结',
      url: 'https://knots3d.com/zh-CN/%E7%BC%A9%E7%9F%AD%E7%BB%93',
      englishName: 'Sheepshank',
      englishAliases: ['Trumpet Knot', 'Catshank', 'Dogshank', 'Kamikaze Knot'],
      englishUrl: 'https://knots3d.com/en/sheepshank-knot',
      englishSlug: 'sheepshank-knot',
      aliases: ['羊脚结', '缩绳结', '神风结'],
      abok: ['1153'],
      activityIds: ['scouting'],
      typeId: 'special',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%BC%A9%E7%9F%AD%E7%BB%93.webp',
      relatedIds: ['敲钟人结', '快速车夫结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BC%A9%E7%9F%AD%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是缩短对象',
          },
        ],
      },
      {
        id: 'lighting',
        name: '灯具',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BC%A9%E7%9F%AD%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：电灯拉绳是缩短对象',
          },
        ],
      },
    ],
  },
  {
    id: '缰绳套钩结',
    source: {
      name: '缰绳套钩结',
      url: 'https://knots3d.com/zh-CN/%E7%BC%B0%E7%BB%B3%E5%A5%97%E9%92%A9%E7%BB%93',
      englishName: 'Halter Hitch',
      englishAliases: ['Quick-Release Knot', 'Quick-Release Hitch', 'Mule Hitch'],
      englishUrl: 'https://knots3d.com/en/halter-hitch-knot',
      englishSlug: 'halter-hitch-knot',
      aliases: ['拴马结', '笼头结'],
      abok: ['1804'],
      activityIds: ['camping'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E7%BC%B0%E7%BB%B3%E5%A5%97%E9%92%A9%E7%BB%93.webp',
      relatedIds: ['马槽结', '西伯利亚套结', '活索结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BC%B0%E7%BB%B3%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：绳索是系接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BC%B0%E7%BB%B3%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱子栏杆是拴马固定物',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BC%B0%E7%BB%B3%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：船或小艇是临时系泊对象',
          },
        ],
      },
      {
        id: 'pet-lead',
        name: '动物牵绳与缰绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BC%B0%E7%BB%B3%E5%A5%97%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：动物牵引绳是固定对象',
          },
        ],
      },
    ],
  },
  {
    id: '羊角结',
    source: {
      name: '羊角结',
      url: 'https://knots3d.com/zh-CN/%E7%BE%8A%E8%A7%92%E7%BB%93',
      englishName: 'Cleat Hitch',
      englishAliases: ['Cleat Knot'],
      englishUrl: 'https://knots3d.com/en/cleat-hitch-knot',
      englishSlug: 'cleat-hitch-knot',
      aliases: ['磁夹板结'],
      abok: [],
      activityIds: ['theater-film', 'boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E7%BE%8A%E8%A7%92%E7%BB%93.webp',
      relatedIds: ['桩结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BE%8A%E8%A7%92%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：绳索参与吊挂系统',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BE%8A%E8%A7%92%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：旗杆是系缆桩所属载体',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BE%8A%E8%A7%92%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：遮阳棚雨棚绳是系接对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BE%8A%E8%A7%92%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：船是系泊对象',
          },
        ],
      },
      {
        id: 'sail-rigging',
        name: '帆具与帆索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BE%8A%E8%A7%92%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：帆脚索是系固对象',
          },
        ],
      },
      {
        id: 'cleat',
        name: '系缆桩、船锚与锚链',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E7%BE%8A%E8%A7%92%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：码头系缆桩是固定物',
          },
        ],
      },
    ],
  },
  {
    id: '背纤结',
    source: {
      name: '背纤结',
      url: 'https://knots3d.com/zh-CN/%E8%83%8C%E7%BA%A4%E7%BB%93',
      englishName: 'Artillery Loop',
      englishAliases: [
        'Manharness Knot',
        'Harness Hitch',
        'Harness Loop',
        "Artilleryman's Knot",
        'Manharness Loop',
        "Belayer's Hitch",
        'Sandy Douglass Knot',
      ],
      englishUrl: 'https://knots3d.com/en/artillery-loop-knot',
      englishSlug: 'artillery-loop-knot',
      aliases: ['苦力结', '炮兵环', '马具环'],
      abok: ['1050'],
      activityIds: ['camping'],
      typeId: 'loops',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E8%83%8C%E7%BA%A4%E7%BB%93.webp',
      relatedIds: ['阿尔卑斯蝴蝶结', '阿尔卑斯蝴蝶结-手法'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%83%8C%E7%BA%A4%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索中间形成环',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%83%8C%E7%BA%A4%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：形成固定绳环',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%83%8C%E7%BA%A4%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：钩子与其他五金件并列为连接物',
          },
        ],
      },
    ],
  },
  {
    id: '自锁车夫结',
    source: {
      name: '自锁车夫结',
      url: 'https://knots3d.com/zh-CN/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93',
      englishName: "Autolocking Trucker's Hitch",
      englishAliases: [
        "Auto Lock Trucker's Hitch",
        "Improved Trucker's Hitch",
        "Improved Lorry Driver's Hitch",
        "Improved Wagoner's Hitch",
        'Power Cinch',
        'Purchase Loop',
        "Ratcheting Trucker's Hitch",
      ],
      englishUrl: 'https://knots3d.com/en/autolocking-truckers-hitch-knot',
      englishSlug: 'autolocking-truckers-hitch-knot',
      aliases: ['改进车夫结'],
      abok: ['2124'],
      activityIds: ['essentials', 'theater-film', 'arborist', 'camping'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93.webp',
      relatedIds: ['车夫结', '快速车夫结', '波尔多滑轮结', '伏都结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：绳索在树间张紧',
          },
        ],
      },
      {
        id: 'webbing',
        name: '扁带与织带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：扁带是张紧材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：柱子是扁带支撑物',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：树是绳索支撑物',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：帐篷防水布脊绳是收紧对象',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：货物是车辆固定对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：船是车顶绑载对象',
          },
        ],
      },
      {
        id: 'bag',
        name: '包',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 10,
            note: '逐条语义核对：包或公文包是摩托车架固定对象',
          },
        ],
      },
      {
        id: 'bedding',
        name: '睡袋与铺盖垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：睡袋气垫是压缩对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%87%AA%E9%94%81%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：露营装备是捆扎对象',
          },
        ],
      },
    ],
  },
  {
    id: '舵副结',
    source: {
      name: '舵副结',
      url: 'https://knots3d.com/zh-CN/%E8%88%B5%E5%89%AF%E7%BB%93',
      englishName: "Midshipman's Hitch",
      englishAliases: ['Rolling Hitch', 'Taut Line Hitch'],
      englishUrl: 'https://knots3d.com/en/midshipmans-hitch-knot',
      englishSlug: 'midshipmans-hitch-knot',
      aliases: ['三套结'],
      abok: ['1855'],
      activityIds: ['essentials', 'scouting', 'boating', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E8%88%B5%E5%89%AF%E7%BB%93.webp',
      relatedIds: ['营钉结', '马格努斯结', '三套结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%88%B5%E5%89%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索是张紧对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%88%B5%E5%89%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：树是系绳支撑',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%88%B5%E5%89%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：帐篷或防水布绳末端制环',
          },
        ],
      },
      {
        id: 'guyline',
        name: '营绳与地钉',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%88%B5%E5%89%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：防水布拉线系到地钉',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%88%B5%E5%89%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：吊床是悬挂对象',
          },
        ],
      },
    ],
  },
  {
    id: '苦力结',
    source: {
      name: '苦力结',
      url: 'https://knots3d.com/zh-CN/%E8%8B%A6%E5%8A%9B%E7%BB%93',
      englishName: "Stevedore's Knot",
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/stevedores-knot',
      englishSlug: 'stevedores-knot',
      aliases: ['装卸结'],
      abok: ['456'],
      activityIds: ['boating'],
      typeId: 'stoppers',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E8%8B%A6%E5%8A%9B%E7%BB%93.webp',
      relatedIds: ['反手结', '八字结', '阿什利止索结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%8B%A6%E5%8A%9B%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：防止绳索滑出滑轮',
          },
        ],
      },
    ],
  },
  {
    id: '营钉结',
    source: {
      name: '营钉结',
      url: 'https://knots3d.com/zh-CN/%E8%90%A5%E9%92%89%E7%BB%93',
      englishName: 'Taut Line Hitch',
      englishAliases: ['Tent-line Hitch', "Rigger's Hitch", 'Adjustable Hitch'],
      englishUrl: 'https://knots3d.com/en/taut-line-hitch-knot',
      englishSlug: 'taut-line-hitch-knot',
      aliases: ['紧绳结', '连钩结', '拉绳结'],
      abok: ['1856'],
      activityIds: ['scouting', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E8%90%A5%E9%92%89%E7%BB%93.webp',
      relatedIds: ['双半结', '舵副结', '马格努斯结', '可调节绳结', '塔巴克结', '法里蒙德摩擦结'],
    },
    objects: [
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%90%A5%E9%92%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：调节帐篷牵绳',
          },
        ],
      },
      {
        id: 'guyline',
        name: '营绳与地钉',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%90%A5%E9%92%89%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：天幕牵绳系到地桩',
          },
        ],
      },
    ],
  },
  {
    id: '葡萄牙称人结',
    source: {
      name: '葡萄牙称人结',
      url: 'https://knots3d.com/zh-CN/%E8%91%A1%E8%90%84%E7%89%99%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: 'Portuguese Bowline',
      englishAliases: ['French Bowline', 'Equalizing Bowline'],
      englishUrl: 'https://knots3d.com/en/portuguese-bowline-knot',
      englishSlug: 'portuguese-bowline-knot',
      aliases: [],
      abok: ['1072'],
      activityIds: ['climbing'],
      typeId: 'multi-loop',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E8%91%A1%E8%90%84%E7%89%99%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: ['西班牙称人结', '双称人结-绳中', '兔耳结', '称人结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E8%91%A1%E8%90%84%E7%89%99%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是锚点连接材料',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E8%91%A1%E8%90%84%E7%89%99%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：两个独立锚点是固定对象',
          },
        ],
      },
      {
        id: 'stretcher',
        name: '担架与吊带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E8%91%A1%E8%90%84%E7%89%99%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：双环吊带是制成物',
          },
        ],
      },
    ],
  },
  {
    id: '蒙特牵引结',
    source: {
      name: '蒙特牵引结',
      url: 'https://knots3d.com/zh-CN/%E8%92%99%E7%89%B9%E7%89%B5%E5%BC%95%E7%BB%93',
      englishName: 'Munter Mule',
      englishAliases: ['Munter Mule Overhand', 'MMO'],
      englishUrl: 'https://knots3d.com/en/munter-mule-knot',
      englishSlug: 'munter-mule-knot',
      aliases: ['用单结锁定的意大利驴耳结', '意大利半结-骡耳结组合结'],
      abok: [],
      activityIds: ['climbing', 'fire-rescue'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E8%92%99%E7%89%B9%E7%89%B5%E5%BC%95%E7%BB%93.webp',
      relatedIds: ['单环结', '超级单环结', '后手套结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%92%99%E7%89%B9%E7%89%B5%E5%BC%95%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：受力绳索是锁定对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%92%99%E7%89%B9%E7%89%B5%E5%BC%95%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：装备调整是临时锁定系统的用途场景，未推定结直接绑装备',
          },
        ],
      },
    ],
  },
  {
    id: '蚊虫结',
    source: {
      name: '蚊虫结',
      url: 'https://knots3d.com/zh-CN/%E8%9A%8A%E8%99%AB%E7%BB%93',
      englishName: 'Gnat Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/gnat-hitch-knot',
      englishSlug: 'gnat-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['arborist', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E8%9A%8A%E8%99%AB%E7%BB%93.webp',
      relatedIds: ['帆脚结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%9A%8A%E8%99%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索是固定材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%9A%8A%E8%99%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：小细绳是连接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%9A%8A%E8%99%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱是连接对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%9A%8A%E8%99%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：树枝是固定对象',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%9A%8A%E8%99%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：环与柱并列为外接物',
          },
        ],
      },
    ],
  },
  {
    id: '西伯利亚套结',
    source: {
      name: '西伯利亚套结',
      url: 'https://knots3d.com/zh-CN/%E8%A5%BF%E4%BC%AF%E5%88%A9%E4%BA%9A%E5%A5%97%E7%BB%93',
      englishName: 'Siberian Hitch',
      englishAliases: ['Evenk Knot'],
      englishUrl: 'https://knots3d.com/en/siberian-hitch-knot',
      englishSlug: 'siberian-hitch-knot',
      aliases: ['鄂温克结'],
      abok: [],
      activityIds: ['camping'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E8%A5%BF%E4%BC%AF%E5%88%A9%E4%BA%9A%E5%A5%97%E7%BB%93.webp',
      relatedIds: ['帆脚滑结', '滑八字结', '可调节绳结', '活索结', '缰绳套钩结', '马槽结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E8%A5%BF%E4%BC%AF%E5%88%A9%E4%BA%9A%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是系接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E8%A5%BF%E4%BC%AF%E5%88%A9%E4%BA%9A%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱是系接对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E8%A5%BF%E4%BC%AF%E5%88%A9%E4%BA%9A%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：树是系接对象',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E8%A5%BF%E4%BC%AF%E5%88%A9%E4%BA%9A%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：天幕脊绳固定到树',
          },
        ],
      },
      {
        id: 'guyline',
        name: '营绳与地钉',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E8%A5%BF%E4%BC%AF%E5%88%A9%E4%BA%9A%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：天幕脊绳是系接对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E8%A5%BF%E4%BC%AF%E5%88%A9%E4%BA%9A%E5%A5%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：装备是临时系住对象',
          },
        ],
      },
    ],
  },
  {
    id: '西南部拉绳结',
    source: {
      name: '西南部拉绳结',
      url: 'https://knots3d.com/zh-CN/%E8%A5%BF%E5%8D%97%E9%83%A8%E6%8B%89%E7%BB%B3%E7%BB%93',
      englishName: 'West Country Lashing',
      englishAliases: [
        'West Country Round Lashing',
        'West Country Sheer Lashing',
        'West Country Shear Lashing',
      ],
      englishUrl: 'https://knots3d.com/en/west-country-lashing-knot',
      englishSlug: 'west-country-lashing-knot',
      aliases: ['长杆结'],
      abok: [],
      activityIds: ['pioneering'],
      typeId: 'lashings',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E8%A5%BF%E5%8D%97%E9%83%A8%E6%8B%89%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['反手结', '平结', '圆周编结', '西部绳端结'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E8%A5%BF%E5%8D%97%E9%83%A8%E6%8B%89%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：两根杆首尾连接',
          },
        ],
      },
    ],
  },
  {
    id: '西班牙称人结',
    source: {
      name: '西班牙称人结',
      url: 'https://knots3d.com/zh-CN/%E8%A5%BF%E7%8F%AD%E7%89%99%E7%A7%B0%E4%BA%BA%E7%BB%93',
      englishName: 'Spanish Bowline',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/spanish-bowline-knot',
      englishSlug: 'spanish-bowline-knot',
      aliases: [],
      abok: ['1087'],
      activityIds: [],
      typeId: 'multi-loop',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E8%A5%BF%E7%8F%AD%E7%89%99%E7%A7%B0%E4%BA%BA%E7%BB%93.webp',
      relatedIds: ['兔耳结', '称人结', '双称人结-绳中', '消防员椅结', '葡萄牙称人结', '三重称人结'],
    },
    objects: [
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E8%A5%BF%E7%8F%AD%E7%89%99%E7%A7%B0%E4%BA%BA%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：两个独立锚点承担分载',
          },
        ],
      },
    ],
  },
  {
    id: '西部绳端结',
    source: {
      name: '西部绳端结',
      url: 'https://knots3d.com/zh-CN/%E8%A5%BF%E9%83%A8%E7%BB%B3%E7%AB%AF%E7%BB%93',
      englishName: 'West Country Whipping',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/west-country-whipping-knot',
      englishSlug: 'west-country-whipping-knot',
      aliases: [],
      abok: ['3458'],
      activityIds: ['rope-care'],
      typeId: 'whipping',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E8%A5%BF%E9%83%A8%E7%BB%B3%E7%AB%AF%E7%BB%93.webp',
      relatedIds: ['惯用绳端结', '西南部拉绳结', '平结', '反手结', '完美绳端结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%A5%BF%E9%83%A8%E7%BB%B3%E7%AB%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索末端是包裹防散开对象',
          },
        ],
      },
    ],
  },
  {
    id: '贝克特结',
    source: {
      name: '贝克特结',
      url: 'https://knots3d.com/zh-CN/%E8%B4%9D%E5%85%8B%E7%89%B9%E7%BB%93',
      englishName: 'Becket Hitch',
      englishAliases: ['Becket Hitch Proper'],
      englishUrl: 'https://knots3d.com/en/becket-hitch-knot',
      englishSlug: 'becket-hitch-knot',
      aliases: [],
      abok: ['1900'],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E8%B4%9D%E5%85%8B%E7%89%B9%E7%BB%93.webp',
      relatedIds: ['接绳结', '吊床结', '滑接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B4%9D%E5%85%8B%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索连接到绳环',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B4%9D%E5%85%8B%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：较粗绳索的环为连接对象',
          },
        ],
      },
      {
        id: 'webbing',
        name: '扁带与织带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B4%9D%E5%85%8B%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：织带绳环是连接对象',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B4%9D%E5%85%8B%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：另一根绳或织带的环是连接对象',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B4%9D%E5%85%8B%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：帆或防水布角环是外接物，未假定金属',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B4%9D%E5%85%8B%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：防水布角环是系接位置',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B4%9D%E5%85%8B%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：吊床是连接对象',
          },
        ],
      },
      {
        id: 'sail-rigging',
        name: '帆具与帆索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B4%9D%E5%85%8B%E7%89%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：帆角环是系接位置',
          },
        ],
      },
    ],
  },
  {
    id: '贼结',
    source: {
      name: '贼结',
      url: 'https://knots3d.com/zh-CN/%E8%B4%BC%E7%BB%93',
      englishName: 'Thief Knot',
      englishAliases: ['Bag Knot', 'Bread Bag Knot'],
      englishUrl: 'https://knots3d.com/en/thief-knot',
      englishSlug: 'thief-knot',
      aliases: ['压缆结'],
      abok: ['1207'],
      activityIds: [],
      typeId: 'binding',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E8%B4%BC%E7%BB%93.webp',
      relatedIds: ['平结', '悲伤结', '祖母结'],
    },
    objects: [
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B4%BC%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：包裹是开启状态检验对象',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B4%BC%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：袋子麻袋是捆扎对象',
          },
        ],
      },
    ],
  },
  {
    id: '超级单环结',
    source: {
      name: '超级单环结',
      url: 'https://knots3d.com/zh-CN/%E8%B6%85%E7%BA%A7%E5%8D%95%E7%8E%AF%E7%BB%93',
      englishName: 'Super Munter',
      englishAliases: ['Monster Munter', 'Double Munter', 'Zigzag Knot'],
      englishUrl: 'https://knots3d.com/en/super-munter-knot',
      englishSlug: 'super-munter-knot',
      aliases: ['超级意大利半结', '超级意大利半扣', '超级蒙特结'],
      abok: ['1195'],
      activityIds: ['arborist', 'fire-rescue'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E8%B6%85%E7%BA%A7%E5%8D%95%E7%8E%AF%E7%BB%93.webp',
      relatedIds: ['单环结', '蒙特牵引结', '后手套结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B6%85%E7%BA%A7%E5%8D%95%E7%8E%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是下降控制材料',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%B6%85%E7%BA%A7%E5%8D%95%E7%8E%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：钩环参与救援负荷控制',
          },
        ],
      },
    ],
  },
  {
    id: '车夫结',
    source: {
      name: '车夫结',
      url: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
      englishName: "Trucker's Hitch",
      englishAliases: [
        "Lorry Driver's Hitch",
        "Harvester's Hitch",
        'Hay Knot',
        "Wagoner's Hitch",
        'Power Cinch',
        'Purchase Loop',
      ],
      englishUrl: 'https://knots3d.com/en/truckers-hitch-knot',
      englishSlug: 'truckers-hitch-knot',
      aliases: [],
      abok: ['2124'],
      activityIds: ['essentials', 'theater-film', 'arborist'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E8%BD%A6%E5%A4%AB%E7%BB%93.webp',
      relatedIds: [
        '自锁车夫结',
        '快速车夫结',
        '中间八字结',
        '伏都结',
        '波尔多滑轮结',
        '阿尔卑斯蝴蝶结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：绳索在树间张紧',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 14,
            note: '逐条语义核对：两柱是晾衣绳支撑物',
          },
        ],
      },
      {
        id: 'timber',
        name: '木材与原木',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 8,
            note: '逐条语义核对：木料是捆绑对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：树是绳索支撑物',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 12,
            note: '逐条语义核对：拖车货架D环是穿绳固定物',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：天幕遮蔽物脊绳是张紧对象',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：货物是车辆固定对象',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：吊床是悬挂对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：独木舟皮划艇是车顶绑载对象',
          },
        ],
      },
      {
        id: 'bedding',
        name: '睡袋与铺盖垫',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 9,
            note: '逐条语义核对：睡袋气垫是压缩对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%A6%E5%A4%AB%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：露营装备是捆扎对象',
          },
        ],
      },
    ],
  },
  {
    id: '轱辘结',
    source: {
      name: '轱辘结',
      url: 'https://knots3d.com/zh-CN/%E8%BD%B1%E8%BE%98%E7%BB%93',
      englishName: 'Arbor Knot',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/arbor-knot',
      englishSlug: 'arbor-knot',
      aliases: [],
      abok: ['1114'],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E8%BD%B1%E8%BE%98%E7%BB%93.webp',
      relatedIds: ['反手结', '牧童结', '加拿大锁结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%B1%E8%BE%98%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线是系接材料',
          },
        ],
      },
      {
        id: 'reel',
        name: '渔线轮',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BD%B1%E8%BE%98%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：渔线轮或轮轴是系接对象',
          },
        ],
      },
    ],
  },
  {
    id: '辫子结',
    source: {
      name: '辫子结',
      url: 'https://knots3d.com/zh-CN/%E8%BE%AB%E5%AD%90%E7%BB%93',
      englishName: 'Single Rope Braid',
      englishAliases: ['Twist Braid', 'Trumpet Cord'],
      englishUrl: 'https://knots3d.com/en/single-rope-braid-knot',
      englishSlug: 'single-rope-braid-knot',
      aliases: [],
      abok: ['2950'],
      activityIds: ['decorative'],
      typeId: 'special',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E8%BE%AB%E5%AD%90%E7%BB%93.webp',
      relatedIds: ['土耳其头垫结-3l5b', '凯尔特结', '领圈结', '锁链结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BE%AB%E5%AD%90%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是装饰编带材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BE%AB%E5%AD%90%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：细绳是缩短装饰对象',
          },
        ],
      },
      {
        id: 'bracelet',
        name: '手链与腕带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BE%AB%E5%AD%90%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：手链是成品用途',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BE%AB%E5%AD%90%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：钥匙扣是成品用途',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BE%AB%E5%AD%90%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：手柄是编织成品',
          },
        ],
      },
      {
        id: 'decorative-item',
        name: '装饰挂件与灯饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BE%AB%E5%AD%90%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：拉链挂饰是装饰成品',
          },
        ],
      },
      {
        id: 'pet-lead',
        name: '动物牵绳与缰绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BE%AB%E5%AD%90%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：狗牵绳是编织成品',
          },
        ],
      },
    ],
  },
  {
    id: '迪斯特尔结',
    source: {
      name: '迪斯特尔结',
      url: 'https://knots3d.com/zh-CN/%E8%BF%AA%E6%96%AF%E7%89%B9%E5%B0%94%E7%BB%93',
      englishName: 'Distel Hitch',
      englishAliases: ['4 over 1 Distel'],
      englishUrl: 'https://knots3d.com/en/distel-hitch-knot',
      englishSlug: 'distel-hitch-knot',
      aliases: ['迪斯特尔绳结'],
      abok: [],
      activityIds: ['arborist'],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E8%BF%AA%E6%96%AF%E7%89%B9%E5%B0%94%E7%BB%93.webp',
      relatedIds: ['瓦尔多斯坦结', '施瓦本结', '克氏抓结', '米却肯结', '普鲁士抓结', '双圈索结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BF%AA%E6%96%AF%E7%89%B9%E5%B0%94%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是攀爬抓握对象',
          },
        ],
      },
      {
        id: 'tree',
        name: '树与树枝',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E8%BF%AA%E6%96%AF%E7%89%B9%E5%B0%94%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：树是攀爬作业对象，未推定该结直接绑树',
          },
        ],
      },
    ],
  },
  {
    id: '邓肯环-结',
    source: {
      name: '邓肯环',
      url: 'https://knots3d.com/zh-CN/%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
      englishName: 'Uni Knot',
      englishAliases: ['Duncan Loop', 'Grinner Knot'],
      englishUrl: 'https://knots3d.com/en/uni-knot',
      englishSlug: 'uni-knot',
      aliases: ['万能结', '露齿结'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93.webp',
      relatedIds: ['双邓肯环-结', '改进邓肯环-结', '改进的扭抱结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼线是连接材料',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：鱼钩是连接对象',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：拟饵是连接对象',
          },
        ],
      },
      {
        id: 'swivel',
        name: '转环',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：转环是连接对象',
          },
        ],
      },
      {
        id: 'reel',
        name: '渔线轮',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%82%93%E8%82%AF%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：卷线器线轴是鱼线固定物',
          },
        ],
      },
    ],
  },
  {
    id: '里弗结',
    source: {
      name: '里弗结',
      url: 'https://knots3d.com/zh-CN/%E9%87%8C%E5%BC%97%E7%BB%93',
      englishName: 'Reever Knot',
      englishAliases: ['Reever Bend'],
      englishUrl: 'https://knots3d.com/en/reever-knot',
      englishSlug: 'reever-knot',
      aliases: ['里弗连接结'],
      abok: [],
      activityIds: ['climbing', 'camping'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%87%8C%E5%BC%97%E7%BB%93.webp',
      relatedIds: ['反复结', '简西蒙结-下', '简西蒙结-上', '双马具连接结', '接绳结', '平结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%87%8C%E5%BC%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接绳索或弹力绳',
          },
        ],
      },
    ],
  },
  {
    id: '钉子结',
    source: {
      name: '钉子结',
      url: 'https://knots3d.com/zh-CN/%E9%92%89%E5%AD%90%E7%BB%93',
      englishName: 'Nail Knot',
      englishAliases: ['Tube Knot', 'Gryp Knot'],
      englishUrl: 'https://knots3d.com/en/nail-knot',
      englishSlug: 'nail-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%92%89%E5%AD%90%E7%BB%93.webp',
      relatedIds: ['双邓肯环-结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%89%E5%AD%90%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接前导线与飞蝇鱼线',
          },
        ],
      },
    ],
  },
  {
    id: '钩孔结',
    source: {
      name: '钩孔结',
      url: 'https://knots3d.com/zh-CN/%E9%92%A9%E5%AD%94%E7%BB%93',
      englishName: 'Turle Knot',
      englishAliases: ["Major Turle's Knot", 'Turtle Knot', 'Turrel Knot'],
      englishUrl: 'https://knots3d.com/en/turle-knot',
      englishSlug: 'turle-knot',
      aliases: ['特尔结'],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%92%A9%E5%AD%94%E7%BB%93.webp',
      relatedIds: ['双反手结', '滑结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%A9%E5%AD%94%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：前导线是毛钩连接材料',
          },
        ],
      },
      {
        id: 'fishing-hook',
        name: '鱼钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%A9%E5%AD%94%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：偏置或成角度鱼钩是系接对象',
          },
        ],
      },
      {
        id: 'lure',
        name: '拟饵与毛钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%A9%E5%AD%94%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：毛钩是连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '钩结',
    source: {
      name: '钩结',
      url: 'https://knots3d.com/zh-CN/%E9%92%A9%E7%BB%93',
      englishName: "Cat's Paw",
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/cats-paw-knot',
      englishSlug: 'cats-paw-knot',
      aliases: ['猫爪结'],
      abok: ['1891'],
      activityIds: [],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%92%A9%E7%BB%93.webp',
      relatedIds: ['牛索结', '雀头结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是起吊材料',
          },
        ],
      },
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：鱼线是转环连接材料',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：与钩铁锁并列的环为外接物',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：铁锁是穿绳对象',
          },
        ],
      },
      {
        id: 'generic-hook',
        name: '挂钩与吊钩',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：起重机吊钩是起吊连接物',
          },
        ],
      },
      {
        id: 'swivel',
        name: '转环',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：钓鱼转环是鱼线连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '钻石结',
    source: {
      name: '钻石结',
      url: 'https://knots3d.com/zh-CN/%E9%92%BB%E7%9F%B3%E7%BB%93',
      englishName: 'Diamond Knot',
      englishAliases: [
        'Lanyard Knot',
        'Knife Lanyard Knot',
        'Two-strand Diamond Knot',
        "Bosun's Whistle Knot",
      ],
      englishUrl: 'https://knots3d.com/en/diamond-knot',
      englishSlug: 'diamond-knot',
      aliases: ['刀挂绳结', '挂绳结', '刀具手柄挂绳'],
      abok: ['787'],
      activityIds: ['decorative'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%92%BB%E7%9F%B3%E7%BB%93.webp',
      relatedIds: ['大绳接结', '雀头结', '双钱结', '友谊结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%BB%E7%9F%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：绳索是狗玩具材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%BB%E7%9F%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳是装饰绳尾结材料',
          },
        ],
      },
      {
        id: 'necklace',
        name: '项链与吊坠',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%BB%E7%9F%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：吊坠是悬挂对象',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%BB%E7%9F%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：拉链头钥匙链装饰是成品',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%BB%E7%9F%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：刀柄是挂绳的所属部件',
          },
        ],
      },
      {
        id: 'pet-lead',
        name: '动物牵绳与缰绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%BB%E7%9F%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：绳索狗绳是装饰对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%92%BB%E7%9F%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：刀柄挂绳服务于刀具，属于配件用途；未声称结直接捆工具',
          },
        ],
      },
    ],
  },
  {
    id: '锁链结',
    source: {
      name: '锁链结',
      url: 'https://knots3d.com/zh-CN/%E9%94%81%E9%93%BE%E7%BB%93',
      englishName: 'Chain Sinnet',
      englishAliases: [
        'Chain Stitch',
        'Crochet Stitch',
        'Daisy Chain',
        'Monkey Braid',
        'Monkey Chain',
        'Contractor Wrap',
        'Single Trumpet Cord',
        'Chain Sennit',
      ],
      englishUrl: 'https://knots3d.com/en/chain-sinnet-knot',
      englishSlug: 'chain-sinnet-knot',
      aliases: [],
      abok: ['2868'],
      activityIds: ['climbing', 'arborist', 'rope-care', 'decorative'],
      typeId: 'special',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%94%81%E9%93%BE%E7%BB%93.webp',
      relatedIds: ['滑结', '辫子结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%94%81%E9%93%BE%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是缩短存放对象',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%94%81%E9%93%BE%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：细绳是装饰链材料',
          },
        ],
      },
      {
        id: 'hose',
        name: '管材与水带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%94%81%E9%93%BE%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：软管是收拾整理对象',
          },
        ],
      },
    ],
  },
  {
    id: '锚结',
    source: {
      name: '锚结',
      url: 'https://knots3d.com/zh-CN/%E9%94%9A%E7%BB%93',
      englishName: 'Anchor Hitch',
      englishAliases: ['Anchor Bend', "Fisherman's Hitch", "Fisherman's Bend"],
      englishUrl: 'https://knots3d.com/en/anchor-hitch-knot',
      englishSlug: 'anchor-hitch-knot',
      aliases: ['渔人结'],
      abok: ['1723'],
      activityIds: ['essentials', 'arborist', 'diving', 'boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%94%9A%E7%BB%93.webp',
      relatedIds: ['环编双重半套钩结', '帆脚结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%94%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是系接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%94%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：码头柱是连接对象',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%94%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：链环是连接对象',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%94%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 8,
            note: '逐条语义核对：卸扣是拖曳绳系接物',
          },
        ],
      },
      {
        id: 'hammock',
        name: '吊床与秋千',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%94%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：树秋千环是系绳位置',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%94%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：船是岸上系固对象',
          },
        ],
      },
      {
        id: 'cleat',
        name: '系缆桩、船锚与锚链',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%94%9A%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：船锚或锚链是系接对象',
          },
        ],
      },
    ],
  },
  {
    id: '阿什利止索结',
    source: {
      name: '阿什利止索结',
      url: 'https://knots3d.com/zh-CN/%E9%98%BF%E4%BB%80%E5%88%A9%E6%AD%A2%E7%B4%A2%E7%BB%93',
      englishName: 'Ashley Stopper Knot',
      englishAliases: ["Oysterman's Stopper"],
      englishUrl: 'https://knots3d.com/en/ashley-stopper-knot',
      englishSlug: 'ashley-stopper-knot',
      aliases: ['艾希礼止索结', '止索结'],
      abok: ['526'],
      activityIds: ['boating'],
      typeId: 'stoppers',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E9%98%BF%E4%BB%80%E5%88%A9%E6%AD%A2%E7%B4%A2%E7%BB%93.webp',
      relatedIds: ['埃斯塔止索结', '滑结', '反手结', '三叶结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E4%BB%80%E5%88%A9%E6%AD%A2%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是止滑对象',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E4%BB%80%E5%88%A9%E6%AD%A2%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：细绳末端制作结头',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E4%BB%80%E5%88%A9%E6%AD%A2%E7%B4%A2%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：挂绳是防止穿过开口的对象',
          },
        ],
      },
    ],
  },
  {
    id: '阿什利结',
    source: {
      name: '阿什利结',
      url: 'https://knots3d.com/zh-CN/%E9%98%BF%E4%BB%80%E5%88%A9%E7%BB%93',
      englishName: "Ashley's Bend",
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/ashleys-bend-knot',
      englishSlug: 'ashleys-bend-knot',
      aliases: ['艾希礼结'],
      abok: ['1452'],
      activityIds: ['climbing'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%98%BF%E4%BB%80%E5%88%A9%E7%BB%93.webp',
      relatedIds: ['齐柏林结', '亨特结', '握手结', '阿尔卑斯中间衔接结', '反手结', '接绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%98%BF%E4%BB%80%E5%88%A9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条绳索',
          },
        ],
      },
    ],
  },
  {
    id: '阿尔卑斯中间衔接结',
    source: {
      name: '阿尔卑斯中间衔接结',
      url: 'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E4%B8%AD%E9%97%B4%E8%A1%94%E6%8E%A5%E7%BB%93',
      englishName: 'Alpine Butterfly Bend',
      englishAliases: ['Butterfly Bend', 'Strait Bend'],
      englishUrl: 'https://knots3d.com/en/alpine-butterfly-bend-knot',
      englishSlug: 'alpine-butterfly-bend-knot',
      aliases: [],
      abok: [],
      activityIds: [],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E4%B8%AD%E9%97%B4%E8%A1%94%E6%8E%A5%E7%BB%93.webp',
      relatedIds: [
        '阿尔卑斯蝴蝶结-手法',
        '阿尔卑斯蝴蝶结',
        '双马具连接结',
        '亨特结',
        '齐柏林结',
        '阿什利结',
        '握手结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E4%B8%AD%E9%97%B4%E8%A1%94%E6%8E%A5%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两条绳索',
          },
        ],
      },
    ],
  },
  {
    id: '阿尔卑斯收绳结',
    source: {
      name: '阿尔卑斯收绳结',
      url: 'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E6%94%B6%E7%BB%B3%E7%BB%93',
      englishName: 'Alpine Coil',
      englishAliases: ["Mountaineer's Coil", "Climber's Coil", 'Lap Coil', 'Standing Coil'],
      englishUrl: 'https://knots3d.com/en/alpine-coil-knot',
      englishSlug: 'alpine-coil-knot',
      aliases: [],
      abok: [],
      activityIds: ['climbing'],
      typeId: 'coiling',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E6%94%B6%E7%BB%B3%E7%BB%93.webp',
      relatedIds: ['束帆收绳结', '消防员收绳结', '水手收绳结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E6%94%B6%E7%BB%B3%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索是盘收搬运对象',
          },
        ],
      },
    ],
  },
  {
    id: '阿尔卑斯蝴蝶结',
    source: {
      name: '阿尔卑斯蝴蝶结',
      url: 'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93',
      englishName: 'Alpine Butterfly',
      englishAliases: ["Lineman's Loop", 'Butterfly Loop', "Lineman's Rider", 'Harness Loop'],
      englishUrl: 'https://knots3d.com/en/alpine-butterfly-knot',
      englishSlug: 'alpine-butterfly-knot',
      aliases: ['蝴蝶结', '中间结'],
      abok: ['1053'],
      activityIds: ['caving', 'climbing', 'arborist', 'fire-rescue'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93.webp',
      relatedIds: [
        '阿尔卑斯蝴蝶结-手法',
        '阿尔卑斯中间衔接结',
        '中间八字结',
        '背纤结',
        '阿尔卑斯蝴蝶结-回穿',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索中间制环',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：中段绳环是扣接结构',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：铁锁是扣入对象',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：船是绳梯搭建使用载体',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 9,
            note: '逐条语义核对：设置洞穴探险中段锚点',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：装备是绳索中段连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '阿尔卑斯蝴蝶结-回穿',
    source: {
      name: '阿尔卑斯蝴蝶结（回穿）',
      url: 'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E5%9B%9E%E7%A9%BF',
      englishName: 'Alpine Butterfly (Rethreaded)',
      englishAliases: [
        'Rethreaded Alpine Butterfly',
        'Alpine Butterfly End Loop',
        'Alpine Butterfly Follow Through',
      ],
      englishUrl: 'https://knots3d.com/en/alpine-butterfly-rethreaded-knot',
      englishSlug: 'alpine-butterfly-rethreaded-knot',
      aliases: ['中间结（回穿）', '阿尔卑斯蝴蝶结（绳端）'],
      abok: ['1053'],
      activityIds: ['caving', 'climbing', 'arborist'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E5%9B%9E%E7%A9%BF.webp',
      relatedIds: [
        '阿尔卑斯蝴蝶结',
        '阿尔卑斯蝴蝶结-手法',
        '阿尔卑斯中间衔接结',
        '八字返穿结',
        '八字套结',
        '双称人结-回穿',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E5%9B%9E%E7%A9%BF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索直接连接封闭锚点',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E5%9B%9E%E7%A9%BF',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳端形成固定绳环',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E5%9B%9E%E7%A9%BF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：圆环是外接物；否定仅针对铁锁',
          },
        ],
      },
      {
        id: 'sail-rigging',
        name: '帆具与帆索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E5%9B%9E%E7%A9%BF',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：前帆帆脚索穿过帆角；否定仅针对卸扣',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E5%9B%9E%E7%A9%BF',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：封闭锚点是直接系接对象',
          },
        ],
      },
    ],
  },
  {
    id: '阿尔卑斯蝴蝶结-手法',
    source: {
      name: '阿尔卑斯蝴蝶结（手法）',
      url: 'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E6%89%8B%E6%B3%95',
      englishName: 'Alpine Butterfly (Hand Method)',
      englishAliases: ["Lineman's Loop", 'Butterfly Loop', "Lineman's Rider", 'Harness Loop'],
      englishUrl: 'https://knots3d.com/en/alpine-butterfly-hand-method-knot',
      englishSlug: 'alpine-butterfly-hand-method-knot',
      aliases: ['蝴蝶结（手法）', '中间结（手法）'],
      abok: ['1053'],
      activityIds: ['essentials', 'caving', 'climbing', 'arborist', 'fire-rescue'],
      typeId: 'loops',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E6%89%8B%E6%B3%95.webp',
      relatedIds: [
        '阿尔卑斯蝴蝶结',
        '阿尔卑斯中间衔接结',
        '中间八字结',
        '背纤结',
        '阿尔卑斯蝴蝶结-回穿',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E6%89%8B%E6%B3%95',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索中间制环',
          },
        ],
      },
      {
        id: 'rope-loop',
        name: '绳制环圈',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E6%89%8B%E6%B3%95',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：形成中段绳环',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E6%89%8B%E6%B3%95',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：铁锁是中段连接物',
          },
        ],
      },
      {
        id: 'anchor-point',
        name: '锚点与保护站',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E6%89%8B%E6%B3%95',
            field: 'common-uses',
            useIndex: 12,
            note: '逐条语义核对：设置洞穴探险中段锚点',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl:
              'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E8%9D%B4%E8%9D%B6%E7%BB%93-%E6%89%8B%E6%B3%95',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：装备是中段绳环连接对象',
          },
        ],
      },
    ],
  },
  {
    id: '阿尔贝托结',
    source: {
      name: '阿尔贝托结',
      url: 'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E8%B4%9D%E6%89%98%E7%BB%93',
      englishName: 'Alberto Knot',
      englishAliases: ['Crazy Alberto Knot', 'Modified Albright Knot'],
      englishUrl: 'https://knots3d.com/en/alberto-knot',
      englishSlug: 'alberto-knot',
      aliases: [],
      abok: [],
      activityIds: ['fishing'],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E9%98%BF%E5%B0%94%E8%B4%9D%E6%89%98%E7%BB%93.webp',
      relatedIds: ['奥尔布赖特结', '尤卡坦结'],
    },
    objects: [
      {
        id: 'fishing-line',
        name: '鱼线与前导线',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E8%B4%9D%E6%89%98%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接编织鱼线与较粗前导线',
          },
        ],
      },
    ],
  },
  {
    id: '雀头结',
    source: {
      name: '雀头结',
      url: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
      englishName: 'Lanyard Hitch',
      englishAliases: [
        'Girth Hitch',
        'Ring Hitch',
        "Lark's Head",
        'Bale Sling Hitch',
        'Baggage Tag Loop',
        'Tag Knot',
      ],
      englishUrl: 'https://knots3d.com/en/lanyard-hitch-knot',
      englishSlug: 'lanyard-hitch-knot',
      aliases: ['系物结', '挂绳栓'],
      abok: ['1673'],
      activityIds: ['military', 'theater-film', 'caving', 'arborist', 'camping'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%9B%80%E5%A4%B4%E7%BB%93.webp',
      relatedIds: ['牛索结', '钩结', '普鲁士抓结', '牛眼结-绳端', '皮维奇结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 8,
            note: '逐条语义核对：绳索是浮标连接材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：细绳是系接材料',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：帐篷防水布孔眼是系接物',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 5,
            note: '逐条语义核对：帐篷或防水布是系绳对象',
          },
        ],
      },
      {
        id: 'necklace',
        name: '项链与吊坠',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 6,
            note: '逐条语义核对：项链绳承载戒指',
          },
        ],
      },
      {
        id: 'lanyard',
        name: '挂绳、钥匙扣与拉链头',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 10,
            note: '逐条语义核对：挂绳是固定对象',
          },
        ],
      },
      {
        id: 'tag',
        name: '徽章与标牌',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：徽章姓名牌是系接对象',
          },
        ],
      },
      {
        id: 'whistle',
        name: '口哨',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：口哨是系接对象',
          },
        ],
      },
      {
        id: 'decorative-item',
        name: '装饰挂件与灯饰',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 9,
            note: '逐条语义核对：挂饰是细绳连接对象',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：小工具是颈绳悬挂对象',
          },
        ],
      },
    ],
  },
  {
    id: '鞋带结',
    source: {
      name: '鞋带结',
      url: 'https://knots3d.com/zh-CN/%E9%9E%8B%E5%B8%A6%E7%BB%93',
      englishName: 'Bow Knot',
      englishAliases: ['Shoelace Knot', 'Slipped Reef Knot', 'Slipped Square Knot'],
      englishUrl: 'https://knots3d.com/en/bow-knot',
      englishSlug: 'bow-knot',
      aliases: ['蝴蝶结'],
      abok: ['1212'],
      activityIds: ['theater-film'],
      typeId: 'multi-loop',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%9E%8B%E5%B8%A6%E7%BB%93.webp',
      relatedIds: ['平结'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9E%8B%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：横杆是窗帘或布景系接物',
          },
        ],
      },
      {
        id: 'sack',
        name: '袋口与麻袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9E%8B%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：袋子麻袋是封闭对象',
          },
        ],
      },
      {
        id: 'shoelace',
        name: '鞋带',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9E%8B%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：明确系鞋带',
          },
        ],
      },
      {
        id: 'clothing',
        name: '服装',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9E%8B%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：围裙是系结对象',
          },
        ],
      },
      {
        id: 'curtain',
        name: '窗帘与挂毯',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9E%8B%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：窗帘是系挂对象',
          },
        ],
      },
      {
        id: 'stage',
        name: '舞台布景与配重沙袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%9E%8B%E5%B8%A6%E7%BB%93',
            field: 'common-uses',
            useIndex: 4,
            note: '逐条语义核对：舞台布景是系挂对象',
          },
        ],
      },
    ],
  },
  {
    id: '领圈结',
    source: {
      name: '领圈结',
      url: 'https://knots3d.com/zh-CN/%E9%A2%86%E5%9C%88%E7%BB%93',
      englishName: "Turk's Head (Woggle)",
      englishAliases: [
        'Woggle',
        'Neckerchief Slide',
        'THK',
        'Braided Ring',
        "Turk's Head 3 Lead 5 Bight",
        "Sailor's Knot",
      ],
      englishUrl: 'https://knots3d.com/en/turks-head-woggle-knot',
      englishSlug: 'turks-head-woggle-knot',
      aliases: ['环扣结', '三股花箍', '领巾圈结'],
      abok: ['1303'],
      activityIds: ['scouting', 'decorative'],
      typeId: 'binding',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%A2%86%E5%9C%88%E7%BB%93.webp',
      relatedIds: ['辫子结', '土耳其头垫结-3l5b', '友谊结', '土耳其头垫结-5l4b'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A2%86%E5%9C%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳是装饰环制作材料',
          },
        ],
      },
      {
        id: 'thin-cord',
        name: '细绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A2%86%E5%9C%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：细绳是装饰环制作材料',
          },
        ],
      },
      {
        id: 'tie',
        name: '领带、领巾与围巾',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A2%86%E5%9C%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：童军领巾扣是成品用途',
          },
        ],
      },
      {
        id: 'handle',
        name: '把手与握柄',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A2%86%E5%9C%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：手柄是装饰握把的使用载体',
          },
        ],
      },
      {
        id: 'tools-equipment',
        name: '工具与装备',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A2%86%E5%9C%88%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：工具手柄是装饰对象',
          },
        ],
      },
    ],
  },
  {
    id: '马格努斯结',
    source: {
      name: '马格努斯结',
      url: 'https://knots3d.com/zh-CN/%E9%A9%AC%E6%A0%BC%E5%8A%AA%E6%96%AF%E7%BB%93',
      englishName: 'Magnus Hitch',
      englishAliases: ["Magner's Hitch", 'Taut Line Hitch'],
      englishUrl: 'https://knots3d.com/en/magnus-hitch-knot',
      englishSlug: 'magnus-hitch-knot',
      aliases: [],
      abok: ['1857'],
      activityIds: [],
      typeId: 'hitches',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E9%A9%AC%E6%A0%BC%E5%8A%AA%E6%96%AF%E7%BB%93.webp',
      relatedIds: ['营钉结', '舵副结', '塔巴克结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%AC%E6%A0%BC%E5%8A%AA%E6%96%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：受力绳索是抓握对象',
          },
        ],
      },
      {
        id: 'thick-rope',
        name: '粗绳',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%AC%E6%A0%BC%E5%8A%AA%E6%96%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：较粗绳索是滑动抓握对象',
          },
        ],
      },
      {
        id: 'tent',
        name: '帐篷、天幕与遮蔽物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%AC%E6%A0%BC%E5%8A%AA%E6%96%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：帐篷防水布绳是张紧对象',
          },
        ],
      },
      {
        id: 'guyline',
        name: '营绳与地钉',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%AC%E6%A0%BC%E5%8A%AA%E6%96%AF%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：帐篷绳或防水布绳是张紧对象',
          },
        ],
      },
    ],
  },
  {
    id: '马槽结',
    source: {
      name: '马槽结',
      url: 'https://knots3d.com/zh-CN/%E9%A9%AC%E6%A7%BD%E7%BB%93',
      englishName: 'Manger Hitch',
      englishAliases: [],
      englishUrl: 'https://knots3d.com/en/manger-hitch-knot',
      englishSlug: 'manger-hitch-knot',
      aliases: ['饲料槽结'],
      abok: ['1828'],
      activityIds: [],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%A9%AC%E6%A7%BD%E7%BB%93.webp',
      relatedIds: ['缰绳套钩结', '西伯利亚套结', '活索结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%AC%E6%A7%BD%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索是临时系接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%AC%E6%A7%BD%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱子是动物系留固定物',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%AC%E6%A7%BD%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：与柱并列的环为外接物',
          },
        ],
      },
    ],
  },
  {
    id: '马贼索-结',
    source: {
      name: '马贼索',
      url: 'https://knots3d.com/zh-CN/%E9%A9%AC%E8%B4%BC%E7%B4%A2-%E7%BB%93',
      englishName: "Highwayman's Hitch",
      englishAliases: [
        "Highwayman's Cutaway",
        "Dick Turpin's Knot",
        "Highwayman's Getaway",
        'Boat Hitch',
        'Draw Hitch',
      ],
      englishUrl: 'https://knots3d.com/en/highwaymans-hitch-knot',
      englishSlug: 'highwaymans-hitch-knot',
      aliases: ['牧童结'],
      abok: [],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%A9%AC%E8%B4%BC%E7%B4%A2-%E7%BB%93.webp',
      relatedIds: ['活索结', '牛索结', '活称人结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%AC%E8%B4%BC%E7%B4%A2-%E7%BB%93',
            field: 'common-uses',
            useIndex: 2,
            note: '逐条语义核对：绳索是系接材料',
          },
        ],
      },
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%AC%E8%B4%BC%E7%B4%A2-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱是临时系船固定物',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%AC%E8%B4%BC%E7%B4%A2-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：船是临时系泊对象',
          },
        ],
      },
      {
        id: 'stage',
        name: '舞台布景与配重沙袋',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%AC%E8%B4%BC%E7%B4%A2-%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：布景是快速释放下落对象',
          },
        ],
      },
    ],
  },
  {
    id: '驳船结',
    source: {
      name: '驳船结',
      url: 'https://knots3d.com/zh-CN/%E9%A9%B3%E8%88%B9%E7%BB%93',
      englishName: "Lighterman's Hitch",
      englishAliases: ['Tugboat hitch', "Canalman's Hitch", 'Backhand Mooring Hitch'],
      englishUrl: 'https://knots3d.com/en/lightermans-hitch-knot',
      englishSlug: 'lightermans-hitch-knot',
      aliases: [],
      abok: ['2046'],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%A9%B3%E8%88%B9%E7%BB%93.webp',
      relatedIds: ['桩结', '后手套结', '无张力结', '双半结', '环编双重半套钩结'],
    },
    objects: [
      {
        id: 'pole',
        name: '杆、柱与栏杆',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%B3%E8%88%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：柱子是系泊对象',
          },
        ],
      },
      {
        id: 'cargo',
        name: '包裹与货物',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%B3%E8%88%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：货物装卸是临时系船的用途场景，未推定该结绑货物',
          },
        ],
      },
      {
        id: 'boat',
        name: '船艇与护舷',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%B3%E8%88%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：小船是系泊对象',
          },
        ],
      },
      {
        id: 'cleat',
        name: '系缆桩、船锚与锚链',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%A9%B3%E8%88%B9%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：系船柱是系泊固定物',
          },
        ],
      },
    ],
  },
  {
    id: '齐柏林环-结',
    source: {
      name: '齐柏林环',
      url: 'https://knots3d.com/zh-CN/%E9%BD%90%E6%9F%8F%E6%9E%97%E7%8E%AF-%E7%BB%93',
      englishName: 'Zeppelin Loop',
      englishAliases: ['Rosendahl Loop'],
      englishUrl: 'https://knots3d.com/en/zeppelin-loop-knot',
      englishSlug: 'zeppelin-loop-knot',
      aliases: ['罗森达尔环'],
      abok: [],
      activityIds: [],
      typeId: 'bends',
      imageUrl:
        'https://knots3d.com/zh-CN/image/knots/%E9%BD%90%E6%9F%8F%E6%9E%97%E7%8E%AF-%E7%BB%93.webp',
      relatedIds: ['反手结', '齐柏林结', '称人结', '汉森圈结', '络头结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%BD%90%E6%9F%8F%E6%9E%97%E7%8E%AF-%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：绳索末端形成固定环',
          },
        ],
      },
    ],
  },
  {
    id: '齐柏林结',
    source: {
      name: '齐柏林结',
      url: 'https://knots3d.com/zh-CN/%E9%BD%90%E6%9F%8F%E6%9E%97%E7%BB%93',
      englishName: 'Zeppelin Bend',
      englishAliases: ['Rosendahl Bend'],
      englishUrl: 'https://knots3d.com/en/zeppelin-bend-knot',
      englishSlug: 'zeppelin-bend-knot',
      aliases: ['飞艇结'],
      abok: [],
      activityIds: ['essentials', 'climbing', 'arborist'],
      typeId: 'bends',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%E9%BD%90%E6%9F%8F%E6%9E%97%E7%BB%93.webp',
      relatedIds: [
        '亨特结',
        '阿什利结',
        '握手结',
        '阿尔卑斯中间衔接结',
        '布罗奇连接结',
        '齐柏林环-结',
        '反手结',
        '接绳结',
      ],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%E9%BD%90%E6%9F%8F%E6%9E%97%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：连接两根绳索',
          },
        ],
      },
    ],
  },
  {
    id: '𢃇缆结',
    source: {
      name: '𢃇缆结',
      url: 'https://knots3d.com/zh-CN/%F0%A2%83%87%E7%BC%86%E7%BB%93',
      englishName: 'Halyard Hitch',
      englishAliases: ['Jeanneau Halyard Knot'],
      englishUrl: 'https://knots3d.com/en/halyard-hitch-knot',
      englishSlug: 'halyard-hitch-knot',
      aliases: [],
      abok: [],
      activityIds: ['boating'],
      typeId: 'hitches',
      imageUrl: 'https://knots3d.com/zh-CN/image/knots/%F0%A2%83%87%E7%BC%86%E7%BB%93.webp',
      relatedIds: ['双圈索结', '帆脚结', '绞架结'],
    },
    objects: [
      {
        id: 'rope',
        name: '绳索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%F0%A2%83%87%E7%BC%86%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：绳索是系接材料',
          },
        ],
      },
      {
        id: 'attachment-eye',
        name: '外接环与孔眼',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%F0%A2%83%87%E7%BC%86%E7%BB%93',
            field: 'common-uses',
            useIndex: 1,
            note: '逐条语义核对：环是绳索系接物',
          },
        ],
      },
      {
        id: 'carabiner',
        name: '钩环、锁扣与卸扣',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%F0%A2%83%87%E7%BC%86%E7%BB%93',
            field: 'common-uses',
            useIndex: 3,
            note: '逐条语义核对：卸扣是系泊绳固定物',
          },
        ],
      },
      {
        id: 'sail-rigging',
        name: '帆具与帆索',
        evidence: [
          {
            basis: 'source-explicit',
            sourceUrl: 'https://knots3d.com/zh-CN/%F0%A2%83%87%E7%BC%86%E7%BB%93',
            field: 'common-uses',
            useIndex: 0,
            note: '逐条语义核对：帆是升降索连接对象',
          },
        ],
      },
    ],
  },
];
