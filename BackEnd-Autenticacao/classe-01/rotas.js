const express = require ('express')
const pokemons= require('./controladores/pokemons')
const usuarios= require('./controladores/usuarios')

const rotas =express();

//pokemons
rotas.get('/pokemons',pokemons.listarPokemons)
rotas.get('/pokemons/:id', pokemons.obterPokemon)
rotas.post('/pokemons',pokemons.cadastrarPokemon )
rotas.put('/pokemons/:id', pokemons.atualizarPokemon)
rotas.delete('/pokemon/:id', pokemons.excluirPokemon)

//usuarios
rotas.post('/usuarios',usuarios.cadastrarUsuario )
rotas.post('/logIn',usuarios.logIn )



module.exports= rotas   