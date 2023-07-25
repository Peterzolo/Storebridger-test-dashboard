export const capitalizeString = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1, str.length).toLowerCase();

export const lowerCase = (str: string): string => str.toLowerCase();

export const upperCase = (str: string): string => str.toUpperCase();

export const pascalCase = (str: string): string => {
  return str.split(' ').map(capitalizeString).join('');
};

export const snakeCase = (str: string): string => {
  return str.split(' ').map(lowerCase).join('_');
};

export const kebabCase = (str: string): string => {
  return str.split(' ').map(lowerCase).join('-');
};

export const titleCase = (str: string): string => {
  return str.split(' ').map(capitalizeString).join(' ');
};

export const paramCase = (str: string): string => {
  return str.split(' ').map(lowerCase).join('-');
};

export const sentenceCaseWithDashes = (str: string): string => {
  return str.split(' ').map(capitalizeString).join('-');
};

export const sentenceCaseWithUnderscores = (str: string): string => {
  return str.split(' ').map(capitalizeString).join('_');
};

export const sentenceCaseWithTildes = (str: string): string => {
  return str.split(' ').map(capitalizeString).join('~');
};
