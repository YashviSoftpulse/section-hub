const initialState = {
  sections: [],
  pageSections: [],
};

const sectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SECTIONS":
      return {
        ...state,
        sections: action.payload,
      };

    case "SET_PAGE_SECTIONS":
      return {
        ...state,
        pageSections: action.payload,
      };

    default:
      return state;
  }
};

export default sectionsReducer;
