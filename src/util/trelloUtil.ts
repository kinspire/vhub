export const ORGANIZATION_ID = "57a9e839d08c6c062d044edf";

export const get = (
  path: string,
  params?: Record<string, any>
): Promise<any> => {
  return new Promise(resolve => {
    const cb = (data: any) => resolve(data);
    if (params) {
      Trello.get(path, params, cb);
    } else {
      Trello.get(path, cb);
    }
  });
};

export const colorMap = (color: Color): string => {
  switch (color) {
    case "sky":
      return "skyblue";
    default:
      return color.toString();
  }
};
