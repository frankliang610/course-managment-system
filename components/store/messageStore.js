import { createContext, useContext, useReducer } from 'react';

const initialState = {
  total: 0,
  notification: 0,
  message: 0,
};

export const messageReducer = (state = initialState, action) => {
  const type = action.payload?.type;
  const count = action.payload?.count;

  switch (action.type) {
    case 'increment':
      return {
        ...state,
        [type]: state[type] + count,
        total: state.total + count,
      };
    case 'decrement':
      return {
        ...state,
        [type]: state[type] - count,
        total: state.total - count,
      };
    case 'reset':
      return initialState;
    default:
      return state;
  }
};

export const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, initialState);

  return (
    <MessageContext.Provider value={{ messagesState: state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
