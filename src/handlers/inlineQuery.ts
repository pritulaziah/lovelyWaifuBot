import { Waifu, findWaifu } from '@/models/Waifu'
import Context from '@/models/Context'
import { InlineQueryResult } from 'grammy/out/platform.node'
import { InlineKeyboard } from 'grammy'

const buildUrl = (url: string) => {
  return `https://shikimori.one${url}`
}

const getWaifuTitle = (waifu: Waifu) => {
  return `${waifu.name_ru} / ${waifu.name_en}`
}

const createAnimeMessage = (animes: Waifu['animes']) => {
  return animes
    .map((anime) => `<a href="${buildUrl(anime.url)}">${anime.name_ru}</a>`)
    .join(', ')
}

const createMessage = (waifu: Waifu) => {
  return `<b>${getWaifuTitle(
    waifu
  )}</b>\n\n<b>Из аниме:</b> <i>${createAnimeMessage(waifu.animes)}</i>${
    waifu.description ? `\n\n<b>Описание:</b> <i>${waifu.description}</i>` : ''
  }`
}

const inlineQuery = async (ctx: Context) => {
  if (ctx.inlineQuery?.query && ctx.inlineQuery.query.length > 0) {
    const offset =
      ctx.inlineQuery.offset === '' ? 0 : Number(ctx.inlineQuery.offset)
    const waifuList = await findWaifu(ctx.inlineQuery.query, offset)

    const result: InlineQueryResult[] = waifuList.map((waifu) => {
      const url = buildUrl(waifu.url)

      return {
        type: 'article',
        id: String(waifu.id),
        title: getWaifuTitle(waifu),
        input_message_content: {
          message_text: createMessage(waifu),
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        },
        reply_markup: new InlineKeyboard().url('Больше на shikimori', url),
        description: waifu.description || 'Нет описания',
        url,
        hide_url: true,
        thumb_url: `${buildUrl(waifu.image)}`.split('?')[0],
        thumb_width: 48,
        thumb_height: 48,
      }
    })

    const nextOffset = waifuList.length === 5 ? String(offset + 5) : ''
    await ctx.answerInlineQuery(result, {
      next_offset: nextOffset,
      cache_time: 100,
    })
  }
}

export default inlineQuery
