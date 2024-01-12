import { Validator } from "#nuxt-server-utils";
import CardSchema from "~/schemas/Card.schema";
import { Card } from "~/server/models/Card.model";
import { List } from "~/server/models/List.model";
import { UserDocument } from "~/server/models/User.model";

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserDocument;

  const listId = getRouterParam(event, "listId");

  const body = await readBody(event);

  Validator.validateSchema(CardSchema, body);

  const card = await Card.create({
    ...body,
    list: listId,
    owner: user._id,
  });

  await List.findOneAndUpdate(
    {
      _id: listId,
      owner: user._id,
    },
    {
      $push: {
        cards: card._id,
      },
    }
  );

  return card;
});
