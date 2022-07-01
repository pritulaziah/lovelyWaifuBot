import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  options: { customName: 'waifu', allowMixed: 0 },
  schemaOptions: { collection: 'waifu' },
})
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
  @prop({ required: true })
  animes!: Array<{ name_ru: string; name_en: string; url: string }>
}

const WaifuModel = getModelForClass(Waifu)

export function findWaifu(query: string, offset: number) {
  const waifuRegexp = new RegExp(`.*${query}.*`, 'i')

  return WaifuModel.find({
    $or: [{ name_ru: waifuRegexp }, { name_en: waifuRegexp }],
  })
    .limit(5)
    .skip(offset)
}
