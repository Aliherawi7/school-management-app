import i18n from "../locale/locale";


export const initialState = {
  authentication: {
    isAuthenticated: true,
  },
  term: null,
  locale: 'fa',
  askingModal: { show: false, message: "", btnAction: null, id: null },
  confirmModal: { show: false, message: "", iconType: "" },
  globalLoading: false,
  navbarCollapse: false,
  customerForSaleFactor: null,
  systemConfig: null
};

export const actionTypes = {
  CHANGE_LOCALE: "CHANGE_LOCALE",
  SHOW_ASKING_MODAL: "SHOW_ASKING_MODAL",
  HIDE_ASKING_MODAL: "HIDE_ASKING_MODAL",
  SHOW_CONFIRM_MODAL: "SHOW_CONFIRM_MODAL",
  HIDE_CONFIRM_MODAL: "HIDE_CONFIRM_MODAL",
  SET_GLOBAL_LOADING: "SET_GLOBAL_LOADING",
  HIDE_RESTRICT_WARNING: "HIDE_RESTRICT_WARNING",
  SHOW_RESTRICT_WARNING: "SHOW_RESTRICT_WARNING",
  SET_SMALL_LOADING: "SET_SMALL_LOADING",
  COLLAPSE_NAVBAR: 'COLLAPSE_NAVBAR',
  SET_SYSTEM_CONFIG: "SET_SYSTEM_CONFIG"
};

const reducer = (state, action) => {

  switch (action.type) {
    case actionTypes.SET_SYSTEM_CONFIG:
      return {
        ...state,
        systemConfig: action.payload,
      };

    case actionTypes.COLLAPSE_NAVBAR:
      return {
        ...state,
        navbarCollapse: !state.navbarCollapse,
      };

    case actionTypes.SET_FACTOR:
      return {
        ...state,
        factor: action.payload
      }
    case actionTypes.ADD_CUSTOMER_TO_SALE_FACTOR:
      return {
        ...state,
        customerForSaleFactor: action.payload
      }


    case actionTypes.CHANGE_LOCALE:
      i18n.changeLanguage(action.payload.lang);
      if (action.payload.lang === "fa") {
        document.body.classList.remove("ltr");
        document.body.classList.toggle("rtl");
      } else if (action.payload.lang === "en") {
        document.body.classList.remove("rtl");
        document.body.classList.toggle("ltr");
      }
      localStorage.setItem("locale", action.payload.lang);
      return {
        ...state,
        locale: action.payload.lang,
      };
    case actionTypes.SHOW_ASKING_MODAL:
      return {
        ...state,
        askingModal: {
          show: action.payload.show,
          message: action.payload.message,
          iconType: action.payload?.iconType,
          btnAction: action.payload.btnAction,
          id: action.payload.id,
        },
      };
    case actionTypes.HIDE_ASKING_MODAL:
      return {
        ...state,
        askingModal: {
          show: false,
          message: "",
          btnAction: null,
        },
      };
    case actionTypes.SHOW_CONFIRM_MODAL:
      return {
        ...state,
        confirmModal: {
          show: true,
          message: action.payload.message,
          iconType: action.payload.iconType,
        },
      };
    case actionTypes.HIDE_CONFIRM_MODAL:
      return {
        ...state,
        confirmModal: {
          show: false,
          message: null,
          iconType: null,
        },
      };
    case actionTypes.SET_GLOBAL_LOADING:
      return {
        ...state,
        globalLoading: action.payload.value,
      };
    case actionTypes.SHOW_RESTRICT_WARNING:
      return {
        ...state,
        restrictWarning: {
          show: action.payload.show,
          confirmHandler: action.payload.confirmHandler,
        },
      };
    case actionTypes.HIDE_RESTRICT_WARNING:
      return {
        ...state,
        restrictWarning: {
          show: false,
        },
      };
    case actionTypes.SET_SMALL_LOADING:
      return {
        ...state,
        smallLoading: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
