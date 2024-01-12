import type { ListDocument } from "~/server/models/List.model";

export const useList = (boardId: string) => {
  async function handleSort(e: any, lists: ListDocument[]) {
    await useFetch(`/api/boards/${boardId}`, {
      method: "PUT",
      body: {
        lists: lists.flatMap((i: any) => i._id),
      },
      watch: false,
    });
  }

  async function destroy(listId: string) {
    try {
      await useFetch(`/api/lists/${listId}`, {
        method: "DELETE",
      });
      useToast().add({
        title: "List deleted",
      });
    } catch (e: any) {
      console.log(e);
      useToast().add({
        title: "Error",
        description: e.message || "Something went wrong",
      });
    }
  }

  async function update(listId: string, data: Partial<ListDocument>) {
    try {
      await useFetch(`/api/lists/${listId}`, {
        method: "PUT",
        body: data,
        watch: false,
      });
    } catch (e: any) {
      console.log(e);
      useToast().add({
        title: "Error",
        description: e.message || "Something went wrong",
      });
    }
  }

  return { handleSort, destroy, update };
};
