/**
 * Converts a string into a URL-friendly slug.
 * Example: "Hello World!" -> "hello-world"
 */
export const slugify = (text: string | null | undefined): string => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')        // Trim - from start of text
    .replace(/-+$/, '');       // Trim - from end of text
};

/**
 * Reverses a slug back into a more readable format (though not original case)
 * Example: "hello-world" -> "Hello World"
 */
export const unslugify = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
