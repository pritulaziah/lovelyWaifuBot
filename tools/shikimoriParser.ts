import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { cwd } from 'process'
import axios from 'axios'
import { resolve } from 'path'
import { parse } from 'node-html-parser'
import { Waifu } from '../src/models/Waifu'
import { getModelForClass } from '@typegoose/typegoose'

const range = (start: number, end: number) => {
  const result: number[] = []

  for (let i = start; i < end; i++) {
    result.push(i)
  }

  return result
}

dotenv.config({ path: resolve(cwd(), '.env') })

const WaifuModel = getModelForClass(Waifu)

interface Character {
  id: number
  name: string
  russian: string
  image: {
    original: string
    preview: string
    x96: string
    x48: string
  }
  url: string
  altname: string | null
  japanese: string | null
  description: string | null
  description_html: string | null
  description_source: string | null
  favoured: boolean
  thread_id: number
  topic_id: number
  updated_at: string
  seyu: unknown[]
  animes: Array<{
    id: number
    name: string
    russian: string
    image: {
      original: string
      preview: string
      x96: string
      x48: string
    }
    url: string
    kind: string
    score: string
    status: string
    episodes: number
    episodes_aired: number
    aired_on: string | null
    released_on: string | null
    roles: unknown[]
    role: string
  }>
  mangas: unknown[]
}

;(async () => {
  try {
    await mongoose.connect(process.env.MONGO as string)

    for (const characterId of range(8, 9)) {
      const response = await axios.get<Character>(
        `https://shikimori.one/api/characters/${characterId}`
      )

      if (response.data) {
        const animes = response.data.animes.map((anime) => ({
          name_ru: anime.russian,
          name_en: anime.name,
          url: anime.url,
        }))
        const description =
          response.data.description_html &&
          parse(response.data.description_html).innerText
        const image = response.data.image.preview
        const newWaifu = new WaifuModel({
          id: response.data.id,
          name_ru: response.data.russian,
          name_en: response.data.name,
          url: response.data.url,
          image: image,
          description: description,
          animes: animes,
        })
      }
    }
  } catch (error) {
    console.log(error)
  }

  console.log('Finish')
  mongoose.disconnect()
})()
