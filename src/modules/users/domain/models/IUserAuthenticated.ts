export interface IUserAuthenticated {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}
