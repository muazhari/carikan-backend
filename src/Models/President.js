import { Schema, model } from "mongoose"

const PresidentSchema = Schema({
  name: String,
  party: String,
  term: String
})

const President = model("President", PresidentSchema)

export default President
