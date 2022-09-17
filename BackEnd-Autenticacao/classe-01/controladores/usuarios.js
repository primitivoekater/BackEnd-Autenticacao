const conexao= require('../conexao')
const securePassword = require("secure-password");
const jwt = require ("jsonwebtoken");
const jwtSecret=require("../jwt_secret")

const pwd= securePassword()


const cadastrarUsuario = async (req, res) => {
    const {nome,email, senha}= req.body
    
    if(!email||!nome||!senha){
        return res.status(400).json("preencha todos os dados obrigatorios")
    }
    
    try {
        const  hash=  (await pwd.hash(Buffer.from(senha))).toString('hex')
        const usuario =await  conexao.query('insert into usuarios (nome,email,senha) values ($1,$2,$3)',[nome,email,hash])
        
        if (usuario.rowCount===0){
            return  res.status(404).json('Não foi possivel cadastrar o usuario');
    
        }
        return  res.status(200).json('usuario cadastrado')
    }
     catch (error) {
        return res.status(400).json(error.message)
        
    }
    }

    const logIn = async (req, res) => {
        const {email, senha}= req.body
        try {
            if(!email||!senha){
                return res.status(400).json("preencha todos os dados obrigatorios")
            }

        const usuarios =await  conexao.query('select * from usuarios where email =$1',[email])
        
        if (usuarios.rowCount===0){
            return  res.status(404).json('email ou senha incorretos');
        }

        const usuario= usuarios.rows[0]
        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json("Email ou senha incorretos.");
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
                    const query = 'update usuarios set senha = $1 where email = $2';
                    await conexao.query(query, [hash, email]);
                } catch {
                }
                break;
            }
            const  token =jwt.sign({
                id:usuario.id,
                nome:usuario.nome,
                senha:usuario.senha
            },jwtSecret, 
            { expiresIn: "2h"
        });

        return  res.status(200).json(usuario)


        } catch (error) {
            
        }
    }

module.exports={   
    cadastrarUsuario,
    logIn
}