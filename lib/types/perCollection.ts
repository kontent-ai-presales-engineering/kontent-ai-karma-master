export type PerCollection<T> = Readonly<{
  corporate_site: T;
  elitebuild: T,
  support: T;
  elysium: T;
  default: T;
}>;

export type ValidCollectionCodename = keyof PerCollection<never>;

export const isValidCollectionCodename = (codename: string | undefined): codename is ValidCollectionCodename =>
  Object.keys(emptyCodenames).includes(codename || "");

const emptyCodenames: PerCollection<null> = {
  corporate_site: null,
  elitebuild: null,
  support: null,
  elysium: null,
  default: null,
};

