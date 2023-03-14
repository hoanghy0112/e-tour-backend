function socketRequest(
  func: (
    resolveFunc: (value: any) => void,
    rejectFunc: (value: any) => void,
  ) => void,
) {
  return new Promise((resolve: (d: any) => void, reject: (d: any) => void) => {
    func(resolve, reject);
  });
}

export default socketRequest;
