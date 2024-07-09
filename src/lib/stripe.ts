import Stripe from 'stripe'

export const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
    apiVersion: "2024-06-20",
    appInfo: {
      name: "Ignite Shop",
    },
  });