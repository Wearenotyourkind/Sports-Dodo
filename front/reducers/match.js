<<<<<<< HEAD
import produce from 'immer';
import { HYDRATE } from 'next-redux-wrapper';
import {
  LOAD_MATCHS_REQUEST,
  LOAD_MATCHS_SUCCESS,
  LOAD_MATCHS_FAILURE,
  LOAD_MAIN_MATCHS_REQUEST,
  LOAD_MAIN_MATCHS_SUCCESS,
  LOAD_MAIN_MATCHS_FAILURE,
} from '../sagas/match';

export const initialState = {
  isLoadingMatchs: false,
  isLoadedMatchs: false,
  loadMatchsErrorReason: '',
  matchs: null,
  matchsIndex: 0,
  hasNext: true,
};

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case HYDRATE:
        draft = { ...state, ...action.payload };
        break;
      case LOAD_MATCHS_REQUEST:
        draft.isLoadingMatchs = true;
        draft.isLoadedMatchs = false;
        break;
      case LOAD_MATCHS_SUCCESS:
        draft.isLoadingMatchs = false;
        draft.isLoadedMatchs = true;
        draft.matchs = action.data.data;
        draft.matchsIndex = action.data.nextStartIndex;
        draft.hasNext = action.data.hasNext;
        break;
      case LOAD_MATCHS_FAILURE:
        draft.isLoadingMatchs = false;
        draft.isLoadedMatchs = true;
        draft.matchs = null;
        draft.loadingErrorReason = action.error;
        break;
      case LOAD_MAIN_MATCHS_REQUEST:
        draft.isLoadingMatchs = true;
        draft.isLoadedMatchs = false;
        break;
      case LOAD_MAIN_MATCHS_SUCCESS:
        draft.isLoadingMatchs = false;
        draft.isLoadedMatchs = true;
        draft.matchs = action.data.data;
        break;
      case LOAD_MAIN_MATCHS_FAILURE:
        draft.isLoadingMatchs = false;
        draft.isLoadedMatchs = true;
        draft.matchs = null;
        draft.loadingErrorReason = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
=======
import produce from 'immer';
import { HYDRATE } from 'next-redux-wrapper';
import {
  LOAD_MATCHS_REQUEST,
  LOAD_MATCHS_SUCCESS,
  LOAD_MATCHS_FAILURE,
  LOAD_MAIN_MATCHS_REQUEST,
  LOAD_MAIN_MATCHS_SUCCESS,
  LOAD_MAIN_MATCHS_FAILURE,
  LOAD_MATCHS_HISTORY_REQUEST,
  LOAD_MATCHS_HISTORY_SUCCESS,
  LOAD_MATCHS_HISTORY_FAILURE,
} from '../sagas/match';

export const initialState = {
  isLoadingMatchs: false,
  isLoadedMatchs: false,
  loadMatchsErrorReason: '',
  matchs: null,
  matchsIndex: 0,
  hasNext: true,
  matchsHistory: null,
  isLoadingMatchsHistory: false,
  isLoadedMatchsHistory: false,
};

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case HYDRATE:
        draft = { ...state, ...action.payload };
        break;
      case LOAD_MATCHS_REQUEST:
        draft.isLoadingMatchs = true;
        draft.isLoadedMatchs = false;
        break;
      case LOAD_MATCHS_SUCCESS:
        draft.isLoadingMatchs = false;
        draft.isLoadedMatchs = true;
        draft.matchs = action.data.data;
        draft.matchsIndex = action.data.nextStartIndex;
        draft.hasNext = action.data.hasNext;
        break;
      case LOAD_MATCHS_FAILURE:
        draft.isLoadingMatchs = false;
        draft.isLoadedMatchs = true;
        draft.matchs = null;
        draft.loadingErrorReason = action.error;
        break;
      case LOAD_MAIN_MATCHS_REQUEST:
        draft.isLoadingMatchs = true;
        draft.isLoadedMatchs = false;
        break;
      case LOAD_MAIN_MATCHS_SUCCESS:
        draft.isLoadingMatchs = false;
        draft.isLoadedMatchs = true;
        draft.matchs = action.data.data;
        break;
      case LOAD_MAIN_MATCHS_FAILURE:
        draft.isLoadingMatchs = false;
        draft.isLoadedMatchs = true;
        draft.matchs = null;
        draft.loadingErrorReason = action.error;
        break;
      case LOAD_MATCHS_HISTORY_REQUEST:
        draft.isLoadingMatchs = true;
        draft.isLoadedMatchs = false;
        break;
      case LOAD_MATCHS_HISTORY_SUCCESS:
        draft.isLoadingMatchs = false;
        draft.isLoadedMatchs = true;
        draft.matchsHistory = action.data.data;
        draft.matchsIndex = action.data.nextStartIndex;
        draft.hasNext = action.data.hasNext;
        break;
      case LOAD_MATCHS_HISTORY_FAILURE:
        draft.isLoadingMatchs = false;
        draft.isLoadedMatchs = true;
        draft.matchsHistory = null;
        draft.loadingErrorReason = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
>>>>>>> e0a8ce48c0a0fb86312e71d8a46d8eac64cbe2da
