export function makeDiff(a: any, b: any) {
  const diff: any = {};
  const keys = new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})]);
  keys.forEach(k => {
    const va = a?.[k];
    const vb = b?.[k];
    if (JSON.stringify(va) !== JSON.stringify(vb))
      diff[k] = { from: va, to: vb };
  });
  return diff;
}

export function redactDeep<T>(obj: T, paths: string[] = []): T {
  const clone = JSON.parse(JSON.stringify(obj ?? {}));
  for (const p of paths) {
    const segs = p.split('.');
    let cur: any = clone;
    for (let i = 0; i < segs.length - 1; i++) cur = cur?.[segs[i]];
    const leaf = segs[segs.length - 1];
    if (cur && leaf in cur) cur[leaf] = '[REDACTED]';
  }
  return clone;
}
