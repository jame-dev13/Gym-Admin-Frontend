export type CurrentOverviewResponse = Readonly<{
  username: string;
  email: string;
}>;

export type CurrentUserResponse = Readonly<{
  name: string;
  email: string;
  roles: ReadonlyArray<string>;
}>;

export type CurrentUserUpdateRequest = {
  name: string;
  email: string;
  password: string | null;
};
