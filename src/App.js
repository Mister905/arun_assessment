import { useState, useEffect } from "react";

function App() {

  let [pokemon_list, set_pokemon_list] = useState([]);

  let [is_initial_load, set_is_initial_load] = useState(false);

  const fetch_api = async () => {

    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=3`);

    let data = response.json();

    return data;
  };

  const fetch_pokemon_stats = async (pokemon_url) => {

    let response = await fetch(`${pokemon_url}`);

    let data = response.json();

    return data;
  };

  useEffect(async () => {

    let res = await fetch_api();

    let pokemon_object_array = [];

    console.log(res);

    for (let i = 0; i <= 2; i++) {

      res.results[i].previous = res.previous;

      res.results[i].next = res.next;

      pokemon_object_array.push(res.results[i]);
    }

    set_pokemon_list(pokemon_object_array);

    set_is_initial_load(true);

  }, []);

  useEffect(async () => {

    let updated_pokemon_object_array = [];

    for (let i = 0; i < pokemon_list.length; i++) {

      let res = await fetch_pokemon_stats(pokemon_list[i].url);

      updated_pokemon_object_array.push({
        id: res.id,
        sprite_url: res.sprites.front_default,
      });
    }

    let updated_pokemon_list = pokemon_list.map((pokemon, i) => {

      pokemon.id = updated_pokemon_object_array[i].id;

      pokemon.sprite_url = updated_pokemon_object_array[i].sprite_url;

      return pokemon;
    });

    set_pokemon_list(updated_pokemon_list);

  }, [is_initial_load]);

  const get_prev_set = async () => {

    if (pokemon_list[0].previous) {

      let res = await fetch(`${pokemon_list[0].previous}`);

      let data = await res.json();

      let pokemon_object_array = [];

      for (let i = 0; i <= 2; i++) {

        data.results[i].previous = data.previous;

        data.results[i].next = data.next;

        pokemon_object_array.push(data.results[i]);
      }

      let updated_pokemon_object_array = [];

      for (let i = 0; i < pokemon_list.length; i++) {

        let res = await fetch_pokemon_stats(pokemon_object_array[i].url);

        updated_pokemon_object_array.push({
          id: res.id,
          sprite_url: res.sprites.front_default,
          name: pokemon_object_array[i].name,
          next: pokemon_object_array[i].next,
          previous: pokemon_object_array[i].previous,
          url: pokemon_object_array[i].url,
        });
      }

      set_pokemon_list(updated_pokemon_object_array);
    }
  };

  const get_next_set = async () => {

    if (pokemon_list[0].next) {

      let res = await fetch(`${pokemon_list[0].next}`);

      let data = await res.json();

      let pokemon_object_array = [];

      for (let i = 0; i <= 2; i++) {

        data.results[i].previous = data.previous;

        data.results[i].next = data.next;

        pokemon_object_array.push(data.results[i]);
      }

      let updated_pokemon_object_array = [];

      for (let i = 0; i < pokemon_list.length; i++) {

        let res = await fetch_pokemon_stats(pokemon_object_array[i].url);

        updated_pokemon_object_array.push({
          id: res.id,
          sprite_url: res.sprites.front_default,
          name: pokemon_object_array[i].name,
          next: pokemon_object_array[i].next,
          previous: pokemon_object_array[i].previous,
          url: pokemon_object_array[i].url,
        });
      }

      set_pokemon_list(updated_pokemon_object_array);
    }
  };

  return (
    <div>
      <button
        onClick={async () => {
          await get_prev_set();
        }}
        disabled={pokemon_list[0] && pokemon_list[0].previous ? "" : true}
      >
        Previous
      </button>
      {pokemon_list.map((pokemon) => {
        return (
          <div key={pokemon.url}>
            <div>{`${pokemon.name} - Id: ${pokemon.id}`}</div>
            <img src={pokemon.sprite_url} alt="" />
          </div>
        );
      })}
      <button
        onClick={async () => {
          await get_next_set();
        }}
        disabled={pokemon_list[0] && pokemon_list[0].next ? "" : true}
      >
        Next
      </button>
    </div>
  );
}

export default App;
