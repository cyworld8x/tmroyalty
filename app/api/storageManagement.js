import { createStore } from 'redux';
import StorageReducer from './storageReducer';

const StoreManagement = createStore(StorageReducer);

export default StoreManagement;