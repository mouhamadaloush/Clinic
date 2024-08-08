export const sortDateProgressive = (dates) => {
  dates.sort((a, b) => {
    const dateA = new Date(a.chosen_date);
    const dateB = new Date(b.chosen_date);
    return dateA - dateB; // Sort in progressive order
  });
};

export const sortDateDescending = (dates) => {
  dates.sort((a, b) => {
    const dateA = new Date(a.chosen_date);
    const dateB = new Date(b.chosen_date);
    return dateB - dateA; // Sort in descending order
  });
};
