import { Request, Response } from "../server";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { Usuario } from "../models/Usuario";

export function UsuarioController() {
  const repository = new UsuarioRepository();

  function criarUsuario(req: Request, res: Response): void {
    const usuario: Usuario = req.body;

    if (!usuario.nome || !usuario.email || !usuario.senha || !usuario.role) {
      res.status(400).json({ erro: "Campos obrigatórios ausentes: nome, email, senha, role." });
      return;
    }

    const rolesPermitidas = ["admin", "inspetor"];
    if (!rolesPermitidas.includes(usuario.role)) {
      res.status(400).json({ erro: `Role inválida. Valores permitidos: ${rolesPermitidas.join(", ")}.` });
      return;
    }

    const novo = repository.salvar(usuario);
    const { senha: _, ...usuarioSemSenha } = novo;
    res.status(201).json(usuarioSemSenha);
  }

  return {
    criarUsuario,
  };
}