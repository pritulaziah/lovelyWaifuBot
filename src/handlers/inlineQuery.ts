import { Waifu, findWaifu } from '@/models/Waifu'
import Context from '@/models/Context'
import { InlineQueryResult } from 'grammy/out/platform.node'

const baseUrl = 'https://shikimori.one/'

const getWaifuTitle = (waifu: Waifu) => {
  return `${waifu.name_ru} / ${waifu.name_en}`
}

const createMessage = (waifu: Waifu) => {
  return `<i>${getWaifuTitle(waifu)}</i>`
}

const inlineQuery = async (ctx: Context) => {
  if (ctx.inlineQuery?.query && ctx.inlineQuery.query.length > 0) {
    const offset =
      ctx.inlineQuery.offset === '' ? 0 : Number(ctx.inlineQuery.offset)
    const waifuList = await findWaifu(ctx.inlineQuery.query, offset)

    const result: InlineQueryResult[] = waifuList.map((waifu) => {
      return {
        type: 'article',
        id: String(waifu.id),
        title: getWaifuTitle(waifu),
        input_message_content: {
          message_text: createMessage(waifu),
          parse_mode: 'HTML',
        },
        description: waifu.description,
        thumb_url: `${baseUrl}${waifu.image}`,
        thumb_width: 24,
        thumb_height: 24,
      }
    })

    const nextOffset = waifuList.length === 5 ? String(offset + 5) : ''
    await ctx.answerInlineQuery(result, { next_offset: nextOffset })
  }
}

export default inlineQuery
