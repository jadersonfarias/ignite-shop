import { CartProvider, useShoppingCart } from 'use-shopping-cart'
import logoImg from '../assets/logo.svg'


import { globalStyles } from "@/styles/global";
import { Container, Header, HeaderButton } from '@/styles/pages/app';
import type { AppProps } from "next/app";
import Image from 'next/image';

import { IoBagHandleOutline } from 'react-icons/io5';
import { useState } from 'react';
import { CartPreview } from '@/components/cartPreview';



globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  const stripeToken = String(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

 //const { cartCount } = useShoppingCart();
 const [isOpen, setIsOpen] = useState(false)



  
  function openAndCloseCartPreview() {
    setIsOpen(!isOpen)
}
  return (
    <CartProvider
      mode="payment"
      cartMode="client-only"
      stripe={stripeToken}
      successUrl={`${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`}
      cancelUrl={`${process.env.NEXT_PUBLIC_URL}`}
      currency="BRL"
      allowedCountries={['US', 'GB', 'CA', 'BR']}
      billingAddressCollection={true}
      shouldPersist={true}
    >
      <Container>
        <Header>
          <Image src={logoImg} alt="" />
          <HeaderButton onClick={openAndCloseCartPreview}>
            <IoBagHandleOutline size={28}/>
              
          </HeaderButton>
          {isOpen &&
                <CartPreview
                    onClose={openAndCloseCartPreview}
                />
            }
        </Header>
        <Component {...pageProps} />
      </Container>
    </CartProvider>
  )

}
