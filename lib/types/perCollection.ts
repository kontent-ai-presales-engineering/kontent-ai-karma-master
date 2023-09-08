export type PerCollection<T> = Readonly<{
  sandbox: T;
  elitebuild: T;
  support: T;
  pdf: T;
  default: T;
}>;

export type ValidCollectionCodename = keyof PerCollection<never>;

export const isValidCollectionCodename = (codename: string | undefined): codename is ValidCollectionCodename =>
  Object.keys(emptyCodenames).includes(codename || "");

const emptyCodenames: PerCollection<null> = {
  sandbox: null,
  elitebuild: null,
  support: null,
  pdf: null,
  default: null,
};

