export const useBoard = () => {
  async function destroy(boardId: string) {
    try {
      await useFetch(`/api/boards/${boardId}`, {
        method: "DELETE",
      });

      useToast().add({
        title: "Board deleted!",
      });
    } catch (e: any) {
      useToast().add({
        title: "Error",
        description: e.message || "Something went wrong",
      });
    }
  }

  return { destroy };
};
