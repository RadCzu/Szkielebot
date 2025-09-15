import {Schema, Types, model} from "mongoose";

interface CiekawostkaType {
  _id?: Types.ObjectId;
  guildId: string;
  text: string
}

const ciekawostkaSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})

const CiekawostkaModel = model<CiekawostkaType & Document>('Ciekawostka', ciekawostkaSchema);

export default CiekawostkaModel;
export {CiekawostkaType};