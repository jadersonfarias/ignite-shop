
import { stripe } from "@/lib/stripe";
import { SuccessContainer, ImageContainer, ImageContent } from "@/styles/pages/success";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";


interface SuccessProps {
  costumerName: string;
  products: Product[]
}

interface Product {
  name: string
  images: string[]
}

export default function Success({ costumerName, products }: SuccessProps) {

  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>
        <meta name='robots' content='noindex' />
      </Head>
      <SuccessContainer>
        <h1>Compra efetuada</h1>
      <ImageContent>


          {
            products.map((product) => {
              return (
                <ImageContainer key={product.name}>
                  <Image src={product.images[0]} width={120} height={110} alt='' />
                </ImageContainer>
              )
            })
          }

</ImageContent>


        <p>
          Uhuul <strong>{costumerName}</strong>{products.map(product => {
            return (
              <>
                {product.name}, {' '}
              </>
            )
          })} já está a caminho da sua casa.
        </p>

        <Link href="/">
          Voltar ao catálogo
        </Link>
      </SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const sessionId = String(query.session_id);

  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = session.customer_details?.name;
  //const product = session.line_items?.data[0]?.price?.product as Stripe.Product;
  const products = session.line_items!.data.map(item => {
    return item.price!.product
  })


  return {
    props: {
      customerName,
      products,
      //   customerName,
      //   product: {
      //     name: product.name,
      //     imgUrl: product.images[0]
      //   }
      // }
    }
  }
}