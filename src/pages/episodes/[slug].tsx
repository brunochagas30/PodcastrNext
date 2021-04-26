import { GetStaticProps, GetStaticPaths } from "next"
import Image from "next/image"
import { api } from "../../services/api"
import Link from 'next/link'


import { format, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import styles from "./episode.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"



//Não utilizar muita re-utilização para evitar reutilização prematura, visto que a tipagem do componente no Typescript é diferente em alguns casos -> Demonstração visual dos dados.

//Uma tipagem por componente!


type Episode = {
  id: string
  title: string
  thumbnail: string
  duration: number
  durationAsString: string
  publishedAt: string
  url: string
  members: string
  description: string
}

type EpisodeProps = {
  episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>

        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar Epísódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params //Método utilizado para acessar o ID do episódio, pois não é possível utilizar o useRouter, pois o mesmo só pode ser usado dentro de componentes. Visto que slug é o nome colocado no arquivo, podendo ser alterado conforme o nome do mesmo
  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,

    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),

    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),

    description: data.description,
    url: data.file.url,
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, //24 horas
  }
}
