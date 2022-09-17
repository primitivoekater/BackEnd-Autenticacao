const conexao= require('../conexao')
const jwt = require("jsonwebtoken");
const jwtSecret = require("../segredo");

const listarPokemons = async (req, res) => {
    const { token } = req.body;
    try{

    if (!token) {
        return res.status(404).json("O campo token é obrigatório.");
    }

    const usuario = jwt.verify(token, jwtSecret);

    const query = `select p.id, u.nome as usuario, p.nome, p.apelido, p.habilidades,
        from pokemons p left join usuarios u on u.id = p.usuario_id where p.usuario_id = $1
    `;
    const { rows: pokemons } = await conexao.query(query, [usuario.id]);

    for (const pokemon of pokemons) {
        pokemon.habilidades = pokemon.habilidades.split(',');
    }

    return res.status(200).json(pokemons);
} catch (error) {
    return res.status(400).json(error.message);
}
}


const obterPokemon = async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;

    if (!token) {
        return res.status(404).json("O campo token é obrigatório.");
    }

    try {
        const usuario = jwt.verify(token, jwtSecret);

        const query = `select p.id, u.nome as usuario, p.nome, p.apelido, p.habilidades,  
            from pokemons p left join usuarios u on u.id = p.usuario_id where p.id = $1 and p.usuario_id = $2
        `;
        const pokemon = await conexao.query(query, [id, usuario.id]);

        if (pokemon.rowCount === 0) {
            return res.status(404).json('Pokemon não encontrado');
        }

        const pokemonEncontrado = pokemon.rows[0];
        pokemonEncontrado.habilidades = pokemonEncontrado.habilidades.split(',');

        return res.status(200).json(pokemonEncontrado);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarPokemon = async (req, res) => {
    const { nome, habilidades, apelido, token } = req.body;


    if (!nome||!habilidades||!token) {
        return res.status(400).json("preencha os campos obrigatorios");
    }

    try {
        const usuario = jwt.verify(token, jwtSecret);

        const query = 'insert into pokemons (usuario_id, nome, habilidades,apelido) values ($1, $2, $3, $4)';
        const pokemon = await conexao.query(query, [usuario.id, nome, habilidades,apelido]);

        if (pokemon.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastrar o pokemon');
        }

        return res.status(200).json('Pokemon cadastrado com sucesso.')
    } catch (error) {
        return res.status(400).json(error.message);
    }
}


const atualizarPokemon = async (req, res) => {
    const { id } = req.params;
    const { apelido, token } = req.body;


    if (!apelido||!token) {
        return res.status(400).json("preencha todos os campos obrigatorios.");
    }

    try {
        const usuario = jwt.verify(token, jwtSecret);

        const Query = `select * from pokemons where id = $1 and usuario_id = $2`;
        const pokemon = await conexao.query(Query, [id, usuario.id]);

        if (pokemon.rowCount === 0) {
            return res.status(404).json('Pokemon não encontrado');
        }

        const query = 'update pokemons set apelido = $1 where id = $2';
        const pokemonAtualizado = await conexao.query(query, [apelido, id]);

        if (pokemonAtualizado.rowCount === 0) {
            return res.status(400).json('Não foi possível atualizar o pokemon');
        }

        return res.status(200).json('Pokemon foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}


const excluirPokemon = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = jwt.verify(token, jwtSecret);

        const Query = `select * from pokemons where id = $1 and usuario_id = $2`;
        const pokemon = await conexao.query(Query, [id, usuario.id]);

        if (pokemon.rowCount === 0) {
            return res.status(404).json('Pokemon não encontrado');
        }

        const query = 'delete from pokemons where id = $1';
        const pokemonExcluido = await conexao.query(query, [id]);

        if (pokemonExcluido.rowCount === 0) {
            return res.status(404).json('Não foi possível excluir o pokemon');
        }

        return res.status(200).json('Pokemon foi excluido com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports={
    listarPokemons,
    obterPokemon,
    cadastrarPokemon,
    atualizarPokemon,
    excluirPokemon
}