import db from "../database/database";
import { Usuario } from "../models/Usuario";

export class UsuarioRepository { 
    salvar(usuario: Usuario): Usuario {
        const insertUsuario = db.prepare(
            `INSERT INTO usuarios (nome, email, senha, role)
             VALUES (?, ?, ?, ?)`
        );
        const resultado = insertUsuario.run(
            usuario.nome,
            usuario.email,
            usuario.senha,
            usuario.role
        );
        return { ...usuario, id: Number(resultado.lastInsertRowid) };
    }
}