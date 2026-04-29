export type Role = "admin" | "inspetor";

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  role: Role;
}