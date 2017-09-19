import * as mongoose from 'mongoose';

const CardSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  layout: { type: String, required: true },
  cmc: { type: Number, required: true },
  colors: [{ type: String }],
  colorIdentity: [{ type: String }],
  type: { type: String, required: true },
  supertypes: [{ type: String }],
  types: [{ type: String, required: true }],
  subtypes: [{ type: String }],
  rarity: { type: String, required: true },
  setCode: { type: String, required: true },
  setName: { type: String, required: true },
  text: { type: String },
  flavor: { type: String },
  number: { type: Number, required: true },
  power: { type: String },
  toughness: { type: String },
  loyalty: { type: Number },
  legalities: [
    {
      format: { type: String, required: true },
      legality: { type: String, requird: true }
    }
  ],
  multiverseid: { type: Number, required: true },
  names: [{ type: String }],
  manaCost: { type: String },
  rulings: [
    {
      date: { type: String },
      text: { type: String }
    }
  ],
  printings: [{ type: String }]
});

const Card = mongoose.model('Card', CardSchema);

export default Card;
