import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({})
export class Waifu {
  @prop({ required: true, index: true, unique: true })
  id!: number
  @prop({ required: true })
  name_ru!: string
  @prop({ required: true })
  name_en!: string
  @prop({ required: true })
  image!: string
  @prop({ required: true })
  url!: string
  @prop({ required: true })
  description!: string
}

const WaifuModel = getModelForClass(Waifu)

export function findWaifu(query: string, offset: number) {
  const regexp = new RegExp(`.*${query}*.`, 'i')

  return WaifuModel.find({ $or: [{ name_ru: regexp }, { name_en: regexp }] })
    .limit(5)
    .skip(offset)
}
