type FilterFunction = <T>(data: any) => boolean;
type NormalFunction = <T>(data: any) => void;

interface TableElement {
  filter: FilterFunction;
  callback: NormalFunction;
}

// key is collection name
const table = new Map();

function register(
  collectionName: string,
  filter: FilterFunction,
  callback: NormalFunction,
) {
  table.set(collectionName, [
    ...table.get(collectionName),
    { filter, callback },
  ]);
}

function execute(collectionName: string, data: any) {
  ((table.get(collectionName) as TableElement[]) || []).forEach(
    ({ filter, callback }) => {
      if (filter?.(data)) {
        callback(data);
      }
    },
  );
}
