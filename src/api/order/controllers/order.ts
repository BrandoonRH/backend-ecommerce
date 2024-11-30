"use strict";

import Stripe from "stripe";
const stripe = new Stripe('sk_test_51QPPZrHq7YgOhS8ZH7gBAQjN9ycmIY2PhlRssDya5lxCqb2jRYXNTHeSKKpQLXhQQYLAbXQP5dbLgFIgT04tr5Pk00eh3m5jqR');

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::order.order", ({ strapi }) => ({
    async create(ctx) {
        const { products } = ctx.request.body;

        try {

           const lineItems = await Promise.all(
                products.map(async (product) => {

                   //const item = await strapi.service("api::product.product").findOne(product.id);

                    return {
                        price_data: {
                            currency: "mxn",
                            product_data: {
                                name: product.productName,
                            },
                            unit_amount: Math.round(product.price * 100),
                        },
                        quantity: 1,
                    };
                })
            );

            const session = await stripe.checkout.sessions.create({
                shipping_address_collection: { allowed_countries: ["US", "CA", "MX"] },
                payment_method_types: ["card"],
                mode: "payment",
                success_url: process.env.CLIENT_URL + "/success",
                cancel_url: process.env.CLIENT_URL + "/successError",
                line_items: lineItems
            });

            await strapi.service("api::order.order").create({data: {products: lineItems, stripeId: session.id}});
            //console.log(session)
            return { stripeSession: session };

        } catch (error) {
            return {error: error.message};
           /* console.error("Error al crear sesión de Stripe:", error);
            ctx.response.status = 500;
            return { error: "Error al crear la sesión de Stripe." };*/
        }
    },
}));
