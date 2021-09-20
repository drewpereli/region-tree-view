export default function execAll(srcRegex: RegExp, text: string) : Match[] {
  let regex = new RegExp(srcRegex, 'g');
  let matches : Match[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push({
     text: match[0],
     index: match.index 
    });
  }
  
  return matches;
}

interface Match {
  text: string;
  index: number;
}
