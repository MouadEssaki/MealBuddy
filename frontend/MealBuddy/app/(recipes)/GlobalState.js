// GlobalState.js
import React, { createContext, useState } from 'react';

// Create a context for the global state
export const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
    const [ingredients, setRecipeIngredients] = useState([]);

    return (
        <GlobalContext.Provider value={{ ingredients, setRecipeIngredients }}>
            {children}
        </GlobalContext.Provider>
    );
};