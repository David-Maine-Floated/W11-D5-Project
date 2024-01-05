import { useSelector } from "react-redux";

export const LOAD_ITEMS = "items/LOAD_ITEMS";
export const UPDATE_ITEM = "items/UPDATE_ITEM";
export const REMOVE_ITEM = "items/REMOVE_ITEM";
export const ADD_ITEM = "items/ADD_ITEM";


const load = (items, pokemonId) => ({
  type: LOAD_ITEMS,
  items,
  pokemonId
});

const update = (item) => ({
  type: UPDATE_ITEM,
  item
});

const add = (item) => ({
  type: ADD_ITEM,
  item
});

const remove = (itemId, pokemonId) => ({
  type: REMOVE_ITEM,
  itemId,
  pokemonId
});

export const addItem = (item, pokemonId) => async (dispatch) => {
  const response = await fetch(`/api/items/${pokemonId}`, {
    method: 'PUT',
    body: JSON.stringify(item),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  if(response.ok) {
    dispatch(add(item))
  }
}

export const removeItem = (itemId) => async (dispatch, getState) => {

  const state = getState()
  //  debugger
  const item = state.items[itemId] 
 
  const response = await fetch(`/api/items/${itemId}`,{
    method: 'DELETE',
    body: JSON.stringify(item),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })



  if(response.ok) {
    dispatch(remove(itemId, item.pokemonId ))
  }

}


export const getPokemonItems = (pokemonId) =>  async (dispatch) => {
  const response = await fetch(`/api/pokemon/${pokemonId}/items`)
  
  if(response.ok) {
    const data = await response.json();
    dispatch(load(data, pokemonId))
  }
} 

const initialState = {};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ITEMS: {
      const newItems = {};
      action.items.forEach(item => {
        newItems[item.id] = item;
      })
      return {
        ...state,
        ...newItems
      }
    }
    case REMOVE_ITEM: {
      const newState = { ...state };
      delete newState[action.itemId];
      return newState;
    }
    case ADD_ITEM:
    case UPDATE_ITEM: 
      return {
        ...state,
        [action.item.id]: action.item
      };
    default:
      return state;
  }
};

export default itemsReducer;
