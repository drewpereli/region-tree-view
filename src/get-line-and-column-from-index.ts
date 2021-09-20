interface ReturnHash {
  line: number;
  column: number;
}

export default function getLineAndColumnFromIndex(str : string, index : number) : ReturnHash | null {
  let lines = str.split('\n');

  let cumulativeLength = 0;

  for (let i = 0; i < lines.length; i++) {
      let currLine = lines[i];

      let currLineLength = currLine.length + 1; // Have to add one because the newline character was removed when we split

      if (cumulativeLength + currLineLength > index) {
        let line = i;
        let column = index - cumulativeLength;

        return {line, column}
      }
      
      cumulativeLength += currLineLength;
  }

  return null;
}
