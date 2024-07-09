
import { HomeContainer, Product } from "@/styles/pages/home";
import Image from "next/image";
import Head from 'next/head'

import { useKeenSlider } from 'keen-slider/react'


import 'keen-slider/keen-slider.min.css'
import { stripe } from "@/lib/stripe";
import { GetStaticProps } from "next";
import Stripe from "stripe";
import Link from "next/link";

interface HomeProps {
  products: {
    id: string
    name: string
    imgUrl: string
    price: number
  }[]
}

export default function Home({ products }: HomeProps) {

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  return (
    <>
    <Head>
      <title>Home | Ignite Shop</title>
    </Head>

    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map(product => {
        return (
          <Link href={`/Product/${product.id}`} key={product.id} prefetch={false}>
            <Product
              className='keen-slider__slide'
            >
              <Image src={product.imgUrl} width={520} height={480} alt="" />
              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        )
      })}


    </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {    //getServerSideProps = ssr  GetServerSideProps = tipagem
  const response = await stripe.products.list({                //páginas estaticas são iguais para todos os usuarios 
    expand: ['data.default_price']
  })

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imgUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount === null ? 0 : price.unit_amount / 100)
    }

  })


  return {
    props: {
      products,
    },

    revalidate: 60 * 60 * 2,
  }
}