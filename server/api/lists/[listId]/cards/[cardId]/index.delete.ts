import { Card } from "~/server/models/Card.model";
import { List } from "~/server/models/List.model";
import { UserDocument } from "~/server/models/User.model";

export default defineEventHandler(async (event) => {
  const listId = getRouterParam(event, "listId");
  const cardId = getRouterParam(event, "cardId");
  const user = event.context.user as UserDocument;

  const card = Card.findOneAndDelete({
    _id: cardId,
    list: listId,
    owner: user._id,
  });

  if (!card) {
    throw createError({
      statusCode: 404,
      message: "Card not found",
    });
  }

  await List.findOneAndUpdate(
    {
      _id: listId,
      owner: user._id,
    },
    {
      $pull: {
        // @ts-ignore
        cards: card._id,
      },
    }
  );

  event.node.res.statusCode = 204;

  return true;
});
