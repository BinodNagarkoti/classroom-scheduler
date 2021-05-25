import {configureStore} from '@reduxjs/toolkit';
import classesReducer from './classes';


const reducer = {
    classes: classesReducer
}

const store = configureStore({
    reducer
})

export default store;