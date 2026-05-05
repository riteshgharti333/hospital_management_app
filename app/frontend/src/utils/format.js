export const formatDate = (value, locale = "en-GB") => {
  const date = new Date(value);

  if (isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


export const formatAge = (dob) => {
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return "-";

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) age--;

  return age;
};