"use strict";

import Stripe from "stripe";
const stripe = new Stripe('sk_test_51QPPZrHq7YgOhS8ZH7gBAQjN9ycmIY2PhlRssDya5lxCqb2jRYXNTHeSKKpQLXhQQYLAbXQP5dbLgFIgT04tr5Pk00eh3m5jqR');

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::order.order", ({ strapi }) => ({
    async create(ctx) {
        const { products } = ctx.request.body;

        try {
           /* const lineItems = await Promise.all(
                products.map(async (product) => {
                   const item = await strapi.service("api::product.product").findOne(1);
                   
                    return {
                        price_data: {
                            currency: "mxn",
                            product_data: {
                                name: item.productName,
                            },
                            unit_amount: Math.round(item.price * 100),
                        },
                        quantity: 1,
                    };
                })
            );*/

            const session = await stripe.checkout.sessions.create({
                shipping_address_collection: { allowed_countries: ["US", "CA", "MX"] },
                payment_method_types: ["card"],
                mode: "payment",
                success_url: process.env.CLIENT_URL + "/success",
                cancel_url: process.env.CLIENT_URL + "/successError",
                line_items:[
                    {
                        price_data: {
                            currency: "mxn", // Cambia a "mxn" para pesos mexicanos
                            product_data: {
                                name: "Producto de Prueba",
                                description: "Descripción del producto de prueba",
                            },
                            unit_amount: 1999, // El monto debe ser en centavos (19.99 pesos = 1999)
                        },
                        quantity: 1,
                    },
                ],
            });

            await strapi.service("api::order.order").create({data: {products, stripeId: session.id}});
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
