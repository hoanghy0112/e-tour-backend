export function fromDocToObject(doc: any) {
  return JSON.parse(JSON.stringify(doc));
}

export function dataWithListenerId(data: any, listenerId: string) {
  return {
    data: fromDocToObject(data),
    listenerId,
  };
}
