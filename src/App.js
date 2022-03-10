import { useState, useEffect } from "react";

function App() {
  let [pokemon_list, set_pokemon_list] = useState([]);

  let [is_disable_previous, set_is_disable_previous] = useState(true);

  let [is_disable_next, set_is_disable_next] = useState(false);

  const fetch_api = async () => {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon`);

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

    for (let i = 0; i <= 2; i++) {
      res.results[i].previous = res.previous;

      res.results[i].next = res.next;

      pokemon_object_array.push(res.results[i]);
    }

    set_pokemon_list(pokemon_object_array);
  }, []);

  useEffect(async () => {
    let updated_pokemon_object_array = [];

    for (let i = 0; i < pokemon_list.length; i++) {
      let res = await fetch_pokemon_stats(pokemon_list[i].url);

      updated_pokemon_object_array.push({
        id: res.id,
        url: res.sprites.front_default,
      });
    }

    let updated_pokemon_list = pokemon_list.map((pokemon, i) => {
      pokemon.id = updated_pokemon_object_array[i].id;

      pokemon.url = updated_pokemon_object_array[i].url;

      return pokemon;
    });

    set_pokemon_list(updated_pokemon_list);
  }, []);

  const get_prev_set = async () => {
    if (pokemon_list[0].previous) {
      let response = await fetch(`${pokemon_list[0].previous}`);

      let data = await response.json();

      let pokemon_object_array = [];

      for (let i = 0; i <= 2; i++) {
        console.log(data.previous);

        data.results[i].previous = data.previous;

        data.results[i].next = data.next;

        pokemon_object_array.push(data.results[i]);
      }

      set_pokemon_list(pokemon_object_array);
    }
  };

  const get_next_set = async () => {
    if (pokemon_list[0].next) {
      let response = await fetch(`${pokemon_list[0].next}`);

      let data = await response.json();

      let pokemon_object_array = [];

      for (let i = 0; i <= 2; i++) {
        data.results[i].previous = data.previous;

        data.results[i].next = data.next;

        pokemon_object_array.push(data.results[i]);
      }

      set_pokemon_list(pokemon_object_array);
    }
  };

  return (
    <div>
      <button
        onClick={async () => {
          await get_prev_set();
        }}
        // disabled={is_disable_previous}
      >
        Previous
      </button>
      {pokemon_list.map((pokemon) => {
        return (
          <div key={pokemon.url}>
            <div>{pokemon.name}</div>

            <img src={pokemon.url} alt="" />
          </div>
        );
      })}
      <button
        onClick={async () => {
          await get_next_set();
        }}
        // disabled={is_disable_next}
      >
        Next
      </button>
    </div>
  );
}

export default App;
