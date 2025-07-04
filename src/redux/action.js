export const SET_SECTIONS = 'SET_SECTIONS';
export const SET_PAGE_SECTIONS = 'SET_PAGE_SECTIONS';

export const setSections = (sections) => ({
  type: SET_SECTIONS,
  payload: sections,
});
export const setPageSections = (pageSections) => ({
  type: SET_PAGE_SECTIONS,
  payload: pageSections,
});



