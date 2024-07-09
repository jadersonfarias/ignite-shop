import { stripe } from "@/lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { CartEntry } from "use-shopping-cart/core";


interface Request {
  cartItems: {
      cartItem: CartEntry
  }[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  //const { priceId } = req.body;
  const { cartItems } = req.body as Request
  console.log(cartItems)
 
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (!cartItems) return res.status(400).json({ error: 'Price not found.' })
  // if (!priceId) {
  //   return res.status(400).json({ error: 'Price not found.' });
  // }
  
  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_URL}/`;

  const cartItemsFormatted = cartItems.map((product) => {
    const productFormatted = {
        price: product.cartItem.defaultPriceId,
        quantity: 1,
    }
    return productFormatted
})

    
    const checkoutSession = await stripe.checkout.sessions.create({
        success_url: successUrl,
        cancel_url: cancelUrl,  

        mode: 'payment',
         line_items: cartItemsFormatted//[
        //     {
        //       price: priceId,
        //       quantity: 1,
        //     }
        // ]
    })

    return res.status(201).json({
      checkoutUrl: checkoutSession.url
    })
}