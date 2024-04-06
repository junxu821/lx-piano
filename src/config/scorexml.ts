/**
 * 所有的XML乐谱文件列表
 */
// const base = '/sounds/xmlscore/'
export  interface ScorexmlItem {
  name: string,
  url: string,
  degree?: number,
  playing?: boolean
}



const scorexml: ScorexmlItem[] = [
  {
    name: '成都',
    url: '/sounds/xmlscore/成都.json',
    degree: 5
  },
  {
    name: '千与千寻 - Always With Me',
    url: '/sounds/xmlscore/千与千寻.json',
    degree: 4
  },
  {
    name: '后来',
    url: '/sounds/xmlscore/后来.json',
    degree: 3
  },
  {
    name: '告白气球',
    url: '/sounds/xmlscore/告白气球.json',
    degree: 2
  },
  {
    name: '蒲公英的约定',
    url: '/sounds/xmlscore/蒲公英的约定.json',
    degree: 5
  },
  {
    name: '时间煮雨',
    url: '/sounds/xmlscore/时间煮雨.json',
    degree: 4
  },
  {
    name: '下一个天亮',
    url: '/sounds/xmlscore/下一个天亮.json',
    degree: 2
  },
  {
    name: '海角七号 1945',
    url: '/sounds/xmlscore/海角七号.json',
    degree: 3
  }
]

scorexml.forEach(score => {
  score.playing = false
})

export default scorexml
