export type JwtPayload = {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
};
export interface CustomerSession {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}
