import z from "zod";

const RestaurantSchema = {
    create: z.object({
        name: z.string(),
        coverImg: z.string().optional(),
        logoImg: z.string().optional(),
        slug: z.string(),
        description: z.string().optional(),
    }),
    getBySlug: z.object({
        slug: z.string()
    })
};

export default RestaurantSchema;