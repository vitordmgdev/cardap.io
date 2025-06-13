import { PrismaClientKnownRequestError } from "@prisma/client/runtime/react-native.js";
import prisma from "../libs/prisma"
import { AppError } from "../errors/app-error";

interface CreateRestaurantInterface {
    name: string;    
    coverImg?: string;
    logoImg?: string;
    slug: string;
    description?: string;
}

const RestaurantRepository = {
    create: async (userId: string, data: CreateRestaurantInterface) => {
        try {
            const restaurant = await prisma.restaurant.create({
                data: {
                    userId,
                    name: data.name,
                    coverImg: data.coverImg,
                    logoImg: data.logoImg,
                    slug: data.slug,
                    description: data.description,
                }
            })

            return restaurant;
        } catch(err) {
            if(err instanceof PrismaClientKnownRequestError) {
                throw new AppError("Houve um erro ae kkk", 400)
            }
        }   
    },
    getByUserId: async (userId: string) => {
        try {
            const restaurants = await prisma.restaurant.findMany({
                where: { userId }
            })

            return restaurants;
        } catch(err) {
            if(err instanceof PrismaClientKnownRequestError) {
                throw new AppError("Houve um erro ae kkk", 400)
            }
        }
    },
    getBySlug: async (slug: string) => {
        try {
            const restaurant = await prisma.restaurant.findUnique({
                where: { slug }
            })

            return restaurant;
        } catch(err) {
            throw new AppError("Houve um erro ae kkk", 400)
        }
    }
};

export default RestaurantRepository;