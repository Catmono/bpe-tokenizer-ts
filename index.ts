import fs from "fs";
import path from "path";
import { encode } from "punycode";
import { fileURLToPath } from "url";

function getPairStats(data: number[]) {
  const stats: Record<string, number | undefined> = {};
  for (let i = 0; i < data.length - 1; i++) {
    const num1 = data[i];
    const num2 = data[i + 1];
    stats[`${num1}-${num2}`] = (stats[`${num1}-${num2}`] ?? 0) + 1;
  }
  const finalValue: [number, [number, number]][] = [];
  for (const key in stats) {
    finalValue.push([
      stats[key] ?? 0,
      key.split("-").map((t) => parseInt(t, 10)) as [number, number],
    ]);
  }

  return finalValue.sort((a, b) => b[0] - a[0]);
}

function mergeTokens({
  tokens,
  mergePair,
  newTokenId,
}: {
  tokens: number[];
  mergePair: [number, number];
  newTokenId: number;
}): number[] {
  let tokensToOperate = [...tokens];
  for (let i = 0; i < tokensToOperate.length - 1; i++) {
    const num1 = tokensToOperate[i];
    const num2 = tokensToOperate[i + 1];
    if (num1 === mergePair[0] && num2 === mergePair[1]) {
      tokensToOperate[i] = newTokenId;
      tokensToOperate[i + 1] = null as never;
      i++;
    }
  }
  tokensToOperate = tokensToOperate.filter((t) => t != null);
  return tokensToOperate;
}

function tokenize() {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const str = fs.readFileSync(path.resolve(dirname, "data.txt"), "utf-8");
  const bytes = [...Buffer.from(str, "utf-8")];
  const sizeOfVocab = 500;
  const iterationsRequired = sizeOfVocab - 256;
  let tokensToOperateOn = [...bytes];
  const mergeDictInOrder:[`${number}-${number}`,number][]=[]
  for (let i = 0; i < iterationsRequired; i++) {
    const sortedPairStats = getPairStats(tokensToOperateOn);
    if (sortedPairStats.length === 0) {
      console.log("Stopping — no pairs left");
      break;
    }

    const [bestStat] = sortedPairStats;
    if (!bestStat) {
      console.log("Stopping — no pairs left");
      break;
    }

    if (bestStat[0] < 2) {
      console.log("Stopping — no frequent pairs left");
      break;
    }
    const newTokenId = i + 256;
    tokensToOperateOn = mergeTokens({
      tokens: tokensToOperateOn,
      mergePair: bestStat[1],
      newTokenId,
    });

    mergeDictInOrder.push([
        `${bestStat[1][0]}-${bestStat[1][1]}`,
        newTokenId
    ])
  }
  console.log("Original Length", bytes.length);
  console.log("After Tokenization Length", tokensToOperateOn.length);
  console.log(mergeDictInOrder)

  const encode = (str:string):number[] => {
  let bytes = [...Buffer.from(str,'utf-8')];
  for (const item of mergeDictInOrder) {
    const priorityKey = item[0];
    for(let i=0;i<bytes.length-1;i++) {
        const b1 = bytes[i];
        const b2 = bytes[i+1];
        if(priorityKey === `${b1}-${b2}`){
            bytes[i]=item[1];
            bytes[i+1]=null as never;
            i++;
        }
    }
  }
  bytes=bytes.filter((t)=> t!=null);
  return bytes;
  }
  const filename_encode = fileURLToPath(import.meta.url);
  const dirname_encode = path.dirname(filename);
  const str_encode = fs.readFileSync(path.resolve(dirname, "data.txt"), "utf-8");
  console.log("Encoding",encode(str_encode));
  const decode = (tokens:number[]):string => {
    const bytes = [...tokens];
    const reverseDict:Record<
    number,
    {n1:number;n2:number} | undefined
    > = {};
    for (const item of mergeDictInOrder) {
        const [n1,n2]= item[0].split('-').map(t=>parseInt(t,10)) as [
            number,number
        ];
        reverseDict[item[1]] = {n1,n2};
    }
    for(let i=0;i<bytes.length;i++){
        const token = bytes[i] as number;
        const lookup = reverseDict[token];
        if(lookup!=null){
            bytes[i]=lookup.n1;
            bytes.splice(i+1,0,lookup.n2);
            i--;
        }
    }
    return Buffer.from(bytes).toString('utf-8');
  }
  console.log("Decoding",decode(encode(str_encode)))
}
tokenize();
