import { createContext, useEffect, useReducer } from "react";

const symModalId = Symbol("ModalId");

const initialState = {};

const ModalContext = createContext(initialState);

const reducer = (state = initialState, action) => {
  const { id } = action.payload || {};
  switch (action.type) {
    case "show":
      return { ...state, [id]: { ...state[id] } };
    case "hide":
      const newState = { ...state };
      delete newState[id];
      return newState;
    default:
      return state;
  }
};
const showAction = (id) => ({ type: "show", payload: { id } });

const hideAction = (id) => ({ type: "hide", payload: { id } });

let dispatch;
const modalsCallback = {};
const hideModalsCallback = {};
const Store = new Map();

let uidSeed = 0;
const getModalId = (modal) => {
  if (!modal[symModalId]) modal[symModalId] = `modal_${uidSeed++}`;
  return modal[symModalId];
};
function register(id, modal) {
  Store.set(id, { id, Comp: modal });
}
const promisifyCallback = (callback, modalId) => {
  let theResolve, theReject;
  const promise = new Promise((resolve, reject) => {
    theResolve = resolve;
    theReject = reject;
  });

  callback[modalId] = {
    resolve: theResolve,
    reject: theReject,
    promise
  };
  return callback[modalId].promise;
};
function show(modal) {
  const modalId = getModalId(modal);
  register(modalId, modal);
  dispatch(showAction(modalId, modal));
  return promisifyCallback(modalsCallback, modalId);
}
function hide(modal) {
  const modalId = getModalId(modal);
  dispatch(hideAction(modalId, modal));
  delete hideModalsCallback[modalId];
  return promisifyCallback(hideModalsCallback, modalId);
}

function Provider({ children }) {
  const arr = useReducer(reducer, initialState);
  const modalIds = Object.keys(arr[0]);

  dispatch = arr[1];
  const toRender = modalIds.map((id) => ({ id, Comp: Store.get(id).Comp }));
  useEffect(() => {
    modalIds.forEach((id) => modalsCallback[id].resolve());
  }, [modalIds]);

  return (
    <ModalContext.Provider value={arr[0]}>
      {children}
      <div className="modals">
        {toRender.map((t) => (
          <t.Comp key={t.id} />
        ))}
      </div>
    </ModalContext.Provider>
  );
}

const Modal = { Provider, show, hide };
export default Modal;
