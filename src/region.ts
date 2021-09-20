import execAll from './exec-all';
const sortBy =  require('sort-by');

interface StartEndMatch {
  isStart: boolean;
  text: string;
  index: number;
}

export default class Region {
  
  constructor(
    private readonly content: string, 
    public readonly name: string, 
    public readonly startIndex: number,
    private readonly fileExtension : 'js' | 'hbs'
  ) {}

  getChildRegions() : Region[] {
    if (!this.startRegexp.test(this.content)) {
      return [];
    }

    let startMatches : StartEndMatch[] = execAll(this.startRegexp, this.content).map(({text, index}) => ({isStart: true, text, index}));
    let endMatches : StartEndMatch[] = execAll(this.endRegexp, this.content).map(({text, index}) => ({isStart: false, text, index}));

    let matches : StartEndMatch[] = [...startMatches, ...endMatches].sort(sortBy('index'));

    let regions : Region[] = [];

    let currParentRegionCount : number = 0;

    let currChildRegionStartMatch : StartEndMatch | undefined;

    matches.forEach(match => {
      if (match.isStart) {
        currParentRegionCount++;

        if (currParentRegionCount === 1) {
          currChildRegionStartMatch = match;
        }
      }
      else {
        currParentRegionCount--;

        if (currParentRegionCount === 0) {
          if (currChildRegionStartMatch === undefined) {
            throw new Error('Regions are off');
            return;
          }
          
          let regionStartIdx : number = currChildRegionStartMatch.index + currChildRegionStartMatch.text.length;
          let regionEndIdx : number = match.index;
          let text = this.content.slice(regionStartIdx, regionEndIdx);

          let regionName = this.startRegexp.exec(currChildRegionStartMatch.text)?.[1] || 'unnamed region';

          let newRegion = new Region(text, regionName, this.startIndex + currChildRegionStartMatch.index, this.fileExtension);

          regions.push(newRegion);
        }
      }
    });

    return regions;
  }

  private get startRegexp() {
    if (this.fileExtension === 'js') {
      return /\/\* #region (.+?) \*\//;
    }
    else {
      return /\{\{\! #region (.+?) \}\}/;
    }
  }

  private get endRegexp() {
    if (this.fileExtension === 'js') {
      return /\/\* #endregion \*\//;
    }
    else {
      return /\{\{\! #endregion \}\}/;
    }
  }
}
