export async function getBackgroundImage(): Promise<{
  image_url: string;
  blurhash: string;
}> {
  const { image_url, blurhash } = await fetch(
    `${process.env.SERVER_API_URL}/admin/background/current`
  ).then((response) => response.json());

  return { image_url, blurhash };
}
