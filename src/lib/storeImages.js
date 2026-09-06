// Cover artwork for each store. Placeholder URLs are swapped for permanent
// images by the platform once generation completes.
export const storeImages = {
  s1: "https://media.base44.com/images/public/6a9d281403a0e5e057b8d804/4819d886a_generated_00250ac0.jpg",
  s2: "https://media.base44.com/images/public/6a9d281403a0e5e057b8d804/14742fd19_generated_d3d4e81d.jpg",
};

export function getStoreImage(id) {
  return storeImages[id] || storeImages.s1;
}