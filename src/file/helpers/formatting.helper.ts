export const incibeFormatFromArray = (data: Array<string[]>) => {
  return data.map((item: string[]) => ({
    title: item[0],
    cve: item[1],
    description: item[2],
    product: item[3],
    severity: item[4],
    publishDate: item[5],
    updateDate: item[6],
    references: item[7].split('\n').map((url) => url.trim()),
    owner: item[8] || 'default',
  }));
};

export interface incibeInterface {
  title: string;
  cve: string;
  description: string;
  product: string;
  severity: string;
  publishDate: string;
  updateDate: string;
  references: string[];
  owner?: string;
}

export const groupByOwner = (items: incibeInterface[]) => {
  const grouped = items.reduce(
    (acc, item) => {
      const owners = item.owner.split('-');

      owners.forEach((ownerName) => {
        acc[ownerName] = acc[ownerName] || [];
        acc[ownerName].push({ ...item, owner: ownerName });
      });

      return acc;
    },
    {} as Record<string, any[]>,
  );

  return Object.values(grouped);
};
