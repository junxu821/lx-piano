
export interface ScoreMidiItem {
  name:string;
  url:string;
  degree:number;
  playing?:boolean;
}
const scoremidi:ScoreMidiItem[] = [
  // 周杰伦
  { name: '晴天', url: '晴天.mid', degree: 5 },
  { name: '等你下课', url: '等你下课.mid', degree: 3 }
]

scoremidi.forEach(score => {
  score.url = '/sounds/midi/' + score.url
  score.playing = false
})

export default scoremidi
