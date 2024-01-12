import type { CardDocument } from "~/server/models/Card.model";

export const useCard = () => {
  async function update(
    cardId: string,
    listId: string,
    data: Partial<CardDocument>
  ) {
    try {
      await useFetch(`api/lists/${listId}/cards/${cardId}`, {
        method: "PUT",
        body: data,
        watch: false,
      });
    } catch (e: any) {}
  }

  return { update };
};
