import React from 'react';

const renderOption = ({ accommodation, user, component: Component }) => {
  const { status } = accommodation;
  const { user_type } = user;

  const isActive = status === "Active";
  const isStudent = user_type === "student";

  if (
    (isActive && (user_type === "staff" || user_type === "admin")) ||
    (status === "Delayed Payment" && ["student", "staff", "admin"].includes(user_type))
  ) {
    return <Component />;
  }

  return null;
};

export default renderOption;
